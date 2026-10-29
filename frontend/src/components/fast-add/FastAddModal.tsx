import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/items.api.js';
import { Room, CategoryKey, CATEGORY_LABELS } from '../../types/inventory.types.js';
import { useChainedAdd } from '../../context/ChainedAddContext.js';
import { useDuplicateCheck } from '../../hooks/useDuplicateCheck.js';
import { DuplicateWarning } from './DuplicateWarning.js';
import { compressImage } from '../../utils/imageCompressor.js';

interface FastAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onItemAdded: () => void;
}

export const FastAddModal: React.FC<FastAddModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onItemAdded,
}) => {
  const { lastRoomId, setLastRoomId, lastCategory, setLastCategory } = useChainedAdd();

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [category, setCategory] = useState<CategoryKey>('dressing_vetements');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { duplicates } = useDuplicateCheck(name);

  // Initialize or restore retained room & category [CA-1.4, CA-1.5]
  useEffect(() => {
    if (isOpen) {
      if (lastRoomId && rooms.some((r) => r.id === lastRoomId)) {
        setRoomId(lastRoomId);
      } else if (rooms.length > 0) {
        setRoomId(rooms[0].id);
      }

      if (lastCategory) {
        setCategory(lastCategory);
      }

      setError(null);
      setSuccessToast(null);

      // Auto-focus name field [CA-1.4]
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, rooms]);

  if (!isOpen) return null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setPhotoFile(compressed);
        setPhotoPreview(URL.createObjectURL(compressed));
      } catch (err) {
        console.warn('Compression failed, using raw file:', err);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (isChainedSubmit = false) => {
    setError(null);

    // Frontend validation matching CA-1.2 & CA-1.3
    if (!name.trim()) {
      setError('Le nom doit comporter au moins 2 caractères');
      nameInputRef.current?.focus();
      return;
    }
    if (name.trim().length < 2) {
      setError('Le nom doit comporter au moins 2 caractères');
      return;
    }
    if (!roomId) {
      setError('La pièce est obligatoire');
      return;
    }

    setIsSubmitting(true);

    try {
      // Retain room and category in context [CA-1.4, CA-1.5]
      setLastRoomId(roomId);
      setLastCategory(category);

      await api.createItem(
        {
          name: name.trim(),
          room_id: roomId,
          category,
          quantity: 1,
        },
        photoFile || undefined
      );

      onItemAdded();

      if (isChainedSubmit) {
        // Reset only name & photo, keep room & category for instant chained entry [CA-1.4]
        setName('');
        handleRemovePhoto();
        setSuccessToast(`« ${name.trim()} » enregistré !`);
        setTimeout(() => setSuccessToast(null), 2500);
        nameInputRef.current?.focus();
      } else {
        setName('');
        handleRemovePhoto();
        onClose();
      }
    } catch (err: any) {
      if (err.code === 'UPGRADE_REQUIRED') {
        setError(err.message || 'Plafond des 100 objets atteint en version gratuite.');
      } else {
        setError(err.message || 'Une erreur est survenue lors de l’enregistrement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h2 className="font-bold text-slate-900 text-lg">Ajout Rapide (&lt; 10 s)</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="touch-target p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {successToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* 1. Name input [CA-1.1, CA-1.3] */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nom de l'objet <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(true);
                }
              }}
              placeholder="ex: Grille-pain, Pull col roulé, Rallonge..."
              className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              maxLength={100}
            />
          </div>

          {/* Real-time Anti-Duplicate Banner [CA-3.1, CA-3.2, CA-3.4] */}
          <DuplicateWarning duplicates={duplicates} />

          {/* 2. Room selector [CA-1.1, CA-1.5, CA-2.5] */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pièce <span className="text-red-500">*</span>
            </label>
            <select
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setLastRoomId(e.target.value);
              }}
              className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category selector [CA-1.1, CA-1.5, CA-4.1] */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value as CategoryKey;
                setCategory(newCat);
                setLastCategory(newCat);
              }}
              className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Optional Photo (Raw, no forced détourage) [CA-1.6, CA-1.7] */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Photo (Facultative)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative inline-block mt-1">
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="touch-target px-3.5 py-2 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl text-slate-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-slate-400" />
                <span>Prendre ou choisir une photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Actions [CA-1.1, CA-1.4] */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {/* Chained Add Button [CA-1.4, CA-1.5, SC-002] */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            title="Enregistre et garde la pièce et catégorie sélectionnées pour l'objet suivant"
            className="touch-target flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>+ Enchaîner (&lt; 5s)</span>
              </>
            )}
          </button>

          {/* Standard Save & Close [CA-1.1] */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="touch-target flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Enregistrer</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
