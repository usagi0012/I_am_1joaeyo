import AWS from 'aws-sdk';
import multer from 'multer';
import dotdenv from 'dotenv';
dotdenv.config();

const storage = multer.memoryStorage();
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const upload = multer({
    storage,
    filefilter,
});

export const s3 = new AWS.S3({
    region: process.env.REGION_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
