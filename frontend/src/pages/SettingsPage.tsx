import React, { useState } from 'react';
import { Household, Room } from '../types/inventory.types.js';
import {
  Copy,
  Check,
  Users,
  Plus,
  DoorClosed,
  LogOut,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../api/items.api.js';

interface SettingsPageProps {
  household: Household | null;
  rooms: Room[];
  onHouseholdUpdated: () => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  household,
  rooms,
  onHouseholdUpdated,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Room editing state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);

  // Deletion & alerts
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomSuccess, setRoomSuccess] = useState<string | null>(null);

  const handleCopyCode = () => {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomError(null);
    setRoomSuccess(null);
    if (!newRoomName.trim()) return;

    setIsAddingRoom(true);
    try {
      await api.createRoom(newRoomName.trim());
      setNewRoomName('');
      setRoomSuccess(`Pièce « ${newRoomName.trim()} » ajoutée avec succès !`);
      setTimeout(() => setRoomSuccess(null), 3000);
      onHouseholdUpdated();
    } catch (err: any) {
      setRoomError(err.message || 'Impossible de créer la pièce');
    } finally {
      setIsAddingRoom(false);
    }
  };

  const handleStartEdit = (room: Room) => {
    setRoomError(null);
    setRoomSuccess(null);
    setEditingRoomId(room.id);
    setEditingRoomName(room.name);
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditingRoomName('');
  };

  const handleSaveEdit = async (roomId: string) => {
    setRoomError(null);
    setRoomSuccess(null);
    if (!editingRoomName.trim()) {
      setRoomError('Le nom de la pièce ne peut pas être vide');
      return;
    }

    setIsUpdatingRoom(true);
    try {
      await api.updateRoom(roomId, { name: editingRoomName.trim() });
      setEditingRoomId(null);
      setRoomSuccess('Nom de la pièce modifié avec succès !');
      setTimeout(() => setRoomSuccess(null), 3000);
      onHouseholdUpdated();
    } catch (err: any) {
      setRoomError(err.message || 'Impossible de modifier la pièce');
    } finally {
      setIsUpdatingRoom(false);
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    setRoomError(null);
    setRoomSuccess(null);

    if (room.item_count > 0) {
      setRoomError(
        `Impossible de supprimer « ${room.name} » : elle contient encore ${room.item_count} objet${
          room.item_count > 1 ? 's' : ''
        }. Déplacez ou supprimez d’abord ces objets.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la pièce « ${room.name} » ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    setDeletingRoomId(room.id);
    try {
      await api.deleteRoom(room.id);
      setRoomSuccess(`Pièce « ${room.name} » supprimée.`);
      setTimeout(() => setRoomSuccess(null), 3000);
      onHouseholdUpdated();
    } catch (err: any) {
      setRoomError(err.message || 'Impossible de supprimer la pièce');
    } finally {
      setDeletingRoomId(null);
    }
  };

  const getRoomEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('salon')) return '🛋️';
    if (lower.includes('cuisine')) return '🍳';
    if (lower.includes('chambre')) return '🛏️';
    if (lower.includes('bain')) return '🚿';
    if (lower.includes('dressing') || lower.includes('garde-robe')) return '👗';
    if (lower.includes('bureau')) return '💻';
    if (lower.includes('cave') || lower.includes('garage')) return '📦';
    if (lower.includes('balcon') || lower.includes('terrasse')) return '🌿';
    return '🚪';
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Household & Invite Code Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg">
          <Users className="w-5 h-5 text-emerald-600" />
          <h2>Votre Foyer : {household?.name || 'Mon Foyer'}</h2>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Code d'invitation (Partage)
              </p>
              <p className="text-2xl font-mono font-extrabold text-emerald-700 tracking-wider mt-0.5">
                {household?.invite_code || '------'}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="touch-target px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier le code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2.5">
            Partagez ce code avec un autre membre du foyer (conjoint(e), colocataire) pour collaborer en direct sur le même inventaire (gratuit jusqu'à 2 membres).
          </p>
        </div>

        {/* Member List */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Membres du Foyer ({household?.members?.length || 1} / 2 gratuits)
          </h4>
          <div className="space-y-2">
            {household?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shadow-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{member.name}</span>
                    <span className="text-slate-400 ml-1.5">({member.email})</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                  {member.role === 'owner' ? 'Créateur' : 'Membre'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg">
            <DoorClosed className="w-5 h-5 text-emerald-600" />
            <h2>Gérer et modifier les pièces ({rooms.length})</h2>
          </div>
        </div>

        {/* Feedback alerts */}
        {roomError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{roomError}</span>
          </div>
        )}

        {roomSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{roomSuccess}</span>
          </div>
        )}

        {/* Add Room Form */}
        <form onSubmit={handleAddRoom} className="flex gap-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nom de la nouvelle pièce (ex: Bureau, Balcon, Véranda)..."
            className="flex-1 text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            maxLength={60}
          />
          <button
            type="submit"
            disabled={isAddingRoom || !newRoomName.trim()}
            className="touch-target px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isAddingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Ajouter</span>
          </button>
        </form>

        {/* Interactive Room List */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pièces du foyer (cliquez sur le crayon pour renommer)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {rooms.map((room) => {
              const isEditing = editingRoomId === room.id;
              const isDeleting = deletingRoomId === room.id;

              return (
                <div
                  key={room.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isEditing
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Edit Mode */
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{getRoomEmoji(editingRoomName)}</span>
                      <input
                        type="text"
                        autoFocus
                        value={editingRoomName}
                        onChange={(e) => setEditingRoomName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit(room.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        className="flex-1 text-sm px-2.5 py-1.5 border border-emerald-400 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        maxLength={60}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(room.id)}
                        disabled={isUpdatingRoom}
                        title="Enregistrer les modifications"
                        className="touch-target p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isUpdatingRoom ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingRoom}
                        title="Annuler"
                        className="touch-target p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl flex-shrink-0">{getRoomEmoji(room.name)}</span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm truncate" title={room.name}>
                            {room.name}
                          </h3>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {room.item_count === 1 ? '1 objet' : `${room.item_count} objets`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(room)}
                          title="Modifier le nom de cette pièce"
                          className="touch-target p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room)}
                          disabled={isDeleting}
                          title={
                            room.item_count > 0
                              ? `Impossible de supprimer : contient ${room.item_count} objet(s)`
                              : 'Supprimer cette pièce'
                          }
                          className={`touch-target p-1.5 rounded-lg transition-colors ${
                            room.item_count > 0
                              ? 'text-slate-300 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={onLogout}
          className="w-full touch-target py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};
