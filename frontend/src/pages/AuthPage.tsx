import React, { useState } from 'react';
import { api } from '../api/items.api.js';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../components/common/Logo.js';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [householdMode, setHouseholdMode] = useState<'create' | 'join'>('create');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [householdName, setHouseholdName] = useState('Mon Foyer');
  const [inviteCode, setInviteCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await api.login({ email, password });
      } else {
        const payload: {
          email: string;
          name: string;
          password: string;
          household_name?: string;
          invite_code?: string;
        } = {
          email,
          name,
          password,
        };

        if (householdMode === 'join') {
          // Normaliser le code (majuscules, espaces supprimés) per [CA-5.4]
          payload.invite_code = inviteCode.replace(/\s+/g, '').toUpperCase();
        } else {
          payload.household_name = householdName.trim() || 'Mon Foyer';
        }

        await api.register(payload);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3">
          <Logo size="lg" variant="icon" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Poke<span className="text-purple-600">Dress</span>
          </h1>
        </div>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          L'inventaire universel de la maison sans prise de tête
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Votre Prénom ou Nom
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Alex ou Marc"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adresse Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {mode === 'register' && (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Votre Foyer
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHouseholdMode('create')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      householdMode === 'create'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Créer mon foyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setHouseholdMode('join')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      householdMode === 'join'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Rejoindre avec code
                  </button>
                </div>

                {householdMode === 'create' ? (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Nom du foyer (optionnel)
                    </label>
                    <input
                      type="text"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                      placeholder="Mon Foyer"
                      className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Code d'invitation à 6 caractères [CA-5.4]
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="ex: X7K9P2"
                      className="w-full text-center tracking-widest font-mono text-base font-bold uppercase px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full touch-target mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Chargement...' : mode === 'login' ? 'Connexion' : 'Commencer l\'inventaire'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Inventaire collaboratif sans prise de tête • Gratuit jusqu'à 100 objets et 2 membres
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
