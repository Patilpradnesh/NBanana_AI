const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.NANO_BANANA_API_KEY);

// Helper function for retrying Gemini API calls with better error handling
const callGeminiWithRetry = async (prompt, maxRetries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      return result.response.text();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If it's a 503 (overloaded) error and we have retries left
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (attempt < maxRetries) {
          console.log(`Retrying in ${delay}ms... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
          continue;
        } else {
          throw new Error('🤖 Gemini AI is temporarily overloaded. Please try again in a few minutes.');
        }
      }
      
      // For other errors, throw immediately
      throw new Error(`AI service error: ${error.message}`);
    }
  }
};

exports.chatWithNB = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    // Simple conversational prompt for clean responses
    const chatPrompt = `You are a helpful AI assistant. Respond naturally in a conversational way to: ${message}
    
Provide a clear, helpful response without any asterisks, markdown formatting, or special symbols. Use simple conversational language like you're talking to a friend.`;

    const response = await callGeminiWithRetry(chatPrompt);
    
    // Clean up any remaining formatting
    const cleanResponse = response
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .trim();
    
    res.json({ data: cleanResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: true,
      message: error.message,
      details: "The AI service is temporarily unavailable. Please try again in a moment."
    });
  }
}

exports.generateImage = async(req,res)=>{
  try {
    const userPrompt = req.body.prompt ||"generate the image of dog riding on scooter with remote control ";
    
    // Note: Free Gemini tier doesn't support image generation
    // Providing enhanced creative descriptions instead
    console.log('Generating creative image description for:', userPrompt);
    
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const enhancedPrompt = `Create a vivid, detailed, and creative description of this image concept: "${userPrompt}"
    
Describe it as if you're painting a picture with words. Include:
- Visual details and composition
- Colors, lighting, and atmosphere  
- Textures and materials
- Emotions and mood
- Artistic style suggestions

Make it so descriptive that someone could almost see the image just from your words. Use engaging, conversational language without any formatting symbols.`;
    
    const response = await fallbackModel.generateContent([enhancedPrompt]);
    const description = response.response.text();
        
    // Clean up formatting
    const cleanResponse = description
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1') 
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .trim();
    
    res.json({
      success: true,
      type: "image-description",
      data: `🎨 Here's a creative visualization of your idea:\n\n${cleanResponse}\n\n💡 Note: I'm currently providing detailed creative descriptions. For actual image generation, you would need access to paid AI image services like DALL-E, Midjourney, or Stable Diffusion.`,
      message: "Creative image description generated!",
      prompt: userPrompt,
      note: "Enhanced description - actual image generation requires paid services"
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: true,
      message: error.message,
      details: "Image generation temporarily unavailable"
    });
  }
};


exports.generateAnimation =async(req,res)=>{
  try {
    const userPrompt =req.body.prompt || "generate random animation of shavlean samurai with katana blead ";
    
    // Create animation concept in conversational style
    const animationPrompt = `Help me create an animation concept for: "${userPrompt}"

Describe this animation in a friendly, conversational way. Include:
- What the animation would look like
- How characters would move and interact
- The overall style and mood
- Duration and key scenes

Talk about it like you're explaining an exciting animation idea to a friend. Keep it simple and engaging without any special formatting.`;
    
    const response = await callGeminiWithRetry(animationPrompt);
    
    // Clean up formatting
    const cleanResponse = response
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .trim();
    
    res.json({
      success:true,
      type:"animation",
      data:cleanResponse
    });
      
  } catch (error) {
      res.status(500).json({
        error: true,
        message: error.message,
        details: "Animation generation temporarily unavailable"
      });
  }
};

// 1st one 

exports.generateCartoonStory = async( req,res)=>{
  try {
    const storyText = req.body.storyText || " give the valid prompt";
    
    // Create cartoon story in conversational style
    const cartoonPrompt = `Help me create a fun cartoon story about: "${storyText}"

Tell me this story in a friendly, engaging way like you're sharing it with friends. Include:
- Interesting characters and what they're like
- What happens in the story
- Fun dialogue and interactions
- A satisfying ending

Make it entertaining and easy to follow. Just tell the story naturally without any special formatting or symbols.`;

    const response = await callGeminiWithRetry(cartoonPrompt);
    
    // Clean up formatting
    const cleanResponse = response
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .trim();

    res.json({
      success:true,
      type:"Cartoon-story",
      feature:"Cartoon studio",
      data:cleanResponse
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      details: "Cartoon generation temporarily unavailable"
    });
  }
};


// 2nd 
exports.generateAd =async(req,res)=>{
  try{
    const brandName =req.body.brand;
    const productType = req.body.product;
    
    // Create advertisement in conversational style
    const adPrompt = `Help me create a marketing campaign for: ${productType || 'this product'} ${brandName ? 'from ' + brandName : ''}

Create an engaging advertisement that includes:
- A catchy headline that grabs attention
- Key benefits and features
- Who this product is perfect for
- A strong call-to-action

Write it in a conversational, persuasive style like you're explaining why someone should try this product. Keep it natural and engaging without any special formatting.`;

    const response = await callGeminiWithRetry(adPrompt);
    
    // Clean up formatting
    const cleanResponse = response
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .trim();

    res.json({
      success:true,
      type:"advertisement",
      feature:"Ad Maker AI",
      data:cleanResponse
    });

  } catch(error){
    res.status(500).json({
      error: true,
      message: error.message,
      details: "Advertisement generation temporarily unavailable"
    });
  }
};


// 3rd - Enhanced Photo Transformation with Image Generation
exports.transformPhoto = async (req, res) => {
  try {
    const photoDescription = req.body.description || "Transform this photo";
    const timeEra = req.body.era || "Victorian era";
    const style = req.body.style || "vintage";
    
    // Check if image file was uploaded
    if (req.file) {
      // First, analyze the uploaded image with Gemini Vision
      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString('base64');
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      };
      
      // Analyze the image to create a detailed prompt for image generation
      const analysisPrompt = `You are a photo analysis and transformation AI. Analyze this image and create a detailed description for transforming it based on: "${photoDescription}" in ${timeEra} style with ${style} characteristics.

Provide a comprehensive analysis that includes:
- Detailed description of current image elements
- How to transform clothing and appearance for the era
- Background and setting modifications needed
- Lighting and mood adjustments for authenticity
- Color palette appropriate for the time period
- Artistic style techniques for ${style} appearance

Focus specifically on photo transformation and historical accuracy. If the user requests variations or modifications, build upon previous transformation concepts in our conversation.

Format as a detailed transformation description.`;
      
      const analysisResult = await model.generateContent([analysisPrompt, imagePart]);
      const detailedPrompt = analysisResult.response.text();
      
      // Clean up the analysis response
      const cleanPrompt = detailedPrompt
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/###/g, '')
        .replace(/##/g, '')
        .trim();

      // Note: Free Gemini tier doesn't support image generation
      // Providing detailed transformation analysis instead
      console.log('Creating detailed transformation analysis for Time Travel Camera');
      
      const transformPrompt = `Based on the uploaded image, create a comprehensive transformation guide for ${timeEra} ${style} style:

${cleanPrompt}

Now provide specific instructions for how this transformation would be achieved:

1. CLOTHING & FASHION:
- What period-appropriate clothing would replace current items
- Specific garments, accessories, and styling for ${timeEra}
- Color palette and fabric choices authentic to the era

2. HAIRSTYLE & MAKEUP:
- Period-appropriate hairstyling for ${timeEra}
- Makeup trends and techniques of that time
- Facial hair styles if applicable

3. BACKGROUND & SETTING:
- Environment that matches ${timeEra}
- Architecture, furniture, and decorative elements
- Lighting style typical of the period

4. ARTISTIC STYLE:
- ${style} characteristics and techniques
- Color grading and visual effects
- Overall aesthetic approach

Make this transformation guide detailed and practical, as if someone could use it to recreate the look.`;
      
      const transformModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const transformResult = await transformModel.generateContent([transformPrompt]);
      const transformGuide = transformResult.response.text();
      
      // Clean up formatting
      const cleanGuide = transformGuide
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
        .trim();
      
      res.json({
        success: true,
        type: "photo-transform",
        feature: "Time Travel Camera", 
        data: `📸 Based on your uploaded photo, here's your detailed ${timeEra} ${style} transformation guide:\n\n${cleanGuide}\n\n💡 Note: I can provide expert transformation analysis and detailed guides. For actual photo editing, you would need image editing software or paid AI transformation services.`,
        originalAnalysis: cleanPrompt,
        transformationGuide: cleanGuide,
        targetEra: timeEra,
        targetStyle: style,
        note: "Professional transformation analysis completed"
      });
      
    } else {
      // Fallback to text-only mode if no image uploaded
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const textPrompt = `Help me transform a photo with this description: "${photoDescription}"

Transform it into ${timeEra} style with ${style} characteristics.

Describe how this transformation would look in a friendly, conversational way. Talk about:
- How the clothing and appearance would change
- What the background and setting would look like  
- The colors and lighting of that time period
- The overall mood and feel

Explain it like you're helping someone visualize their photo in a different time period. Keep it simple and engaging without any special formatting.`;

      const result = await callGeminiWithRetry(textPrompt);
      let response = result;
      
      // Clean up the response
      response = response
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold asterisks
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic asterisks
        .replace(/###/g, '')             // Remove heading markers
        .replace(/##/g, '')              // Remove heading markers
        .trim();
      
      res.json({
        success: true,
        type: "photo-transform",
        feature: "Time Travel Camera",
        data: response,
        note: "Text-only transformation (no image uploaded)"
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing photo transformation",
      details: error.message
    });
  }
};