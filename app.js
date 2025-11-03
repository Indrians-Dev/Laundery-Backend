
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authController = require('./controllers/auth-controller');
const app = express();
const port = process.env.PORT || 8000;




//body parser
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.get('/',(req,res)=>{
   res.send('Admin Homepage')
})

app.use('/auth', authController);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})