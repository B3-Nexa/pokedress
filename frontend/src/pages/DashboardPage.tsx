import React from 'react';
import { DashboardData } from '../types/inventory.types.js';
import { NorthStarCard } from '../components/dashboard/NorthStarCard.js';
import { RoomCountList } from '../components/dashboard/RoomCountList.js';
import { InsuranceSummary } from '../components/dashboard/InsuranceSummary.js';
import { AlertCircle, Sparkles } from 'lucide-react';

interface DashboardPageProps {
  data: DashboardData | null;
  onOpenFastAdd: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ data, onOpenFastAdd }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        Chargement des métriques du foyer...
      </div>
    );
  }

  const { freemium } = data;

  return (
    <div className="space-y-4 pb-20">
      {/* 90-Item Pre-Warning Banner [CA-6.7] */}
      {freemium.show_warning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-sm text-amber-950">
              Plus que {freemium.remaining_items} objets en version gratuite
            </h4>
            <p className="mt-0.5 text-amber-800">
              Le foyer approche du cap des 100 objets. Rien ne sera jamais verrouillé en lecture.
            </p>
          </div>
        </div>
      )}

      {/* 100-Item Cap Reached Notice [CA-6.5, CA-6.6] */}
      {freemium.is_capped && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-sm">Cap des 100 objets atteint</h4>
            <p className="mt-0.5 text-emerald-800">
              Tous vos objets restent consultables et modifiables. Passez en illimité pour continuer à en ajouter.
            </p>
          </div>
        </div>
      )}

      {/* North Star Metric Card [CA-6.1] */}
      <NorthStarCard totalItems={data.total_items} />

      {/* Items Count by Room [CA-6.2] */}
      <RoomCountList itemsByRoom={data.items_by_room} onOpenFastAdd={onOpenFastAdd} />

      {/* Insurance Valuation [CA-6.4] */}
      <InsuranceSummary
        totalValue={data.total_value}
        valueItemsCount={data.value_items_count}
        totalItems={data.total_items}
      />
    </div>
  );
};
