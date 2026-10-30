import React, { useState } from 'react';
import { Room, Item } from '../../types/inventory.types.js';
import { ItemCard } from './ItemCard.js';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface RoomGroupViewProps {
  rooms: Room[];
  items: Item[];
  onOpenFastAdd: () => void;
  onSelectItem: (item: Item) => void;
}

export const RoomGroupView: React.FC<RoomGroupViewProps> = ({
  rooms,
  items,
  onOpenFastAdd,
  onSelectItem,
}) => {
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>(() => {
    // Expand first 2 rooms by default
    const initial: Record<string, boolean> = {};
    rooms.slice(0, 2).forEach((r) => {
      initial[r.id] = true;
    });
    return initial;
  });

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const roomItems = items.filter((i) => i.room_id === room.id);
        const isExpanded = !!expandedRooms[room.id];

        return (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
          >
            {/* Room Header with count [CA-2.1] */}
            <button
              onClick={() => toggleRoom(room.id)}
              className="w-full touch-target px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {room.name.toLowerCase().includes('salon')
                    ? '🛋️'
                    : room.name.toLowerCase().includes('cuisine')
                    ? '🍳'
                    : room.name.toLowerCase().includes('chambre')
                    ? '🛏️'
                    : room.name.toLowerCase().includes('bain')
                    ? '🚿'
                    : room.name.toLowerCase().includes('cave') || room.name.toLowerCase().includes('garage')
                    ? '📦'
                    : '🚪'}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{room.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {roomItems.length === 1 ? '1 objet' : `${roomItems.length} objets`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                  {roomItems.length}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Room Items List [CA-2.1, CA-2.5] */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50">
                {roomItems.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500 mb-2">Aucun objet dans cette pièce</p>
                    <button
                      onClick={onOpenFastAdd}
                      className="touch-target px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un premier objet</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roomItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onClick={() => onSelectItem(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
