import React, { useState } from 'react';
import { Item, CategoryKey, CATEGORY_LABELS } from '../../types/inventory.types.js';
import { ItemCard } from './ItemCard.js';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CategoryGroupViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
}

export const CategoryGroupView: React.FC<CategoryGroupViewProps> = ({ items, onSelectItem }) => {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    // Expand dressing by default if has items
    return { dressing_vetements: true };
  });

  const toggleCategory = (catKey: string) => {
    setExpandedCats((prev) => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  const categories = Object.keys(CATEGORY_LABELS) as CategoryKey[];

  return (
    <div className="space-y-3">
      {categories.map((catKey) => {
        const catInfo = CATEGORY_LABELS[catKey];
        const catItems = items.filter((i) => i.category === catKey);
        const isExpanded = !!expandedCats[catKey];

        // Skip categories with 0 items in category view for clarity
        if (catItems.length === 0) return null;

        return (
          <div
            key={catKey}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
          >
            {/* Category Header with subtotal [CA-2.2] */}
            <button
              onClick={() => toggleCategory(catKey)}
              className="w-full touch-target px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">
                  {catKey === 'dressing_vetements'
                    ? '👕'
                    : catKey === 'vaisselle_cuisine'
                    ? '🍽️'
                    : catKey === 'electromenager'
                    ? '🔌'
                    : catKey === 'hightech'
                    ? '💻'
                    : catKey === 'outils_bricolage'
                    ? '🔨'
                    : catKey === 'meubles_deco'
                    ? '🛋️'
                    : '📦'}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{catInfo.label}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {catItems.length === 1 ? '1 objet' : `${catItems.length} objets`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                  {catItems.length}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Category Items List [CA-2.2] */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onClick={() => onSelectItem(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
