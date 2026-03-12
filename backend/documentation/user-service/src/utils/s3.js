const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Folder path in S3
 * @param {string} filename - Original filename
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - Public URL of uploaded file
 */
async function uploadToS3(fileBuffer, folder, filename, mimetype) {
  const key = `${folder}/${uuidv4()}-${filename}`;
  const bucket = process.env.AWS_S3_BUCKET;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: 'public-read',
  });

  try {
    await s3Client.send(command);
    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    logger.info(`File uploaded to S3: ${url}`);
    return url;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
}

module.exports = { uploadToS3 };
