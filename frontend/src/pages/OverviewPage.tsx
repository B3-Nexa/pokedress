import React, { useState } from 'react';
import { Room, Item } from '../types/inventory.types.js';
import { SearchBar } from '../components/search/SearchBar.js';
import { RoomGroupView } from '../components/inventory/RoomGroupView.js';
import { CategoryGroupView } from '../components/inventory/CategoryGroupView.js';
import { ItemCard } from '../components/inventory/ItemCard.js';
import { normalizeText } from '../utils/text.js';

interface OverviewPageProps {
  rooms: Room[];
  items: Item[];
  onOpenFastAdd: () => void;
  onSelectItem: (item: Item) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  rooms,
  items,
  onOpenFastAdd,
  onSelectItem,
}) => {
  const [viewMode, setViewMode] = useState<'room' | 'category'>('room');
  const [searchQuery, setSearchQuery] = useState('');

  // Global search filtering [CA-3.6, CA-3.7, CA-3.8]
  const normalizedQuery = normalizeText(searchQuery);

  const searchResults = searchQuery.trim()
    ? items.filter((item) => {
        const matchName = normalizeText(item.name).includes(normalizedQuery);
        const matchBrand = item.brand ? normalizeText(item.brand).includes(normalizedQuery) : false;
        const matchRoom = item.room_name ? normalizeText(item.room_name).includes(normalizedQuery) : false;
        return matchName || matchBrand || matchRoom;
      })
    : null;

  return (
    <div className="space-y-4 pb-20">
      {/* Search Bar [CA-3.6, CA-3.7] */}
      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* If Searching, show search results */}
      {searchResults !== null ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider px-1">
            <span>Résultats de recherche ({searchResults.length})</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 hover:underline lowercase font-medium"
            >
              fermer la recherche
            </button>
          </div>

          {searchResults.length === 0 ? (
            /* Required empty search result text [CA-3.8] */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-semibold text-slate-800 text-sm">
                Vous ne possédez rien qui ressemble à « {searchQuery} »
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Vérifiez l’orthographe ou ajoutez cet objet maintenant.
              </p>
              <button
                onClick={onOpenFastAdd}
                className="touch-target px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-emerald-700 transition-colors"
              >
                + Ajouter cet objet (&lt; 10s)
              </button>
            </div>
          ) : (
            searchResults.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
            ))
          )}
        </div>
      ) : (
        /* Standard Overview: Toggle between Par Pièce and Par Catégorie [US2, CA-2.1, CA-2.2] */
        <>
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('room')}
              className={`touch-target flex-1 py-1.5 rounded-lg transition-all ${
                viewMode === 'room'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vue par Pièce
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`touch-target flex-1 py-1.5 rounded-lg transition-all ${
                viewMode === 'category'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vue par Catégorie
            </button>
          </div>

          {viewMode === 'room' ? (
            <RoomGroupView
              rooms={rooms}
              items={items}
              onOpenFastAdd={onOpenFastAdd}
              onSelectItem={onSelectItem}
            />
          ) : (
            <CategoryGroupView items={items} onSelectItem={onSelectItem} />
          )}
        </>
      )}
    </div>
  );
};
