var express = require('express');
const multer = require('multer');
const path = require('path');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// setup the multer for file uplaod
const storage = multer.diskStorage({
  // destination function
  destination: (req,file,cb)=>{
    cb(null,'uploads/'); 
    // passing the directory where the file to be stored
  },
  // filename function
  filename: (req,file,cb)=>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    // setting up the filename
  }
});

// creating a instance
const upload = new multer({storage:storage});


app.post('/api/fileanalyse' , upload.single('upfile'), (req,res)=> {
  
  if(!(req.file)) return res.json({error:'No file is uploaded'});
  return res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
