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

  // Étape 1: Infos personnelles
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

  // Liste des indicatifs (mêmes valeurs que dans PhoneInput.jsx),
  // triés du plus long au plus court pour éviter les ambiguïtés (+20 vs +212 par ex.)
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

  // GitHub (optionnel) : si rempli, doit être un lien github.com valide
if (formData.lien_github.trim()) {
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
  if (!githubRegex.test(formData.lien_github.trim())) {
    setError('Lien GitHub invalide. Format attendu : github.com/votreprofil');
    return false;
  }
}

// LinkedIn (optionnel) : si rempli, doit être un lien linkedin.com/in/... valide
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
        if (!formData.cv) {
          setError('Veuillez déposer votre CV');
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
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="text-blue-600 font-semibold"
          >
            ← Retour
          </button>
          <span className="text-sm text-gray-500">Étape {step}/4</span>
        </div>
        
        {/* Progress Bar - 4 Pills */}
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

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-md mx-auto">
          {/* Title outside card */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {step === 1 && 'Informations'}
            {step === 2 && 'Formation'}
            {step === 3 && 'Documents'}
            {step === 4 && 'Récapitulatif'}
          </h1>

          {/* Card */}
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  CV et lettre de motivation
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50">
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf"
                    onChange={handleChange}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer"
                  >
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-blue-600 font-semibold mb-1">Déposer votre CV</p>
                    <p className="text-xs text-gray-500">PDF - Max 5 Mo</p>
                    {formData.cv && (
                      <p className="text-sm text-green-600 mt-2">✓ {formData.cv.name}</p>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Lettre de motivation
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
                    backgroundColor: '#F0F1F5',
                    border: 'none',
                    borderRadius: '10px',
                    outline: 'none',
                    color: '#111827',
                    resize: 'none',
                  }}
                />
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

      {/* Footer Buttons - Fixed Bar */}
      {/* Footer Buttons - Fixed Bar */}
<div className="bg-white border-t border-gray-200 px-4 py-4">
  <div className="max-w-md mx-auto flex gap-4">
    <button
      onClick={handleBack}
      disabled={step === 1}
      className="flex-1 py-3 px-6 rounded-[30px] border border-gray-300 bg-gray-50 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Retour
    </button>
    <button
      onClick={step === 4 ? handleSubmit : handleNext}
      disabled={loading}
      className="flex-1 py-3 px-6 rounded-[30px] bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Envoi...' : step === 4 ? 'Continuer' : 'Continuer'}
    </button>
  </div>
</div>
    </div>
  );
};

export default CandidatureForm;
