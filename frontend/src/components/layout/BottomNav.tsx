import React from 'react';
import { Home, Shirt, Plus, BarChart2, Users } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'overview' | 'dressing' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'overview' | 'dressing' | 'dashboard' | 'settings') => void;
  onOpenAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdd,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Inventaire</span>
        </button>

        <button
          onClick={() => setActiveTab('dressing')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'dressing' ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shirt className="w-5 h-5 mb-0.5" />
          <span>Dressing</span>
        </button>

        {/* Central Prominent Fast-Add Button */}
        <button
          onClick={onOpenAdd}
          aria-label={activeTab === 'dressing' ? "Ajout d'un vêtement" : "Ajout rapide d'un objet"}
          className={`touch-target -mt-6 w-14 h-14 ${
            activeTab === 'dressing'
              ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
          } active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-transform`}
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'settings' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Foyer</span>
        </button>
      </div>
    </nav>
  );
};
