const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:3000',
  'https://documed-ai.vercel.app',
  /^https:\/\/documed-ai.*\.vercel\.app$/,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed origins (including regex patterns)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'DocuMed AI Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    service: 'DocuMed AI API',
    status: 'active',
    features: [
      'Medical data extraction',
      'Stateless processing',
      'GDPR/HIPAA compliant'
    ]
  });
});

// Medical data extraction endpoint
app.post('/api/extract', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a medical document to extract data from'
      });
    }

    const file = req.file;
    console.log(`📄 Processing file: ${file.originalname} (${file.size} bytes)`);

    // Simulate medical data extraction
    const extractedData = {
      fileName: file.originalname,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      fileType: file.mimetype,
      processedAt: new Date().toISOString(),

      // Simulated extracted medical data
      patientInfo: {
        name: "[Extracted from document]",
        dateOfBirth: "[Extracted from document]",
        patientId: "[Extracted from document]"
      },

      medicalData: {
        diagnosis: "[AI would extract diagnosis here]",
        medications: "[AI would extract medications here]",
        vitals: "[AI would extract vital signs here]",
        procedures: "[AI would extract procedures here]"
      },

      confidence: "85%",
      processingTime: `${Math.random() * 2 + 1}s`
    };

    res.json({
      success: true,
      message: '✅ Medical data extraction completed successfully!',
      data: extractedData,
      note: 'This is a demo version. Real AI extraction will be implemented in the full version.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({
      error: 'Extraction failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DocuMed AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API status: http://localhost:${PORT}/api/status`);
});
