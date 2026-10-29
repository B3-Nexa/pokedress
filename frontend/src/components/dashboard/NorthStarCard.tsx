import React from 'react';
import { PackageCheck } from 'lucide-react';

interface NorthStarCardProps {
  totalItems: number;
}

export const NorthStarCard: React.FC<NorthStarCardProps> = ({ totalItems }) => {
  return (
    <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
          North Star Metric (Le Foyer)
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-extrabold tracking-tight">{totalItems}</span>
          <span className="text-sm font-medium text-emerald-100">objets inventoriés</span>
        </div>
        <p className="text-xs text-emerald-100/90 mt-1">
          {totalItems >= 30
            ? '🎉 Bravo, votre foyer a dépassé les 30 objets inventoriés !'
            : 'Continuez : atteignez 30 objets pour une vue complète de votre logement.'}
        </p>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
        <PackageCheck className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};
