import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/items.api.js';
import {
  Room,
  DressingStatus,
  CLOTHING_TYPES,
  CLOTHING_SIZES,
  SEASON_OPTIONS,
  DRESSING_STATUS_OPTIONS,
} from '../../types/inventory.types.js';
import { useChainedAdd } from '../../context/ChainedAddContext.js';
import { useDuplicateCheck } from '../../hooks/useDuplicateCheck.js';
import { DuplicateWarning } from '../fast-add/DuplicateWarning.js';
import { compressImage } from '../../utils/imageCompressor.js';

interface DressingAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onItemAdded: () => void;
}

export const DressingAddModal: React.FC<DressingAddModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onItemAdded,
}) => {
  const { lastRoomId, setLastRoomId } = useChainedAdd();

  // Form Fields
  const [name, setName] = useState('');
  const [clothingType, setClothingType] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [brand, setBrand] = useState('');
  const [dressingStatus, setDressingStatus] = useState<DressingStatus>('active');
  const [resalePrice, setResalePrice] = useState<string>('');
  const [season, setSeason] = useState<'toute_saison' | 'printemps_ete' | 'automne_hiver'>('toute_saison');
  const [roomId, setRoomId] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { duplicates } = useDuplicateCheck(name);

  // Initialize or restore retained room
  useEffect(() => {
    if (isOpen) {
      // Find dressing or bedroom first if available, else retained room or first room
      const dressingOrBedroom = rooms.find(
        (r) => /dressing|garde-robe|chambre/i.test(r.name)
      );
      if (lastRoomId && rooms.some((r) => r.id === lastRoomId)) {
        setRoomId(lastRoomId);
      } else if (dressingOrBedroom) {
        setRoomId(dressingOrBedroom.id);
      } else if (rooms.length > 0) {
        setRoomId(rooms[0].id);
      }

      setError(null);
      setSuccessToast(null);

      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, rooms, lastRoomId]);

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

    if (!name.trim() || name.trim().length < 2) {
      setError('Le nom du vêtement doit comporter au moins 2 caractères');
      nameInputRef.current?.focus();
      return;
    }

    if (!roomId) {
      setError('Veuillez sélectionner une pièce pour ranger ce vêtement');
      return;
    }

    const parsedPrice = resalePrice.trim() ? parseFloat(resalePrice) : null;
    if (resalePrice.trim() && (isNaN(parsedPrice!) || parsedPrice! < 0)) {
      setError('Le prix de revente doit être un nombre positif');
      return;
    }

    setIsSubmitting(true);

    try {
      setLastRoomId(roomId);

      await api.createItem(
        {
          name: name.trim(),
          room_id: roomId,
          category: 'dressing_vetements',
          quantity: 1,
          clothing_type: clothingType.trim() || undefined,
          size: size.trim() || undefined,
          brand: brand.trim() || undefined,
          dressing_status: dressingStatus,
          resale_price: parsedPrice,
          season,
        },
        photoFile || undefined
      );

      onItemAdded();

      if (isChainedSubmit) {
        setName('');
        handleRemovePhoto();
        setSuccessToast(`« ${name.trim()} » ajouté à votre dressing !`);
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
        setError(err.message || 'Une erreur est survenue lors de l’enregistrement du vêtement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-purple-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
              👗
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg flex items-center gap-1.5">
                Ajouter un vêtement au dressing
              </h2>
              <p className="text-xs text-purple-200">
                Garde-robe & cycle de vie du vêtement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="touch-target p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-slate-800">
          {successToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* 1. Nom du vêtement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom de la pièce <span className="text-red-500">*</span>
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
              placeholder="ex: Pull col roulé mérinos, Jean brut 501, Robe midi..."
              className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              maxLength={100}
            />
          </div>

          {/* Real-time Anti-Duplicate Banner */}
          <DuplicateWarning duplicates={duplicates} />

          {/* 2. Type & Taille en grille 2 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type de pièce
              </label>
              <select
                value={clothingType}
                onChange={(e) => setClothingType(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Sélectionner un type...</option>
                {CLOTHING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Taille
              </label>
              <div className="flex gap-2">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sélectionner une taille...</option>
                  {CLOTHING_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. Marque & Pièce */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Marque (optionnel)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="ex: Zara, Uniqlo, Sézane..."
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pièce de rangement <span className="text-red-500">*</span>
              </label>
              <select
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setLastRoomId(e.target.value);
                }}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Statut Dressing (Cycle de vie) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statut dans votre garde-robe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DRESSING_STATUS_OPTIONS.map((opt) => {
                const isSelected = dressingStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDressingStatus(opt.value)}
                    className={`touch-target p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? opt.value === 'active'
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                          : opt.value === 'dormant'
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-purple-500 bg-purple-50/80 text-purple-900 ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Prix de revente si "À revendre ou donner" */}
          {dressingStatus === 'to_sell_or_donate' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 animate-fadeIn">
              <label className="block text-xs font-bold text-purple-900 mb-1">
                💰 Prix de revente estimé (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={resalePrice}
                  onChange={(e) => setResalePrice(e.target.value)}
                  placeholder="ex: 15"
                  className="w-full text-sm px-3 py-2 pr-8 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-purple-400">€</span>
              </div>
              <p className="text-[11px] text-purple-700 mt-1">
                Laissez vide si c’est un don pur (0 €).
              </p>
            </div>
          )}

          {/* 6. Saison */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Saison
            </label>
            <div className="flex flex-wrap gap-2">
              {SEASON_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeason(s.value)}
                  className={`touch-target px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    season === s.value
                      ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Photo facultative */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Photo du vêtement (Facultative)
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
                  alt="Aperçu du vêtement"
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
                className="touch-target px-3.5 py-2 border border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/40 rounded-xl text-purple-900 text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-purple-500" />
                <span>Prendre ou choisir une photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2.5">
          {/* Chained Add Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            title="Enregistre ce vêtement et garde la pièce, la marque et la saison pour le suivant"
            className="touch-target flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <>
                <Plus className="w-4 h-4 text-purple-600" />
                <span>+ Enchaîner (&lt; 5s)</span>
              </>
            )}
          </button>

          {/* Standard Save & Close */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="touch-target flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors disabled:opacity-50"
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
