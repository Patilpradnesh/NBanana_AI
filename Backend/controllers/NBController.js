const {GoogleGenAI} =require('@google/genai');

const genAI = new GoogleGenAI({
  apiKey :process.env.NANO_BANANA_API_KEY
});


exports.generateImage = async(req,res)=>{
  try {
    const userPrompt = req.body.prompt ||"generate the image of dog riding on scooter with remote control ";
    const response =await genAI.models.generateContent({
      model:"gemini-1.5-flash-latest",
      contents:[{
        role:"user",
        parts:[{text:userPrompt}]
      }]
    })
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
  const response =await genAI.models.generateContent({
    model:"gemini-1.5-flash-latest",
    contents:[{
      role:"user",
      parts:[{ text:`Create an animation  sequence: ${userPrompt}, make it dynamic with motion movement` }]
    }]
  });
  res.json({
    success:true,
    type:"animation",
    body:response
  });
    
  } catch (error) {
      res.status(500).json({msg:"error Appears in backside",details:error.message});
  }

}

// 1st one 

exports.generateCartoonStory = async( req,res)=>{
  try {
    
    const storyText = req.body.storyText || " give the valid prompt";
  
  const response =await genAI.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents:[{
      role:'user',
      parts:[{
        text : `Create a comic strip from  this story : ${storyText}.  Generate consistent cartoon characters  and multiple scenes.`}]
    }]
  });

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

    const response = await genAI.models.generateContent({
      model:"gemini-1.5-flash-latest",
      contents:[{
        role:'user',
        parts:[{ text: `Create a creative advertisement for ${brandName} ${productType}. Make it eye-catching with cartoon style and marketing appeal.` }]
      }]
    });

    res.json({
      success:true,
      type:"advertisement",
      feature:"Ad Maker AI",
      data:response
    });

  } catch(error){
    res.status(500).json({mes:"AD related error appears",details:error.message});
  }
}


// 3 rd 
exports.transformPhoto = async (req,res )=>{
  try {
    const photoDescription =req.body.description ;
    const timeEra = req.body.era;
    const style = req.body.style;
    const response  = await genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents:[{
        role:"user",
        parts:[{text:`transform ${photoDescription} into ${timeEra} style with ${style} art. show them  as  if they  lived in that  era  with  appropriate clothings and background with  every  small details  of that  era . `}]
      }]
    })
    res.json({
      success:true,
      type:"photo-transform",
      feature:"time travel Camera",
      data: response
    });
    
  } catch (error) {
    res.status(500).json({mes:"error appears ",details:error.message});
  }
}