import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface InsuranceSummaryProps {
  totalValue: number;
  valueItemsCount: number;
  totalItems: number;
}

export const InsuranceSummary: React.FC<InsuranceSummaryProps> = ({
  totalValue,
  valueItemsCount,
  totalItems,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Valeur Assurance & Patrimoine</span>
        </h3>
        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md">
          Optionnel
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
        </span>
      </div>

      {/* Required wording [CA-6.4]: "valeur estimée sur X objets sur Y" */}
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>Valeur estimée sur {valueItemsCount} objets sur {totalItems}</span>
      </p>

      <p className="text-[11px] text-slate-400 mt-2 italic">
        Utile pour votre contrat d’assurance habitation en cas de cambriolage ou sinistre.
      </p>
    </div>
  );
};
