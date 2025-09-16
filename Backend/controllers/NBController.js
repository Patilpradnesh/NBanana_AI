const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.NANO_BANANA_API_KEY);

exports.chatWithNB = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([message]);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mes: "not possible now", details: error.message });
  }
}

exports.generateImage = async(req,res)=>{
  try {
    const userPrompt = req.body.prompt ||"generate the image of dog riding on scooter with remote control ";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([userPrompt]);
    const response = result.response.text();
   
    res.json({
      success:true,
      body:response
    });
    
  } catch (error) {
    res.status(500).json({msg:"error Appears in backside",details:error.message});
  }


};

exports.generateAnimation =async(req,res)=>{
  try {
    const userPrompt =req.body.prompt || "generate random animation of shavlean samurai with katana blead ";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([`Create an animation sequence: ${userPrompt}, make it dynamic with motion movement`]);
    const response = result.response.text();
    res.json({
      success:true,
      type:"animation",
      body:response
    });
      
  } catch (error) {
      res.status(500).json({msg:"error Appears in backside",details:error.message});
  }
};

// 1st one 

exports.generateCartoonStory = async( req,res)=>{
  try {
    
    const storyText = req.body.storyText || " give the valid prompt";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([`Create a comic strip from this story: ${storyText}. Generate consistent cartoon characters and multiple scenes.`]);
    const response = result.response.text();

  res.json({
    success:true,
    type:"Cartoon-story",
    feature:"Cartoon studio",
    body:response
  })
  } catch (error) {
    res.status(500).json({mes:"error appears",details:error.message});
  }
};


// 2nd 
exports.generateAd =async(req,res)=>{
  try{

    const brandName =req.body.brand;
    const productType = req.body.product;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([`Create a creative advertisement for ${brandName} ${productType}. Make it eye-catching with cartoon style and marketing appeal.`]);
    const response = result.response.text();

    res.json({
      success:true,
      type:"advertisement",
      feature:"Ad Maker AI",
      data:response
    });

  } catch(error){
    res.status(500).json({mes:"AD related error appears",details:error.message});
  }
};


// 3 rd 
exports.transformPhoto = async (req, res) => {
  try {
    const photoDescription = req.body.description || "Transform this photo";
    const timeEra = req.body.era || "Victorian era";
    const style = req.body.style || "vintage";
    
    // Check if image file was uploaded
    if (req.file) {
      // Convert uploaded image to base64 for Gemini Vision
      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString('base64');
      
      const model = genAI.getGenerativeModel({ model: "imagen-4.0-generate-001" });
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      };
      
      const prompt = `Analyze this image and describe how to transform it into ${timeEra} style with ${style} characteristics. ${photoDescription}. Provide detailed description of the transformation including clothing, background, lighting, and artistic style that would make it look authentic to that era.`;
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response.text();
      
      res.json({
        success: true,
        type: "photo-transform",
        feature: "Time Travel Camera",
        data: response,
        originalDescription: photoDescription,
        targetEra: timeEra,
        targetStyle: style
      });
    } else {
      // Fallback to text-only mode if no image uploaded
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([`Transform ${photoDescription} into ${timeEra} style with ${style} art. Show them as if they lived in that era with appropriate clothing and background with every small detail of that era.`]);
      const response = result.response.text();
      
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