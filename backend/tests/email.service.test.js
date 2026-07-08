const { sendEmail } = require('../src/services/email.service');
const Notification = require('../src/models/Notification.model');
const logger = require('../src/utils/logger');

jest.mock('../src/models/Notification.model');
jest.mock('../src/utils/logger');
jest.mock('nodemailer');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail
      });
      Notification.create.mockResolvedValue({ id: 1 });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Body'
      });

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
    });

    it('should handle email sending errors', async () => {
      const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP Error'));
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail
      });

      await expect(sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Body'
      })).rejects.toThrow('SMTP Error');

      expect(logger.error).toHaveBeenCalled();
    });

    it('should log notification in database', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail
      });
      Notification.create.mockResolvedValue({ id: 1 });

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Body',
        type: 'confirmation'
      });

      expect(Notification.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        type: 'confirmation',
        subject: 'Test Subject',
        status: 'sent'
      });
    });

    it('should handle HTML content', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
      require('nodemailer').createTransport.mockReturnValue({
        sendMail: mockSendMail
      });

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>'
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: '<p>Test HTML</p>'
        })
      );
    });
  });
});
