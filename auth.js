import 'dotenv/config';

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

export function authenticate(req, res, next) {
    const accessKeyId = req.headers['x-access-key-id'];
    const secretAccessKey = req.headers['x-secret-access-key'];

    if (accessKeyId === ACCESS_KEY_ID && secretAccessKey === SECRET_ACCESS_KEY) {
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
}
