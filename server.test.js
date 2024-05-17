import request from 'supertest';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { initJackal, createBucket, uploadFile, downloadFile, listFiles, deleteFile } from './storage.js';
import { authenticate } from './auth.js';
import 'dotenv/config';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let wallet;

app.use(express.json());
app.use(authenticate);

// Initialize wallet
beforeAll(async () => {
    wallet = await initJackal();
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

// List buckets
app.get('/', async (req, res) => {
    try {
        const buckets = await listFiles(wallet, '');
        res.status(200).json({ Buckets: buckets });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create bucket
app.put('/:bucket', async (req, res) => {
    const { bucket } = req.params;
    try {
        await createBucket(wallet, bucket);
        res.status(200).send('Bucket created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// List objects in bucket
app.get('/:bucket', async (req, res) => {
    const { bucket } = req.params;
    try {
        const files = await listFiles(wallet, bucket);
        res.status(200).json({ Contents: files });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Upload file
app.put('/:bucket/:key', upload.single('file'), async (req, res) => {
    const { bucket, key } = req.params;
    const fileBuffer = req.file.buffer;
    try {
        await uploadFile(wallet, bucket, fileBuffer, key);
        res.status(200).send('File uploaded');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Download file
app.get('/:bucket/:key', async (req, res) => {
    const { bucket, key } = req.params;
    try {
        const fileBuffer = await downloadFile(wallet, bucket, key);
        res.setHeader('Content-Disposition', `attachment; filename=${key}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(fileBuffer);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete file
app.delete('/:bucket/:key', async (req, res) => {
    const { bucket, key } = req.params;
    try {
        await deleteFile(wallet, bucket, key); // Implement this function similar to uploadFile and downloadFile
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

describe('Server Endpoints', () => {
    it('should list buckets', async () => {
        const response = await request(app)
            .get('/')
            .set('x-access-key-id', process.env.ACCESS_KEY_ID)
            .set('x-secret-access-key', process.env.SECRET_ACCESS_KEY);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('Buckets');
    });

    it('should create a bucket', async () => {
        const response = await request(app)
            .put('/test-bucket')
            .set('x-access-key-id', process.env.ACCESS_KEY_ID)
            .set('x-secret-access-key', process.env.SECRET_ACCESS_KEY);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Bucket created');
    });

    it('should upload a file to a bucket', async () => {
        const response = await request(app)
            .put('/test-bucket/test-file')
            .set('x-access-key-id', process.env.ACCESS_KEY_ID)
            .set('x-secret-access-key', process.env.SECRET_ACCESS_KEY)
            .attach('file', Buffer.from('Test file content'), 'test-file.txt');
        expect(response.status).toBe(200);
        expect(response.text).toBe('File uploaded');
    });

    it('should download a file from a bucket', async () => {
        const response = await request(app)
            .get('/test-bucket/test-file')
            .set('x-access-key-id', process.env.ACCESS_KEY_ID)
            .set('x-secret-access-key', process.env.SECRET_ACCESS_KEY);
        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toBe('attachment; filename=test-file');
        expect(response.text).toBe('Test file content');
    });

    it('should delete a file from a bucket', async () => {
        const response = await request(app)
            .delete('/test-bucket/test-file')
            .set('x-access-key-id', process.env.ACCESS_KEY_ID)
            .set('x-secret-access-key', process.env.SECRET_ACCESS_KEY);
        expect(response.status).toBe(204);
    });
});
