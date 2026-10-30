import React, { useState } from 'react';
import { Copy, Check, AlertCircle, Plus, Home, Shirt, BarChart2, Users } from 'lucide-react';
import { Household } from '../../types/inventory.types.js';
import { Logo } from '../common/Logo.js';

interface NavbarProps {
  household?: Household | null;
  totalItems?: number;
  show90Warning?: boolean;
  activeTab?: 'overview' | 'dressing' | 'dashboard' | 'settings';
  setActiveTab?: (tab: 'overview' | 'dressing' | 'dashboard' | 'settings') => void;
  onOpenFastAdd?: () => void;
  onOpenDressingAdd?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  household,
  totalItems = 0,
  show90Warning = false,
  activeTab = 'overview',
  setActiveTab,
  onOpenFastAdd,
  onOpenDressingAdd,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Inventaire', icon: Home },
    { id: 'dressing', label: 'Dressing', icon: Shirt },
    { id: 'dashboard', label: 'Statistiques', icon: BarChart2 },
    { id: 'settings', label: 'Foyer', icon: Users },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Logo size="md" variant="icon" />
          <div>
            <h1 className="font-extrabold text-slate-900 leading-tight text-base sm:text-lg">
              Poke<span className="text-purple-600">Dress</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {household?.name || 'Inventaire du Foyer'}
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on mobile, visible on md+) */}
        {setActiveTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Actions, Freemium Alert & Code */}
        <div className="flex items-center gap-2.5">
          {show90Warning && (
            <div className="hidden lg:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Plus que {Math.max(0, 100 - totalItems)} objets (gratuit)</span>
            </div>
          )}

          {household?.invite_code && (
            <button
              onClick={handleCopyCode}
              title="Copier le code d'invitation du foyer"
              className="touch-target px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="text-slate-400 hidden sm:inline">Code :</span>
              <span className="font-mono font-bold text-emerald-700">{household.invite_code}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          )}

          {/* Desktop Direct Add Button */}
          {activeTab === 'dressing' ? (
            <button
              onClick={onOpenDressingAdd}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un vêtement</span>
            </button>
          ) : (
            <button
              onClick={onOpenFastAdd}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un objet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
