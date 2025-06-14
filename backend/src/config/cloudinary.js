// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing in environment variables');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Verify Cloudinary configuration immediately
try {
    cloudinary.api.ping().then(() => {
        console.log('Cloudinary configuration is valid');
    }).catch((error) => {
        console.error('Cloudinary configuration error:', error);
        throw error;
    });
} catch (error) {
    console.error('Failed to initialize Cloudinary:', error);
    throw error;
}

// Storage config for session files
const sessionFileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
      folder: 'session_files',
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'txt'],
      public_id: file.originalname.split('.')[0], // optional for readable names
  })
});

// Storage config for images (profile pictures)
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile_pictures',
        allowed_formats: ['jpg', 'png', 'jpeg', 'heic'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
        format: 'jpg'
    }
});

// Storage config for PDFs (certificates)
const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'certificates',
        allowed_formats: ['pdf'],
        resource_type: 'raw'
    }
});

// Storage config for blog images
const blogImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        format: 'jpg'
    }
});

// Storage config for blog documents
const blogDocumentStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog_documents',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw'
    }
});

export { cloudinary, imageStorage as storage, pdfStorage, blogImageStorage, blogDocumentStorage, sessionFileStorage };
