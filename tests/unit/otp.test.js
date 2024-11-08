const { generateAndSaveOTP, verifyOtp } = require('../../apis/controller/otp');
const OTP = require('../../apis/models/otp');

describe('generateAndSaveOTP using create method', () => {


    it('successfully generates and saves an OTP', async () => {
        const user = 'testUser';


        const generatedOTP = await generateAndSaveOTP(user);
        expect(typeof generatedOTP).toBe('string');
        const otpNumber = Number(generatedOTP)
        expect(typeof otpNumber).toBe('number');
        expect(otpNumber).toBeGreaterThan(999);
    });


    jest.mock("../../apis/models/otp");

    OTP.findOneAndUpdate = jest.fn()


    describe('verifyOtp', () => {
        beforeEach(() => {
            OTP.findOneAndUpdate.mockClear();
        });

        it('successfully verifies an OTP', async () => {
            OTP.findOneAndUpdate.mockResolvedValue({});

            const otp = '123456';
            const user = 'testUser';

            const result = await verifyOtp(otp, user);

            expect(OTP.findOneAndUpdate).toHaveBeenCalledWith(
                { user, otpCode: otp, status: 'pending' },
                { $set: { lastUpdatedAt: expect.any(Date), status: 'verified' } },
                { upsert: false, new: true }
            );

            expect(result).toBe(true);
        });

        it('returns false if the OTP does not exist or cannot be verified', async () => {
            OTP.findOneAndUpdate.mockResolvedValue(null);

            const otp = 'nonexistent';
            const user = 'testUser';

            const result = await verifyOtp(otp, user);

            expect(result).toBe(false);
        });

        it('throws an error if the database operation fails', async () => {
            const error = new Error('Database error');
            OTP.findOneAndUpdate.mockRejectedValue(error);

            const otp = '123456';
            const user = 'testUser';

            await expect(verifyOtp(otp, user)).rejects.toThrow('Database error');
        });
    });




});
