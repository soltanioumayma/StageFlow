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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Status Bar - Only on mobile */}
      <div className="h-[47px] bg-white px-6 flex items-center justify-between md:hidden">
        <span className="text-slate-900 text-sm font-semibold">9:41</span>
        <span className="text-slate-900 text-xs">●●● ▮</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-auto">
        {/* Container for desktop */}
        <div className="max-w-md mx-auto">
          {/* Banner */}
          <div className="w-full h-[160px] rounded-2xl shadow-sm border border-slate-200 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-8 md:mb-12 overflow-hidden">
            <div className="text-center">
              <h2 className="text-4xl font-normal text-blue-700" style={{ fontFamily: 'K2D, sans-serif' }}>
                Groupe RIF
              </h2>
            </div>
          </div>

        {/* Title */}
        <h1 className="text-[34px] font-bold text-slate-900 leading-[40px] mb-4">
          Votre stage,<br />simplifié.
        </h1>

        {/* Description */}
        <p className="text-base text-slate-500 leading-6 mb-8">
          Postulez en quelques minutes. Suivez votre dossier en temps réel.
        </p>

        {/* Features List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-base font-semibold">{feature.number}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{feature.title}</p>
                  <p className="text-xs text-slate-500">{feature.description}</p>
                </div>
              </div>
              {index < features.length - 1 && <div className="h-px bg-slate-200 mx-4" />}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('/candidature')}
          className="w-full shadow-sm"
        >
          Commencer ma candidature
        </Button>

        {/* Already Applied Link */}
        <button
          onClick={() => navigate('/suivi')}
          className="w-full text-center text-blue-600 text-sm font-medium mt-4 mb-8"
        >
          J'ai déjà postulé
        </button>
        </div>
      </div>

      {/* Home Indicator - Only on mobile */}
      <div className="h-[34px] flex items-center justify-center md:hidden">
        <div className="w-[134px] h-1 bg-slate-900/20 rounded-full" />
      </div>
    </div>
  );
};

export default Welcome;
