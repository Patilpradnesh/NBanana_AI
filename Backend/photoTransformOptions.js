
// PHOTO TRANSFORMATION SOLUTIONS
// ==================================

// OPTION 1: OpenAI DALL-E Integration
// ------------------------------------
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.transformPhotoWithDALLE = async (req, res) => {
  try {
    const { description, era, style } = req.body;
    
    if (req.file) {
      // First analyze with Gemini, then generate with DALL-E
      const analysisModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      };
      
      const analysisPrompt = `Analyze this image and create a detailed prompt for DALL-E to generate a ${era} ${style} transformation. Be specific about people, poses, clothing, and background.`;
      
      const analysis = await analysisModel.generateContent([analysisPrompt, imagePart]);
      const imagePrompt = analysis.response.text();
      
      // Generate new image with DALL-E
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Transform into ${era} ${style}: ${imagePrompt}`,
        size: "1024x1024",
        quality: "hd",
        n: 1,
      });
      
      res.json({
        success: true,
        transformedImageUrl: imageResponse.data[0].url,
        originalAnalysis: imagePrompt,
        era: era,
        style: style
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OPTION 2: Stability AI Integration  
// ----------------------------------
const stabilityApi = axios.create({
  baseURL: 'https://api.stability.ai',
  headers: {
    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

exports.transformPhotoWithStability = async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('init_image', req.file.buffer, { filename: 'image.jpg' });
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', 0.35);
    formData.append('steps', 40);
    formData.append('seed', 0);
    formData.append('cfg_scale', 5);
    formData.append('samples', 1);
    formData.append('text_prompts[0][text]', `${req.body.era} ${req.body.style} transformation, high quality, detailed`);
    formData.append('text_prompts[0][weight]', 1);

    const response = await stabilityApi.post('/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', formData);
    
    const base64Image = response.data.artifacts[0].base64;
    
    res.json({
      success: true,
      transformedImage: `data:image/png;base64,${base64Image}`,
      era: req.body.era,
      style: req.body.style
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OPTION 3: Replicate API Integration
// -----------------------------------
const Replicate = require('replicate');
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

exports.transformPhotoWithReplicate = async (req, res) => {
  try {
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const output = await replicate.run(
      "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      {
        input: {
          input_image: imageBase64,
          prompt: `A ${req.body.style} style portrait in ${req.body.era}, high quality, detailed`,
          num_steps: 50,
          style_strength_ratio: 20,
          num_outputs: 1
        }
      }
    );

    res.json({
      success: true,
      transformedImageUrl: output[0],
      era: req.body.era,
      style: req.body.style
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OPTION 4: Free Alternative with Canvas Manipulation
// ---------------------------------------------------
const sharp = require('sharp');

exports.transformPhotoWithEffects = async (req, res) => {
  try {
    let processedImage = sharp(req.file.buffer);
    
    // Apply era-specific filters
    switch(req.body.era.toLowerCase()) {
      case 'victorian':
      case 'vintage':
        processedImage = processedImage
          .modulate({ brightness: 0.9, saturation: 0.7 })
          .tint({ r: 255, g: 248, b: 220 }); // Sepia tone
        break;
      case 'medieval':
        processedImage = processedImage
          .modulate({ brightness: 0.8, saturation: 0.6 })
          .gamma(1.2);
        break;
      case '1920s':
        processedImage = processedImage
          .greyscale()
          .modulate({ brightness: 1.1, contrast: 1.2 });
        break;
    }
    
    const outputBuffer = await processedImage.jpeg({ quality: 90 }).toBuffer();
    const base64Image = outputBuffer.toString('base64');
    
    // Also generate description with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([`Describe how this image looks transformed into ${req.body.era} ${req.body.style} style`]);
    
    res.json({
      success: true,
      transformedImage: `data:image/jpeg;base64,${base64Image}`,
      description: result.response.text(),
      era: req.body.era,
      style: req.body.style,
      note: "Basic filter transformation applied"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  transformPhotoWithDALLE,
  transformPhotoWithStability, 
  transformPhotoWithReplicate,
  transformPhotoWithEffects
};