import { authenticate } from './auth.js';
import 'dotenv/config';

describe('Authentication Middleware', () => {
    const req = {
        headers: {
            'x-access-key-id': process.env.ACCESS_KEY_ID,
            'x-secret-access-key': process.env.SECRET_ACCESS_KEY
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    it('should call next if the keys are correct', () => {
        authenticate(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if the keys are incorrect', () => {
        req.headers['x-access-key-id'] = 'wrong_key';
        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
});
