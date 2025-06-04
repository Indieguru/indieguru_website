// middleware/upload.js
import multer from 'multer';
import { storage, blogImageStorage } from '../config/cloudinary.js';

// Create the multer instance with Cloudinary storage for profile images
const uploadConfig = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.originalname.toLowerCase().endsWith('.heic')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Configure certificate upload
const certificateUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for PDFs
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for certificates'), false);
    }
  }
});

// Create multer instance for blog uploads
const blogUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/tmp');  // Use temporary directory for file uploads
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // Handle image uploads
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
    }
  }
}).fields([
  { name: 'images', maxCount: 3 }
]);

// Middleware for blog uploads
const handleBlogUpload = (req, res, next) => {
  blogUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Unknown error occurred during file upload',
        error: err.stack
      });
    }
    next();
  });
};

export default {
  single: multer({ storage }).single.bind(multer({ storage })),
  array: multer({ storage }).array.bind(multer({ storage })),
  fields: multer({ storage }).fields.bind(multer({ storage })),
  blog: handleBlogUpload,
  certificate: certificateUpload.single.bind(certificateUpload)
};