const {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isNotEmpty,
  isInList,
  cleanString,
  validateCandidatureData,
  validateDecisionData
} = require('../src/utils/validators');

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('+21612345678')).toBe(true);
      expect(isValidPhone('12345678')).toBe(true);
      expect(isValidPhone('+33 6 12 34 56 78')).toBe(true);
    });

    it('should accept null/undefined as optional', () => {
      expect(isValidPhone(null)).toBe(true);
      expect(isValidPhone(undefined)).toBe(true);
      expect(isValidPhone('')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://github.com/user')).toBe(true);
      expect(isValidUrl('https://www.linkedin.com/in/user')).toBe(true);
    });

    it('should accept null/undefined as optional', () => {
      expect(isValidUrl(null)).toBe(true);
      expect(isValidUrl(undefined)).toBe(true);
      expect(isValidUrl('')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('htp://invalid')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('test')).toBe(true);
      expect(isNotEmpty('  test  ')).toBe(true);
    });

    it('should return false for empty values', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isInList', () => {
    it('should return true if value is in list', () => {
      expect(isInList('BTS', ['BTS', 'Licence', 'Master'])).toBe(true);
      expect(isInList('Master', ['BTS', 'Licence', 'Master'])).toBe(true);
    });

    it('should return false if value is not in list', () => {
      expect(isInList('Doctorat', ['BTS', 'Licence', 'Master'])).toBe(false);
    });
  });

  describe('cleanString', () => {
    it('should trim whitespace', () => {
      expect(cleanString('  test  ')).toBe('test');
    });

    it('should convert to lowercase when requested', () => {
      expect(cleanString('TEST', true)).toBe('test');
    });

    it('should handle null/undefined', () => {
      expect(cleanString(null)).toBe(null);
      expect(cleanString(undefined)).toBe(null);
    });
  });

  describe('validateCandidatureData', () => {
    it('should validate complete candidature data', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'ahmed@example.com',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'Master',
        type_stage: 'PFE',
        telephone: '+21612345678',
        lien_github: 'https://github.com/user',
        lien_linkedin: 'https://linkedin.com/in/user',
        lettre_motivation: 'Motivation letter',
        rgpd_accepted: 'true'
      };

      const errors = validateCandidatureData(data);
      expect(errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali'
      };

      const errors = validateCandidatureData(data);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('email'))).toBe(true);
    });

    it('should detect invalid email', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'invalid-email',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'Master',
        type_stage: 'PFE',
        rgpd_accepted: 'true'
      };

      const errors = validateCandidatureData(data);
      expect(errors.some(e => e.includes('Email'))).toBe(true);
    });

    it('should detect invalid phone number', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'ahmed@example.com',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'Master',
        type_stage: 'PFE',
        telephone: '123',
        rgpd_accepted: 'true'
      };

      const errors = validateCandidatureData(data);
      expect(errors.some(e => e.includes('téléphone'))).toBe(true);
    });

    it('should detect invalid URLs', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'ahmed@example.com',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'Master',
        type_stage: 'PFE',
        lien_github: 'not-a-url',
        rgpd_accepted: 'true'
      };

      const errors = validateCandidatureData(data);
      expect(errors.some(e => e.includes('GitHub'))).toBe(true);
    });

    it('should detect invalid niveau', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'ahmed@example.com',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'InvalidLevel',
        type_stage: 'PFE',
        rgpd_accepted: 'true'
      };

      const errors = validateCandidatureData(data);
      expect(errors.some(e => e.includes('Niveau'))).toBe(true);
    });

    it('should detect missing RGPD acceptance', () => {
      const data = {
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        email: 'ahmed@example.com',
        etablissement: 'ENIT',
        specialite: 'Informatique',
        niveau: 'Master',
        type_stage: 'PFE',
        rgpd_accepted: 'false'
      };

      const errors = validateCandidatureData(data);
      expect(errors.some(e => e.includes('RGPD'))).toBe(true);
    });
  });

  describe('validateDecisionData', () => {
    it('should validate acceptee decision', () => {
      const data = { decision: 'acceptee' };
      const errors = validateDecisionData(data);
      expect(errors).toHaveLength(0);
    });

    it('should validate refusee decision', () => {
      const data = { decision: 'refusee' };
      const errors = validateDecisionData(data);
      expect(errors).toHaveLength(0);
    });

    it('should detect missing decision', () => {
      const data = {};
      const errors = validateDecisionData(data);
      expect(errors.some(e => e.includes('décision'))).toBe(true);
    });

    it('should detect invalid decision', () => {
      const data = { decision: 'invalid' };
      const errors = validateDecisionData(data);
      expect(errors.some(e => e.includes('Décision invalide'))).toBe(true);
    });
  });
});
