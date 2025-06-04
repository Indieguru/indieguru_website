// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config for images (profile pictures)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'png', 'jpeg', 'heic'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
    format: 'jpg' // Convert all images to jpg for consistency
  }
});

// Storage config for PDFs (certificates)
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'certificates',
    allowed_formats: ['pdf'],
    resource_type: 'raw' // Required for PDF uploads
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

export { cloudinary, imageStorage as storage, pdfStorage, blogImageStorage, blogDocumentStorage };
