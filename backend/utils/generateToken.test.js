import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from './generateToken';

jest.mock('jsonwebtoken');

describe('generateTokenAndSetCookie', () => {
    let res;

    beforeEach(() => {
        res = {
            cookie: jest.fn()
        };
    });

    it('should generate a token and set it as a cookie', () => {
        const userID = '12345';
        const token = 'mockedToken';
        jwt.sign.mockReturnValue(token);

        const result = generateTokenAndSetCookie(userID, res);

        expect(jwt.sign).toHaveBeenCalledWith({ userID }, process.env.JWT_SECRET, { expiresIn: '15d' });
        expect(res.cookie).toHaveBeenCalledWith('jwt', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'
        });
        expect(result).toBe(token);
    });

    it('should set the cookie with secure flag based on environment', () => {
        const userID = '12345';
        const token = 'mockedToken';
        jwt.sign.mockReturnValue(token);

        process.env.NODE_ENV = 'production';
        generateTokenAndSetCookie(userID, res);
        expect(res.cookie).toHaveBeenCalledWith('jwt', token, expect.objectContaining({ secure: true }));

        process.env.NODE_ENV = 'development';
        generateTokenAndSetCookie(userID, res);
        expect(res.cookie).toHaveBeenCalledWith('jwt', token, expect.objectContaining({ secure: false }));
    });
});