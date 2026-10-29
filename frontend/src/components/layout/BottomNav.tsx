import React from 'react';
import { Home, Shirt, Plus, BarChart2, Users } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'overview' | 'dressing' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'overview' | 'dressing' | 'dashboard' | 'settings') => void;
  onOpenFastAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenFastAdd,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 shadow-lg sm:max-w-md sm:mx-auto sm:rounded-t-2xl sm:bottom-2 sm:border">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('overview')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Inventaire</span>
        </button>

        <button
          onClick={() => setActiveTab('dressing')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'dressing' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shirt className="w-5 h-5 mb-0.5" />
          <span>Dressing</span>
        </button>

        {/* Central Prominent Fast-Add Button [CA-1.1, CA-0.3] */}
        <button
          onClick={onOpenFastAdd}
          aria-label="Ajout rapide d'un objet"
          className="touch-target -mt-5 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-transform"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`touch-target flex flex-col items-center justify-center p-1 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Foyer</span>
        </button>
      </div>
    </nav>
  );
};
