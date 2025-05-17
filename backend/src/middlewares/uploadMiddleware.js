import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Configure storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the uploads directory
  },
  filename: (req, file, cb) => {
    // Generate unique filename using crypto
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);
      
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
  // Accept PDF files for certificates
  if (file.fieldname === 'certificate') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for certificates!'), false);
    }
  }
  // Accept PDF and image files for education documents
  else if (file.fieldname === 'documents') {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed for documents!'), false);
    }
  } else {
    cb(null, true);
  }
};

// Configure multer with our storage and file filter settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

export default upload;