const express = require('express');
const multer = require('multer');
const router=express.Router();
const NBController =require('../controllers/NBController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/chat',NBController.chatWithNB);
router.post('/generate-image',NBController.generateImage);
router.post('/generate-animation',NBController.generateAnimation);
router.post('/cartoon-story',NBController.generateCartoonStory);
router.post('/generate-ad',NBController.generateAd);
router.post('/transform-photo', upload.single('image'), NBController.transformPhoto);



module.exports =router;