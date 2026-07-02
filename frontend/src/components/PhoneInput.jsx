import { useState, useEffect } from 'react';

const countries = [
  { code: 'TN', name: 'Tunisie', dialCode: '+216', length: 8, flag: '🇹🇳' },
  { code: 'FR', name: 'France', dialCode: '+33', length: 9, flag: '🇫🇷' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', length: 9, flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', length: 9, flag: '🇩🇿' },
  { code: 'EG', name: 'Égypte', dialCode: '+20', length: 10, flag: '🇪🇬' },
  { code: 'SA', name: 'Arabie Saoudite', dialCode: '+966', length: 9, flag: '🇸🇦' },
  { code: 'AE', name: 'Émirats Arabes Unis', dialCode: '+971', length: 9, flag: '🇦🇪' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', length: 8, flag: '🇶🇦' },
  { code: 'KW', name: 'Koweït', dialCode: '+965', length: 8, flag: '🇰🇼' },
  { code: 'BH', name: 'Bahreïn', dialCode: '+973', length: 8, flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dialCode: '+968', length: 8, flag: '🇴🇲' },
  { code: 'LB', name: 'Liban', dialCode: '+961', length: 8, flag: '🇱🇧' },
  { code: 'JO', name: 'Jordanie', dialCode: '+962', length: 9, flag: '🇯🇴' },
  { code: 'IQ', name: 'Irak', dialCode: '+964', length: 10, flag: '🇮🇶' },
  { code: 'SY', name: 'Syrie', dialCode: '+963', length: 9, flag: '🇸🇾' },
  { code: 'YE', name: 'Yémen', dialCode: '+967', length: 9, flag: '🇾🇪' },
  { code: 'LY', name: 'Libye', dialCode: '+218', length: 10, flag: '🇱🇾' },
  { code: 'SD', name: 'Soudan', dialCode: '+249', length: 9, flag: '🇸🇩' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', length: 10, flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', length: 10, flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', length: 11, flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', dialCode: '+39', length: 10, flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', length: 9, flag: '🇪🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', length: 10, flag: '🇨🇦' },
  { code: 'AU', name: 'Australie', dialCode: '+61', length: 9, flag: '🇦🇺' },
  { code: 'JP', name: 'Japon', dialCode: '+81', length: 10, flag: '🇯🇵' },
  { code: 'CN', name: 'Chine', dialCode: '+86', length: 11, flag: '🇨🇳' },
  { code: 'IN', name: 'Inde', dialCode: '+91', length: 10, flag: '🇮🇳' },
  { code: 'BR', name: 'Brésil', dialCode: '+55', length: 11, flag: '🇧🇷' },
  { code: 'RU', name: 'Russie', dialCode: '+7', length: 10, flag: '🇷🇺' },
  { code: 'TR', name: 'Turquie', dialCode: '+90', length: 10, flag: '🇹🇷' },
];

const PhoneInput = ({ label, name = 'telephone', value, onChange, required, error, className = '' }) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Tunisie par défaut
  const [phoneNumber, setPhoneNumber] = useState('');

  // Synchronise l'état interne avec la prop `value` venant du parent.
  // Nécessaire car le composant est démonté/remonté quand on change d'étape
  // (retour à l'étape 1) : sans ça, phoneNumber repart à '' à chaque remount.
  useEffect(() => {
    if (!value) {
      setPhoneNumber('');
      return;
    }
    const country = countries.find((c) => value.startsWith(c.dialCode));
    if (country) {
      setSelectedCountry(country);
      setPhoneNumber(value.slice(country.dialCode.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // uniquement au montage : on ne veut pas écraser la saisie en cours

  // Émet un événement compatible avec handleChange(e) du parent : { target: { name, value } }
  const emitChange = (dialCode, number) => {
    onChange({
      target: {
        name,
        value: `${dialCode}${number}`,
      },
    });
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find((c) => c.code === countryCode);
    setSelectedCountry(country);
    emitChange(country.dialCode, phoneNumber);
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, ''); // Only digits
    setPhoneNumber(digitsOnly);
    emitChange(selectedCountry.dialCode, digitsOnly);
  };

  const validatePhone = () => {
    if (phoneNumber.length !== selectedCountry.length) {
      return `Le numéro doit contenir ${selectedCountry.length} chiffres pour ${selectedCountry.name}`;
    }
    return '';
  };

  const validationError = phoneNumber ? validatePhone() : '';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {/* Country Selector */}
        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          style={{
            padding: '14px 8px',
            backgroundColor: '#F0F1F5',
            border: 'none',
            borderRadius: '10px',
            outline: 'none',
            minWidth: '120px',
            color: '#111827',
          }}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.dialCode}
            </option>
          ))}
        </select>

        {/* Phone Input */}
        <input
          type="tel"
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={`Entrez ${selectedCountry.length} chiffres`}
          maxLength={selectedCountry.length}
          style={{
            flex: 1,
            padding: '14px 16px',
            backgroundColor: '#F0F1F5',
            border: 'none',
            borderRadius: '10px',
            outline: 'none',
            color: '#111827',
          }}
        />
      </div>

      {(error || validationError) && (
        <p className="text-red-500 text-sm mt-1">{error || validationError}</p>
      )}
    </div>
  );
};

export default PhoneInput;