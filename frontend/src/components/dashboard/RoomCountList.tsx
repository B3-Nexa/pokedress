import React from 'react';
import { Plus } from 'lucide-react';

interface RoomCountListProps {
  itemsByRoom: Array<{ room_id: string; name: string; icon: string; count: number }>;
  onOpenFastAdd: () => void;
}

export const RoomCountList: React.FC<RoomCountListProps> = ({ itemsByRoom, onOpenFastAdd }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <h3 className="font-bold text-slate-900 text-sm mb-3">Répartition par Pièce [CA-6.2]</h3>

      <div className="space-y-2">
        {itemsByRoom.map((room) => (
          <div
            key={room.room_id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">
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
              <span className="font-semibold text-slate-800">{room.name}</span>
            </div>

            {room.count === 0 ? (
              <button
                onClick={onOpenFastAdd}
                className="touch-target text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            ) : (
              <span className="text-xs font-bold px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-slate-200">
                {room.count === 1 ? '1 objet' : `${room.count} objets`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
