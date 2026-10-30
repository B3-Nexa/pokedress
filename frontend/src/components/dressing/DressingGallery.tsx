import React, { useState } from 'react';
import { Item, DressingStatus } from '../../types/inventory.types.js';
import { ItemCard } from '../inventory/ItemCard.js';
import { api } from '../../api/items.api.js';

interface DressingGalleryProps {
  items: Item[];
  onOpenDressingAdd: () => void;
  onItemUpdated: () => void;
  onSelectItem: (item: Item) => void;
}

export const DressingGallery: React.FC<DressingGalleryProps> = ({
  items,
  onOpenDressingAdd,
  onItemUpdated,
  onSelectItem,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const clothes = items.filter((i) => i.category === 'dressing_vetements');

  const filteredClothes = clothes.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.dressing_status === filterStatus;
  });

  const dormantCount = clothes.filter((c) => c.dressing_status === 'dormant').length;
  const toSellClothes = clothes.filter((c) => c.dressing_status === 'to_sell_or_donate');
  const toSellCount = toSellClothes.length;
  const totalResaleValue = toSellClothes.reduce((sum, c) => sum + (c.resale_price || 0), 0);

  // 1-click status toggle [CA-4.5]
  const handleQuickStatusChange = async (itemId: string, newStatus: DressingStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdatingId(itemId);
    try {
      await api.updateItem(itemId, { dressing_status: newStatus });
      onItemUpdated();
    } catch (err) {
      console.error('Failed to change status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Dressing Header banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                Catégorie Enrichie
              </span>
              <span className="text-sm">👗</span>
            </div>
            <h2 className="text-xl font-bold mt-0.5">Dressing & Garde-robe</h2>
            <p className="text-xs text-purple-100 mt-0.5">
              {clothes.length} pièces inventoriées dans le foyer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDressingAdd}
              className="touch-target px-4 py-2.5 bg-white text-purple-900 font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:bg-purple-50 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>+ Ajouter un vêtement</span>
            </button>
          </div>
        </div>

        {/* Decluttering potential banner */}
        {toSellCount > 0 && (
          <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between text-xs font-medium">
            <span>
              💰 <strong>{toSellCount} pièces</strong> prêtes à revendre (Vinted / dons)
            </span>
            <span className="font-bold bg-white text-purple-900 px-2 py-0.5 rounded-lg shadow-sm">
              {totalResaleValue} € estimés
            </span>
          </div>
        )}
      </div>

      {/* Filter Pills [CA-4.4] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('all')}
          className={`touch-target px-3.5 py-1.5 rounded-full font-semibold transition-colors flex-shrink-0 ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Tous ({clothes.length})
        </button>

        <button
          onClick={() => setFilterStatus('active')}
          className={`touch-target px-3.5 py-1.5 rounded-full font-semibold transition-colors flex-shrink-0 ${
            filterStatus === 'active'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Portés régulièrement ({clothes.filter((c) => c.dressing_status === 'active').length})
        </button>

        <button
          onClick={() => setFilterStatus('dormant')}
          className={`touch-target px-3.5 py-1.5 rounded-full font-semibold transition-colors flex-shrink-0 ${
            filterStatus === 'dormant'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Dormants ({dormantCount})
        </button>

        <button
          onClick={() => setFilterStatus('to_sell_or_donate')}
          className={`touch-target px-3.5 py-1.5 rounded-full font-semibold transition-colors flex-shrink-0 ${
            filterStatus === 'to_sell_or_donate'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          À donner ou revendre ({toSellCount})
        </button>
      </div>

      {/* Clothing List in Responsive Grid */}
      {filteredClothes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto">
          <span className="text-4xl block mb-2">👗</span>
          <p className="text-base font-bold text-slate-800">Aucun vêtement dans cette vue</p>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Ajoutez vos vêtements et suivez votre garde-robe facilement.
          </p>
          <button
            onClick={onOpenDressingAdd}
            className="touch-target px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>+ Ajouter un premier vêtement</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredClothes.map((item) => (
            <div key={item.id} className="relative group">
              <ItemCard item={item} onClick={() => onSelectItem(item)} />

              {/* 1-click status quick actions on the card [CA-4.5] */}
              <div className="absolute right-3 top-3 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {item.dressing_status !== 'dormant' && (
                  <button
                    onClick={(e) => handleQuickStatusChange(item.id, 'dormant', e)}
                    disabled={updatingId === item.id}
                    title="Marquer comme non porté depuis 6+ mois"
                    className="touch-target px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200 transition-colors shadow-xs"
                  >
                    Dormant
                  </button>
                )}

                {item.dressing_status !== 'to_sell_or_donate' && (
                  <button
                    onClick={(e) => handleQuickStatusChange(item.id, 'to_sell_or_donate', e)}
                    disabled={updatingId === item.id}
                    title="Basculer vers la liste à revendre/donner"
                    className="touch-target px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md border border-purple-200 transition-colors shadow-xs"
                  >
                    À revendre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
