import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reference, candidatureId } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>
      <div className="max-w-md mx-auto text-center w-full relative z-10">
        {}
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-500 mb-6">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidature envoyée</h1>
        <p className="text-gray-600 mb-8">Votre dossier a bien été reçu</p>

        {reference && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Votre référence de suivi</p>
            <p className="text-xl font-bold text-blue-600">{reference}</p>
          </div>
        )}

        <div className="flex gap-4 w-full max-w-xs mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            Retour
          </button>
          <Button onClick={() => navigate('/suivi')} className="flex-1">
            Voir mon statut
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
