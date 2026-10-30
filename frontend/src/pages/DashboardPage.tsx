import React from 'react';
import { DashboardData } from '../types/inventory.types.js';
import { NorthStarCard } from '../components/dashboard/NorthStarCard.js';
import { RoomCountList } from '../components/dashboard/RoomCountList.js';
import { InsuranceSummary } from '../components/dashboard/InsuranceSummary.js';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  data: DashboardData | null;
  onOpenFastAdd: () => void;
  onOpenSubscription?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  data,
  onOpenFastAdd,
  onOpenSubscription,
}) => {
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
      {freemium.show_warning && freemium.plan !== 'premium' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
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
          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className="touch-target px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto flex-shrink-0"
            >
              <span>Débloquer l'illimité</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 100-Item Cap Reached Notice [CA-6.5, CA-6.6] */}
      {freemium.is_capped && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-950 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-sm text-purple-900">Cap des 100 objets atteint</h4>
              <p className="mt-0.5 text-purple-800">
                Tous vos objets restent consultables et modifiables. Passez en illimité pour continuer à en ajouter.
              </p>
            </div>
          </div>
          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className="touch-target px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto flex-shrink-0"
            >
              <span>Passer en Premium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* North Star Metric Card [CA-6.1] */}
        <NorthStarCard totalItems={data.total_items} />

        {/* Insurance Valuation [CA-6.4] */}
        <InsuranceSummary
          totalValue={data.total_value}
          valueItemsCount={data.value_items_count}
          totalItems={data.total_items}
        />
      </div>

      {/* Items Count by Room [CA-6.2] */}
      <RoomCountList itemsByRoom={data.items_by_room} onOpenFastAdd={onOpenFastAdd} />
    </div>
  );
};
