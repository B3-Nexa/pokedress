import React from 'react';
import { Item, CATEGORY_LABELS } from '../../types/inventory.types.js';
import { Tag, MapPin, ShieldCheck } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const categoryInfo = CATEGORY_LABELS[item.category] || { label: item.category, icon: 'package' };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
    >
      {/* Thumbnail or neutral icon fallback [CA-2.4] */}
      <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.photo_url ? (
          <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl" role="img" aria-label="Icon">
            {item.category === 'dressing_vetements'
              ? '👕'
              : item.category === 'vaisselle_cuisine'
              ? '🍽️'
              : item.category === 'electromenager'
              ? '🔌'
              : item.category === 'hightech'
              ? '💻'
              : item.category === 'outils_bricolage'
              ? '🔨'
              : item.category === 'meubles_deco'
              ? '🛋️'
              : '📦'}
          </span>
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          {/* Ellipsis truncation on 100-character names [CA-2.6] */}
          <h3 className="font-semibold text-slate-900 text-sm truncate" title={item.name}>
            {item.name}
          </h3>
          {/* Quantity badge: 1 record = 1 item, displays "x 6" [CA-2.3] */}
          {item.quantity > 1 && (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md flex-shrink-0">
              × {item.quantity}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {/* Room badge */}
          {item.room_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-xs font-medium">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{item.room_name}</span>
            </span>
          )}

          {/* Category badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
            <Tag className="w-2.5 h-2.5" />
            <span className="truncate max-w-[120px]">{categoryInfo.label}</span>
          </span>

          {/* Dressing status pill [CA-4.2, CA-4.4] */}
          {item.dressing_status === 'dormant' && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
              Dormant
            </span>
          )}
          {item.dressing_status === 'to_sell_or_donate' && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
              À revendre {item.resale_price ? `(${item.resale_price} €)` : ''}
            </span>
          )}

          {/* Receipt / Warranty icon for Marc [CA-6.3] */}
          {(item.receipt_photo_url || item.warranty_expiry) && (
            <span
              className="inline-flex items-center text-blue-600 ml-auto"
              title="Facture / Garantie enregistrée"
            >
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
