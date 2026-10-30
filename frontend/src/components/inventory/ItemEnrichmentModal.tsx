import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { Item, CATEGORY_LABELS } from '../../types/inventory.types.js';
import { api } from '../../api/items.api.js';

interface ItemEnrichmentModalProps {
  item: Item | null;
  onClose: () => void;
  onItemUpdated: () => void;
}

export const ItemEnrichmentModal: React.FC<ItemEnrichmentModalProps> = ({
  item,
  onClose,
  onItemUpdated,
}) => {
  if (!item) return null;

  const [price, setPrice] = useState(item.purchase_price ? String(item.purchase_price) : '');
  const [purchaseDate, setPurchaseDate] = useState(
    item.purchase_date ? item.purchase_date.split('T')[0] : ''
  );
  const [warrantyExpiry, setWarrantyExpiry] = useState(
    item.warranty_expiry ? item.warranty_expiry.split('T')[0] : ''
  );
  const [brand, setBrand] = useState(item.brand || '');
  const [notes, setNotes] = useState(item.notes || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateItem(item.id, {
        purchase_price: price ? parseFloat(price) : null,
        purchase_date: purchaseDate ? new Date(purchaseDate).toISOString() : null,
        warranty_expiry: warrantyExpiry ? new Date(warrantyExpiry).toISOString() : null,
        brand: brand.trim() || null,
        notes: notes.trim() || null,
      });
      onItemUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update item details:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Supprimer définitivement « ${item.name} » ?`)) {
      setIsDeleting(true);
      try {
        await api.deleteItem(item.id);
        onItemUpdated();
        onClose();
      } catch (err) {
        console.error('Failed to delete item:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">{item.name}</h2>
            <p className="text-xs text-slate-500">{item.room_name} • {CATEGORY_LABELS[item.category]?.label}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="touch-target p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
          {item.photo_url && (
            <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200">
              <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-3 text-xs flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Compléter plus tard (Factures & Garanties)</p>
              <p className="text-blue-700 mt-0.5">
                Utile en cas de panne (garantie légale de 2 ans) ou pour l'assurance en cas de vol.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prix d'achat (€)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 149.99"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marque / Modèle</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="ex: Samsung, Bosch..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'achat</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fin de garantie</label>
              <input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Numéro de série</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Numéro de série, précisions, tiroir..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="touch-target px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="touch-target px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
