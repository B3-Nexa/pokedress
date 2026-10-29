import React, { useState } from 'react';
import { Household, Room } from '../types/inventory.types.js';
import { Copy, Check, Users, Plus, DoorClosed, LogOut } from 'lucide-react';
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

  const handleCopyCode = () => {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    setIsAddingRoom(true);
    try {
      await api.createRoom(newRoomName.trim());
      setNewRoomName('');
      onHouseholdUpdated();
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsAddingRoom(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Household & Invite Code Card [CA-5.1, CA-5.2, CA-5.6] */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Users className="w-5 h-5 text-emerald-600" />
          <h2>Votre Foyer : {household?.name || 'Mon Foyer'}</h2>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
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
              className="touch-target px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier le code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Partagez ce code avec un autre membre du foyer (Marc, colocataire) pour collaborer en direct sur le même inventaire (gratuit jusqu'à 2 membres).
          </p>
        </div>

        {/* Member List */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Membres du Foyer ({household?.members?.length || 1} / 2 gratuits)
          </h4>
          <div className="space-y-1.5">
            {household?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
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

      {/* Add Custom Room Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <DoorClosed className="w-5 h-5 text-emerald-600" />
          <h2>Gérer les pièces ({rooms.length})</h2>
        </div>

        <form onSubmit={handleAddRoom} className="flex gap-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nom de la nouvelle pièce (ex: Bureau, Balcon)..."
            className="flex-1 text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isAddingRoom || !newRoomName.trim()}
            className="touch-target px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {rooms.map((r) => (
            <span
              key={r.id}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
            >
              {r.name}
            </span>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full touch-target py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};
