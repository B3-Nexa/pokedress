import React, { useState } from 'react';
import {
  X,
  Check,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Infinity as InfinityIcon,
  Users,
  Lock,
  ArrowRight,
  Zap,
  Star,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { Household } from '../../types/inventory.types.js';
import { api } from '../../api/items.api.js';

export type LegalTabKey = 'cgv' | 'cgu' | 'mentions' | 'rgpd';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household | null;
  onSubscriptionUpdated: () => void;
  onOpenLegal?: (tab: LegalTabKey) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  household,
  onSubscriptionUpdated,
  onOpenLegal,
}) => {
  const isCurrentlyPremium = household?.plan === 'premium';

  // Modal view states: 'plans' | 'checkout' | 'success' | 'downgrade-confirm'
  const [view, setView] = useState<'plans' | 'checkout' | 'success' | 'downgrade-confirm'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    household?.billing_cycle || 'yearly'
  );

  // Fake checkout form state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Payment processing simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  if (!isOpen) return null;

  const priceFormatted = billingCycle === 'yearly' ? '29,99 €' : '3,99 €';
  const pricePeriod = billingCycle === 'yearly' ? '/ an' : '/ mois';

  // Format credit card number with spaces every 4 digits
  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    setCardNumber(formatted);
  };

  // Format expiration date MM/YY
  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  // Auto-fill test card
  const handleAutoFillTestCard = () => {
    setCardHolder('Léa & Marc');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setFormError(null);
  };

  // Reset state on close
  const handleClose = () => {
    setView('plans');
    setFormError(null);
    setIsProcessing(false);
    onClose();
  };

  // Process fake checkout
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 16) {
      setFormError('Veuillez renseigner un numéro de carte valide à 16 chiffres (ou cliquer sur « Remplir avec une carte de test »).');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setFormError("Veuillez renseigner une date d'expiration valide (MM/AA).");
      return;
    }
    if (cardCvc.length < 3) {
      setFormError('Veuillez renseigner un code CVC valide à 3 chiffres.');
      return;
    }
    if (!cardHolder.trim()) {
      setFormError('Veuillez renseigner le nom du titulaire de la carte.');
      return;
    }

    // Step 1: Processing simulation
    setIsProcessing(true);
    setProcessingStep('Chiffrement sécurisé des coordonnées...');

    try {
      await new Promise((r) => setTimeout(r, 450));
      setProcessingStep('Validation 3D-Secure bancaire simulée...');
      await new Promise((r) => setTimeout(r, 550));
      setProcessingStep('Activation de votre formule Premium PokeDress...');

      // Call real backend endpoint
      await api.updateSubscription({
        plan: 'premium',
        billing_cycle: billingCycle,
      });

      await new Promise((r) => setTimeout(r, 300));
      setIsProcessing(false);
      setView('success');
      onSubscriptionUpdated();
    } catch (err: any) {
      setIsProcessing(false);
      setFormError(err.message || "Erreur lors de l'enregistrement de l'abonnement");
    }
  };

  // Downgrade to free plan
  const handleDowngrade = async () => {
    setIsProcessing(true);
    try {
      await api.updateSubscription({
        plan: 'free',
      });
      setIsProcessing(false);
      setView('plans');
      onSubscriptionUpdated();
      handleClose();
    } catch (err: any) {
      setIsProcessing(false);
      setFormError(err.message || 'Impossible de modifier la formule');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Dialog Container: max-h-[92vh] to always keep header and footer in view */}
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Sticky Header: flex-shrink-0 to never disappear off-screen */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-lg flex items-center gap-1.5 sm:gap-2 leading-tight">
                PokeDress <span className="text-purple-300">Abonnement</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate max-w-[210px] sm:max-w-none">
                Gérez votre formule pour débloquer tout le potentiel
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fermer la fenêtre d'abonnement"
            className="touch-target p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Container: flex-1 overflow-y-auto ensures clean internal scrolling */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 overscroll-contain">
          {/* VIEW: CURRENTLY PREMIUM / DOWNGRADE CONFIRM */}
          {isCurrentlyPremium && view === 'plans' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-emerald-50 to-purple-50 border border-purple-200 shadow-sm flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300 text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      Formule Active
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Facturation {household?.billing_cycle === 'yearly' ? 'Annuelle' : 'Mensuelle'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 truncate">
                    PokeDress Premium Illimité
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Votre foyer bénéficie d'un inventaire illimité, de pièces illimitées et de toutes les fonctionnalités avancées.
                  </p>
                </div>
              </div>

              {/* Perks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Objets & vêtements illimités</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Membres illimités dans le foyer</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Valorisation assurance & export</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Support prioritaire réactif</span>
                </div>
              </div>

              {/* Downgrade Action Card */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400 text-center sm:text-left">
                  Besoin de tester la formule gratuite ou de résilier ?
                </span>
                <button
                  onClick={() => setView('downgrade-confirm')}
                  className="touch-target px-4 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors w-full sm:w-auto"
                >
                  Rétrograder vers la formule Gratuite
                </button>
              </div>
            </div>
          )}

          {/* VIEW: CONFIRM DOWNGRADE */}
          {view === 'downgrade-confirm' && (
            <div className="space-y-4 sm:space-y-5 text-center py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  Confirmer le retour à la formule Gratuite ?
                </h4>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  En repassant au forfait gratuit, le plafond sera réappliqué à <strong>100 objets maximum</strong>. Vos objets existants ne seront <strong>jamais supprimés</strong> et resteront consultables en lecture, mais vous ne pourrez plus en ajouter tant que vous dépasserez ce seuil.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
                <button
                  type="button"
                  onClick={() => setView('plans')}
                  disabled={isProcessing}
                  className="touch-target px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
                >
                  Annuler et rester Premium
                </button>
                <button
                  type="button"
                  onClick={handleDowngrade}
                  disabled={isProcessing}
                  className="touch-target px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  <span>Rétrograder en Gratuit</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: FREE PLAN USER CHOOSING UPGRADE (Step 1) */}
          {!isCurrentlyPremium && view === 'plans' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Billing Cycle Switcher: Compact & clean on mobile, spacious on desktop */}
              <div className="flex items-center justify-center">
                <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 sm:gap-1.5 border border-slate-200/80 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[52px] ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span className="font-extrabold text-[11px] sm:text-xs">
                      <span className="hidden sm:inline">Facturation </span>Mensuelle
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold ${
                        billingCycle === 'monthly' ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      3,99 € / mois
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[52px] ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span className="font-extrabold text-[11px] sm:text-xs">
                      <span className="hidden sm:inline">Facturation </span>Annuelle
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold ${
                        billingCycle === 'yearly' ? 'text-purple-600' : 'text-purple-700/70'
                      }`}
                    >
                      29,99 € / an <span className="hidden sm:inline">(-37%)</span>
                    </span>
                    <span className="absolute -top-2.5 -right-1 sm:-right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[8px] sm:text-[9px] font-black tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                      2 MOIS OFFERTS
                    </span>
                  </button>
                </div>
              </div>

              {/* Side-by-side Plan Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Free Plan Card */}
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Gratuit
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        Formule Actuelle
                      </span>
                    </div>
                    <div className="mt-2.5 sm:mt-3">
                      <span className="text-2xl font-extrabold text-slate-900">0 €</span>
                      <span className="text-xs text-slate-500 ml-1">pour toujours</span>
                    </div>
                    <ul className="mt-3.5 sm:mt-4 space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>Jusqu'à 100 objets au total</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>2 membres dans le foyer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>Ajout rapide & gestion dressing</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-400">
                        <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <span className="line-through">Objets illimités</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 text-center">
                    <span className="text-xs text-slate-400 italic">Votre forfait actuel</span>
                  </div>
                </div>

                {/* Premium Plan Card */}
                <div className="border-2 border-purple-500 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-purple-50/50 to-white flex flex-col justify-between shadow-lg shadow-purple-500/10 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommandé
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Premium
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Sans engagement
                      </span>
                    </div>
                    <div className="mt-2.5 sm:mt-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{priceFormatted}</span>
                      <span className="text-xs text-slate-500 ml-1 font-medium">{pricePeriod}</span>
                    </div>
                    <ul className="mt-3.5 sm:mt-4 space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2 font-semibold">
                        <InfinityIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>Objets & vêtements illimités</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>Membres illimités au foyer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>Valorisation assurance exportable</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>Support client prioritaire</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-100">
                    <button
                      type="button"
                      onClick={() => setView('checkout')}
                      className="touch-target w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                    >
                      <span>Passer à PokeDress Premium</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Test 100% sécurisé
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Résiliation libre en 1 clic
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Données protégées
                </span>
              </div>
            </div>
          )}

          {/* VIEW: FAKE PAYMENT CHECKOUT (Step 2) */}
          {!isCurrentlyPremium && view === 'checkout' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Back to plans button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView('plans')}
                  disabled={isProcessing}
                  className="touch-target text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                >
                  ← Changer d'offre
                </button>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Montant : </span>
                  <span className="font-extrabold text-sm text-purple-700">
                    {priceFormatted} {pricePeriod}
                  </span>
                </div>
              </div>

              {/* Sandbox info banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Simulateur de test :</strong> Aucun débit bancaire réel.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillTestCard}
                  className="touch-target px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs self-start sm:self-auto"
                >
                  ✨ Remplir avec une carte de test
                </button>
              </div>

              {/* Realistic credit card preview: Compact on mobile */}
              <div className="h-38 sm:h-44 md:h-48 w-full max-w-sm mx-auto rounded-2xl p-4 sm:p-5 bg-gradient-to-tr from-slate-900 via-purple-900 to-indigo-900 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-purple-200">
                    PokeDress Pay
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/80 -mr-2"></div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/80"></div>
                  </div>
                </div>

                <div className="space-y-1 my-auto py-2">
                  <div className="font-mono text-base sm:text-xl font-bold tracking-widest text-slate-100">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-purple-200">
                  <div>
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-purple-300/70">Titulaire</span>
                    <span className="font-semibold text-slate-100 uppercase truncate max-w-[130px] sm:max-w-[150px] block text-[11px] sm:text-xs">
                      {cardHolder || 'LÉA & MARC'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-purple-300/70">Expire fin</span>
                    <span className="font-semibold text-slate-100 text-[11px] sm:text-xs">{cardExpiry || 'MM/AA'}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-3 sm:space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom complet sur la carte
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Léa & Marc"
                    required
                    disabled={isProcessing}
                    className="w-full text-sm px-3.5 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de carte bancaire
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      required
                      maxLength={19}
                      disabled={isProcessing}
                      className="w-full text-sm font-mono px-3.5 py-2 sm:py-2.5 pl-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 sm:top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="12/28"
                      required
                      maxLength={5}
                      disabled={isProcessing}
                      className="w-full text-sm font-mono px-3.5 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CVC (Cryptogramme)
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                      maxLength={4}
                      disabled={isProcessing}
                      className="w-full text-sm font-mono px-3.5 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Submit button with loader or step progress */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="touch-target w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/25 flex flex-col items-center justify-center transition-all disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{processingStep}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>
                          Régler {priceFormatted} {pricePeriod} (Factice)
                        </span>
                      </div>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    🔒 Paiement crypté en SSL 256 bits · Simulation sécurisée de test
                  </p>

                  {/* Legal Terms acceptance note */}
                  <p className="text-[10px] text-center text-slate-500 mt-1.5 leading-relaxed">
                    En validant, vous acceptez les{' '}
                    {onOpenLegal ? (
                      <button
                        type="button"
                        onClick={() => onOpenLegal('cgv')}
                        className="text-purple-600 hover:text-purple-800 underline font-semibold"
                      >
                        Conditions Générales de Vente (CGV)
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-700">Conditions Générales de Vente</span>
                    )}{' '}
                    et bénéficiez du droit de rétractation légal de 14 jours.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: SUCCESS SCREEN (Step 3) */}
          {view === 'success' && (
            <div className="text-center py-4 sm:py-6 space-y-4 sm:space-y-5 animate-fadeIn">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                  PokeDress Premium Débloqué
                </span>
                <h4 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-2">
                  Bienvenue dans l'illimité !
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre abonnement factice a été activé avec succès pour le foyer. Le plafond des 100 objets est immédiatement levé !
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Formule :</span>
                  <span className="font-bold text-slate-800">PokeDress Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Périodicité :</span>
                  <span className="font-semibold text-slate-800">
                    {billingCycle === 'yearly' ? 'Annuelle (29,99 € / an)' : 'Mensuelle (3,99 € / mois)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut :</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Actif
                  </span>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="touch-target px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-98 w-full sm:w-auto"
                >
                  Continuer à inventorier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
