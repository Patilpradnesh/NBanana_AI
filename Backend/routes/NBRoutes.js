const express = require('express');
const router=express.Router();
const NBController =require('../controllers/NBController');


router.post('/generate-image',NBController.generateImage);
router.post('/generate-animation',NBController.generateAnimation);
router.post('/cartoon-story',NBController.generateCartoonStory);
router.post('/generate-ad',NBController.generateAd);
router.post('/transform-photo',NBController.transformPhoto);



module.exports =router;