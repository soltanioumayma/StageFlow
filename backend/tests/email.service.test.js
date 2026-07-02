jest.mock('../src/models/Notification.model');
jest.mock('../src/utils/logger');

const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail
  }))
}));

const { sendEmail } = require('../src/services/email.service');
const Notification = require('../src/models/Notification.model');
const logger = require('../src/utils/logger');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-id' });
    Notification.create.mockResolvedValue({ id: 1 });
  });

  describe('sendEmail', () => {
    it('should send confirmation email successfully', async () => {
      const result = await sendEmail('confirmation', 'test@example.com', 'Ahmed', 'RIF-2026-0042', 1);

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
    });

    it('should send acceptance email successfully', async () => {
      const result = await sendEmail('acceptee', 'test@example.com', 'Ahmed', 'RIF-2026-0042', 1);

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should send rejection email successfully', async () => {
      const result = await sendEmail('refusee', 'test@example.com', 'Ahmed', 'RIF-2026-0042', 1);

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should handle email sending errors', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));

      await expect(sendEmail('confirmation', 'test@example.com', 'Ahmed', 'RIF-2026-0042', 1))
        .rejects.toThrow();

      expect(logger.error).toHaveBeenCalled();
    });

    it('should log notification in database', async () => {
      await sendEmail('confirmation', 'test@example.com', 'Ahmed', 'RIF-2026-0042', 1);

      expect(Notification.create).toHaveBeenCalled();
    });
  });
});
