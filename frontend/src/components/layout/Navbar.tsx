import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Household } from '../../types/inventory.types.js';

interface NavbarProps {
  household?: Household | null;
  totalItems?: number;
  show90Warning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ household, totalItems = 0, show90Warning = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
            📦
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">PokeDress</h1>
            <p className="text-xs text-slate-500 font-medium">
              {household?.name || 'Inventaire du Foyer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {show90Warning && (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-medium">
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
              <span className="text-slate-400">Code :</span>
              <span className="font-mono font-bold text-emerald-700">{household.invite_code}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
