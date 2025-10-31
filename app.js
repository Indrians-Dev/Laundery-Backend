const express = require('express')
// var expressLayouts = require('express-ejs-layouts');
const app = express()
const port = 3000

// app.use(expressLayouts);

app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

app.get('/data',(req,res)=>{
    res.json({
        nama:"indrianssyah",
        nohp:'0867484848'
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})