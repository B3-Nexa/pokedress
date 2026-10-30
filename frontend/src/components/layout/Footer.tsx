import React from 'react';
import { Logo } from '../common/Logo.js';
import { LegalTabKey } from '../../content/legalData.js';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: LegalTabKey) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-28 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" variant="icon" />
              <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                Poke<span className="text-purple-600">Dress</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              La solution moderne d'inventaire pour la maison et le dressing. Valorisez vos biens, simplifiez vos assurances et suivez le cycle de vie de vos vêtements en toute sérénité.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Garantie constitutionnelle : Vos données restent consultables à vie</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Informations Juridiques
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cgv')}
                  className="hover:text-purple-600 hover:underline transition-colors text-left"
                >
                  Conditions Générales de Vente (CGV)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cgu')}
                  className="hover:text-purple-600 hover:underline transition-colors text-left"
                >
                  Conditions Générales d'Utilisation (CGU)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('mentions')}
                  className="hover:text-purple-600 hover:underline transition-colors text-left"
                >
                  Mentions Légales & Éditeur
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('rgpd')}
                  className="hover:text-purple-600 hover:underline transition-colors text-left"
                >
                  Politique de Confidentialité (RGPD)
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Status & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transparence & Sécurité
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              PokeDress fonctionne en environnement sécurisé avec simulateur de carte bancaire factice. Aucun débit réel n'est effectué.
            </p>
            <p className="text-xs text-slate-400">
              Assistance & Support :{' '}
              <a
                href="mailto:support@pokedress.fr"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                support@pokedress.fr
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credits */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PokeDress. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec passion pour un foyer bien ordonné <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
