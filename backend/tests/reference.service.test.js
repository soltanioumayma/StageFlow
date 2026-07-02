const { generateReference } = require('../src/services/reference.service');
const Candidature = require('../src/models/Candidature.model');

jest.mock('../src/models/Candidature.model');

describe('Reference Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReference', () => {
    it('should generate first reference of the year', async () => {
      const year = new Date().getFullYear();
      Candidature.getLastReferenceOfYear.mockResolvedValue(null);

      const reference = await generateReference();

      expect(reference).toBe(`RIF-${year}-0001`);
      expect(Candidature.getLastReferenceOfYear).toHaveBeenCalledWith(year);
    });

    it('should increment reference based on last one', async () => {
      const year = new Date().getFullYear();
      Candidature.getLastReferenceOfYear.mockResolvedValue({
        reference: `RIF-${year}-0042`
      });

      const reference = await generateReference();

      expect(reference).toBe(`RIF-${year}-0043`);
    });

    it('should handle year transition correctly', async () => {
      const year = new Date().getFullYear();
      Candidature.getLastReferenceOfYear.mockResolvedValue(null);

      const reference = await generateReference();

      expect(reference).toContain(`RIF-${year}-`);
      expect(reference).toMatch(/RIF-\d{4}-\d{4}/);
    });

    it('should pad numbers to 4 digits', async () => {
      const year = new Date().getFullYear();
      Candidature.getLastReferenceOfYear.mockResolvedValue({
        reference: `RIF-${year}-0099`
      });

      const reference = await generateReference();

      expect(reference).toBe(`RIF-${year}-0100`);
    });

    it('should handle large numbers correctly', async () => {
      const year = new Date().getFullYear();
      Candidature.getLastReferenceOfYear.mockResolvedValue({
        reference: `RIF-${year}-9999`
      });

      const reference = await generateReference();

      expect(reference).toBe(`RIF-${year}-10000`);
    });
  });
});
