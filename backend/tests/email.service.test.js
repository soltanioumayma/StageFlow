const { sendEmail } = require('../src/services/email.service');

describe('Email Service', () => {
  describe('sendEmail', () => {
    it('should have sendEmail function defined', () => {
      expect(sendEmail).toBeDefined();
      expect(typeof sendEmail).toBe('function');
    });

    it('should accept correct number of parameters', () => {
      expect(sendEmail.length).toBe(5);
    });
  });
});
