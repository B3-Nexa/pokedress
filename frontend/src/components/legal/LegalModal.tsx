import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  FileText,
  Lock,
  Building,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
} from 'lucide-react';
import { LEGAL_DOCUMENTS, LegalTabKey } from '../../content/legalData.js';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabKey;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'cgv',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabKey>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentDoc = LEGAL_DOCUMENTS[activeTab];

  const getTabIcon = (tab: LegalTabKey) => {
    switch (tab) {
      case 'cgv':
        return <FileText className="w-4 h-4" />;
      case 'cgu':
        return <Shield className="w-4 h-4" />;
      case 'mentions':
        return <Building className="w-4 h-4" />;
      case 'rgpd':
        return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Shield className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-lg flex items-center gap-2">
                PokeDress <span className="text-purple-300">Informations Juridiques</span>
              </h3>
              <p className="text-xs text-slate-300">
                Transparence, conformité légale et protection de vos données
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre juridique"
            className="touch-target p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex-shrink-0 bg-slate-100/90 border-b border-slate-200 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-1 sm:gap-2">
          {(Object.keys(LEGAL_DOCUMENTS) as LegalTabKey[]).map((tabKey) => {
            const doc = LEGAL_DOCUMENTS[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-purple-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={isActive ? 'text-purple-600' : 'text-slate-400'}>
                  {getTabIcon(tabKey)}
                </span>
                <span>{doc.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 overscroll-contain text-slate-800">
          {/* Document Header Info */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                {currentDoc.badge}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Dernière mise à jour : {currentDoc.lastUpdated}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {currentDoc.title}
            </h2>
          </div>

          {/* Sections and Articles */}
          <div className="space-y-6">
            {currentDoc.sections.map((section, sIndex) => (
              <div key={sIndex} className="space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-l-2 border-purple-600 pl-3">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.articles.map((art, aIndex) => (
                    <div
                      key={aIndex}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                    >
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-baseline gap-2">
                        <span className="text-purple-700 font-mono text-xs font-bold uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {art.number}
                        </span>
                        <span>{art.title}</span>
                      </h4>

                      <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {art.content.map((p, pIndex) => (
                          <p key={pIndex}>{p}</p>
                        ))}
                      </div>

                      {art.callout && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2.5 mt-3 ${
                            art.callout.type === 'info'
                              ? 'bg-blue-50 border border-blue-200 text-blue-900'
                              : art.callout.type === 'warning'
                              ? 'bg-amber-50 border border-amber-200 text-amber-900'
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          }`}
                        >
                          {art.callout.type === 'info' && (
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          {art.callout.type === 'warning' && (
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          )}
                          {art.callout.type === 'success' && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="font-medium leading-relaxed">{art.callout.text}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Une question juridique ? Contactez notre DPO :{' '}
            <a
              href="mailto:support@pokedress.fr"
              className="text-purple-600 hover:text-purple-800 font-semibold underline"
            >
              support@pokedress.fr
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors self-end sm:self-auto"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
