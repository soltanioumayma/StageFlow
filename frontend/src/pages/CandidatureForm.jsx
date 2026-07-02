import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import FileUpload from '../components/FileUpload';
import Card from '../components/Card';
import PhoneInput from '../components/PhoneInput';
import { candidatureService } from '../services/candidatureService';

const CandidatureForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    etablissement: '',
    specialite: '',
    niveau: '',
    type_stage: '',
    lien_github: '',
    lien_linkedin: '',
    lettre_motivation: '',
    rgpd_accepted: false,
    cv: null,
  });

  const niveaux = [
    { value: 'BTS', label: 'BTS' },
    { value: 'Licence', label: 'Licence' },
    { value: 'Master', label: 'Master' },
    { value: 'Ingenieur', label: 'Ingénieur' },
    { value: 'Doctorat', label: 'Doctorat' },
    { value: 'Autre', label: 'Autre' },
  ];

  const typesStage = [
    { value: 'PFE', label: 'PFE' },
    { value: 'Stage_ete', label: 'Stage d\'été' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Observation', label: 'Stage d\'observation' },
    { value: 'Autre', label: 'Autre' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1: {
  if (
    !formData.prenom.trim() ||
    !formData.nom.trim() ||
    !formData.email.trim() ||
    !formData.telephone.trim()
  ) {
    setError('Veuillez remplir tous les champs obligatoires');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email.trim())) {
    setError('Email invalide. Format attendu : xxxxxx@gmail.com');
    return false;
  }

  const DIAL_CODES = [
    '+216', '+212', '+213', '+966', '+971', '+974', '+965', '+973',
    '+968', '+961', '+962', '+964', '+963', '+967', '+218', '+249',
    '+33', '+20', '+44', '+49', '+39', '+34', '+61', '+81', '+86',
    '+91', '+55', '+90', '+1', '+7',
  ].sort((a, b) => b.length - a.length);

  const dialCode = DIAL_CODES.find((code) => formData.telephone.startsWith(code));
  const localNumber = dialCode
    ? formData.telephone.slice(dialCode.length)
    : formData.telephone.replace(/\D/g, '');

  if (localNumber.length < 8) {
    setError('Numéro de téléphone invalide');
    return false;
  }
  break;

}
      case 2: {
  if (!formData.etablissement.trim() || !formData.specialite.trim() || !formData.niveau || !formData.type_stage) {
    setError('Veuillez remplir tous les champs obligatoires');
    return false;
  }

if (formData.lien_github.trim()) {
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
  if (!githubRegex.test(formData.lien_github.trim())) {
    setError('Lien GitHub invalide. Format attendu : github.com/votreprofil');
    return false;
  }
}

if (formData.lien_linkedin.trim()) {
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  if (!linkedinRegex.test(formData.lien_linkedin.trim())) {
    setError('Lien LinkedIn invalide. Format attendu : linkedin.com/in/votreprofil');
    return false;
  }
}

  break;
}
      case 3:
        if (!formData.cv && !formData.lettre_motivation.trim()) {
          setError('CV et lettre de motivation sont obligatoires pour poursuivre la candidature.');
          return false;
        }
        if (!formData.cv) {
          setError('Veuillez ajouter votre CV avant de continuer.');
          return false;
        }
        if (!formData.lettre_motivation.trim()) {
          setError('Veuillez ajouter votre lettre de motivation avant de continuer.');
          return false;
        }
        break;
      case 4:
        if (!formData.rgpd_accepted) {
          setError('Vous devez accepter le traitement RGPD');
          return false;
        }
        break;
      default:
        return true;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
  if (step === 1) {
    navigate('/'); // retour à la page d'accueil
    return;
  }
  setStep(prev => prev - 1);
  setError('');
};

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'cv' && formData.cv) {
          formDataToSend.append('cv', formData.cv);
        } else if (key !== 'cv') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await candidatureService.submitCandidature(formDataToSend);
      navigate('/confirmation', { state: { reference: response.reference, candidatureId: response.candidatureId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 relative z-10">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="text-blue-600 font-semibold"
          >
            ← Retour
          </button>
          <span className="text-sm text-gray-500">Étape {step}/4</span>
        </div>
        <div className="max-w-md mx-auto flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto relative z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {step === 1 && 'Informations'}
            {step === 2 && 'Formation'}
            {step === 3 && 'Documents'}
            {step === 4 && 'Récapitulatif'}
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-base text-gray-600 font-normal">Commençons par vous connaître</p>
            <Input
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              required
            />
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
            <PhoneInput
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-base text-gray-600 font-normal">Parlez-nous de votre formation</p>
            <Input
              label="Établissement"
              name="etablissement"
              value={formData.etablissement}
              onChange={handleChange}
              placeholder="Ex: Université Iset Rades"
              required
            />
            <Input
              label="Spécialité"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              placeholder="Ex: Informatique de gestion"
              required
            />
            <Select
              label="Niveau d'études"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              options={niveaux}
              required
            />
            <Select
              label="Type de stage"
              name="type_stage"
              value={formData.type_stage}
              onChange={handleChange}
              options={typesStage}
              required
            />
            <Input
              label="Lien GitHub (optionnel)"
              name="lien_github"
              value={formData.lien_github}
              onChange={handleChange}
              placeholder="https://github.com/votreprofil"
            />
            <Input
              label="Lien LinkedIn (optionnel)"
              name="lien_linkedin"
              value={formData.lien_linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/votreprofil"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-base text-gray-600 font-normal">Ajoutez vos documents</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  CV <span className="text-red-500 ml-0.5">*</span>
                </label>

                <input
                  type="file"
                  name="cv"
                  accept=".pdf"
                  onChange={handleChange}
                  className="hidden"
                  id="cv-upload"
                />

                {formData.cv ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <polyline points="9 15 12 18 15 15"/>
                        <line x1="12" y1="18" x2="12" y2="11"/>
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{formData.cv.name}</p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">✓ Fichier prêt</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <label htmlFor="cv-upload" className="cursor-pointer text-xs text-gray-400 hover:text-blue-600 transition-colors underline underline-offset-2">
                        Remplacer
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="cv-upload"
                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                      !formData.cv && error
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${!formData.cv && error ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={!formData.cv && error ? '#ef4444' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${!formData.cv && error ? 'text-red-500' : 'text-blue-600'}`}>
                        Déposer votre CV
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF uniquement · Max 5 Mo</p>
                    </div>
                  </label>
                )}

                <p className={`text-xs mt-1.5 ${!formData.cv && error ? 'text-red-500' : 'text-gray-400'}`}>
                  {!formData.cv && error
                    ? '⚠ Obligatoire pour valider votre candidature'
                    : 'Obligatoire pour valider votre candidature'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Lettre de motivation <span className="text-red-500 ml-0.5">*</span>
                </label>
                <textarea
                  name="lettre_motivation"
                  value={formData.lettre_motivation}
                  onChange={handleChange}
                  placeholder="Je souhaite rejoindre Groupe RIF..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: !formData.lettre_motivation.trim() && error ? '#FEF2F2' : '#F0F1F5',
                    border: !formData.lettre_motivation.trim() && error ? '2px solid #F87171' : '2px solid transparent',
                    borderRadius: '10px',
                    outline: 'none',
                    color: '#111827',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                <p className={`text-xs mt-1.5 ${
                  !formData.lettre_motivation.trim() && error ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {!formData.lettre_motivation.trim() && error
                    ? '⚠ Obligatoire pour valider votre candidature'
                    : 'Obligatoire pour valider votre candidature'}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <p className="text-base text-gray-600 font-normal">Vérifiez avant envoi</p>
            
            <div className="space-y-3 text-sm bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{formData.prenom} {formData.nom}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Établissement:</span>
                <span className="font-medium">{formData.etablissement}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">CV:</span>
                <span className="font-medium">{formData.cv?.name || 'Non uploadé'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Spécialité:</span>
                <span className="font-medium">{formData.specialite}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Niveau:</span>
                <span className="font-medium">{formData.niveau}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Type de stage:</span>
                <span className="font-medium">{formData.type_stage}</span>
              </div>
              {formData.lien_github && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">GitHub:</span>
                  <span className="font-medium truncate max-w-[150px]">{formData.lien_github}</span>
                </div>
              )}
              {formData.lien_linkedin && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">LinkedIn:</span>
                  <span className="font-medium truncate max-w-[150px]">{formData.lien_linkedin}</span>
                </div>
              )}
            </div>
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="rgpd_accepted"
                checked={formData.rgpd_accepted}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="text-sm text-gray-700">
                J'accepte le traitement RGPD
              </span>
            </label>
          </div>
        )}
        </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-4 relative z-10">
  <div className="max-w-md mx-auto flex gap-4">
    <button
      onClick={handleBack}
      className="flex-1 py-3 px-6 rounded-[30px] border border-gray-300 bg-gray-50 text-gray-700 font-semibold"
    >
      Retour
    </button>
    <button
      onClick={step === 4 ? handleSubmit : handleNext}
      disabled={loading || (step === 3 && (!formData.cv || !formData.lettre_motivation.trim()))}
      className="flex-1 py-3 px-6 rounded-[30px] bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
    >
      {loading ? 'Envoi...' : step === 4 ? 'Soumettre' : 'Continuer'}
    </button>
  </div>
</div>
    </div>
  );
};

export default CandidatureForm;

