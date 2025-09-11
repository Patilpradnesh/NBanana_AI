require('dotenv').config();
const express =require('express');
const axios = require('axios');
const cors = require('cors');

const app= express();

app.use(cors());
app.use(express.json())

const NBRoutes=require('./routes/NBRoutes');
app.use('/api',NBRoutes);

app.get('/',(req,res)=>{
    res.send('NANO BANANA BACKEND')
})

const port = process.env.PORT|| 5000;
app.listen(port,()=>console.log(`server is running on port ${port}`))