import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      number: '1',
      title: 'Candidature guidée',
      description: '4 étapes simples',
    },
    {
      number: '2',
      title: 'Suivi en direct',
      description: 'Statut mis à jour',
    },
    {
      number: '3',
      title: 'Validation RH',
      description: 'Notification via email',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      <div className="flex-1 px-6 py-8 overflow-auto relative z-10">
        <div className="max-w-md mx-auto">

          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-blue-500 shadow-xl shadow-blue-100/50 px-8 py-5 flex items-center justify-center gap-4 mb-10">
            <div className="w-14 h-14 flex-shrink-0">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad" x1="20%" y1="20%" x2="80%" y2="80%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path d="M40 60 L100 20 L160 60 L160 140 L100 180 L40 140 Z" fill="url(#grad)" />
                <path d="M70 90 L100 70 L130 90 L130 120 L100 140 L70 120 Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'K2D, sans-serif' }}>
                Groupe RIF
              </h2>
              <p className="text-xs text-slate-500 -mt-1">Entreprise Internationale</p>
            </div>
          </div>

          <h1 className="text-[34px] font-bold text-slate-900 leading-[38px] mb-4 text-center">
            Votre stage,<br />simplifié.
          </h1>

          <p className="text-base text-slate-600 leading-6 mb-10 text-center">
            Postulez en quelques minutes. Suivez<br />votre dossier en temps réel.
          </p>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-blue-500 shadow-xl shadow-blue-100/50 overflow-hidden mb-10">
            {features.map((feature, index) => (
              <div key={index}>
                <div className="flex items-center gap-4 p-6">
                  <div className="w-9 h-9 bg-blue-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-blue-600 text-lg font-semibold">{feature.number}</span>
                  </div>
                  <div>
                    <p className="text-[17px] font-semibold text-slate-900">{feature.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{feature.description}</p>
                  </div>
                </div>
                {index < features.length - 1 && (
                  <div className="h-px bg-slate-100 mx-6" />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate('/candidature')}
            className="w-full py-3.5 text-base font-semibold shadow-sm"
          >
            Commencer ma candidature
          </Button>

          <button
            onClick={() => navigate('/suivi')}
            className="w-full text-center text-blue-600 text-[15px] font-medium mt-5 mb-8"
          >
            J'ai déjà postulé
          </button>
        </div>
      </div>

      <div className="h-[34px] flex items-center justify-center md:hidden">
        <div className="w-[134px] h-1 bg-slate-900/20 rounded-full" />
      </div>
    </div>
  );
};

export default Welcome;
