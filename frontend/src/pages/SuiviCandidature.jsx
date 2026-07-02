import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { candidatureService } from '../services/candidatureService';
import { formatDateMedium } from '../utils/dateHelpers';

const SuiviCandidature = () => {
  const navigate = useNavigate();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await candidatureService.suivreCandidature(reference, email);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const getTimelineStatus = (statut) => {
    switch (statut) {
      case 'completee':
        return 'bg-green-500';
      case 'en_attente':
        return 'bg-blue-500';
      case 'a_venir':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>
      {}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-4 relative z-10">
        <h1 className="text-lg font-bold text-gray-900">Mon dossier</h1>
      </div>

      {}
      <div className="flex-1 p-4 relative z-10">
        {!result ? (
          <Card className="w-full max-w-md mx-auto shadow-none border-0 p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Référence du dossier"
                name="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="RIF-2026-0042"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-6 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Retour
                </button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            {}
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-1">Référence</p>
              <p className="text-xl font-bold text-blue-600">{result.dossier.reference}</p>
            </div>

            {}
            <div className="space-y-4">
              {result.timeline.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${getTimelineStatus(step.statut)}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.nom}</p>
                    {step.statut === 'completee' && index === 0 && (
                      <p className="text-sm text-gray-500">
                        {formatDateMedium(result.dossier.submitted_at)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 capitalize">
                      {step.statut === 'completee' ? '' :
                       step.statut === 'en_attente' ? 'En attente' : 'À venir'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-6 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                Retour
              </button>
              <Button
                variant="secondary"
                onClick={() => {
                  setResult(null);
                  setReference('');
                  setEmail('');
                }}
                className="flex-1"
              >
                Nouvelle recherche
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviCandidature;
