const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const app = express();
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");


mongoose.connect('mongodb+srv://dpkaur1:avTD9Uxmnwj8btys@cluster0.apo3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
const salt = bcrypt.genSaltSync(10)
const secret = "344h5ghh6u45htj"
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.listen(4000);
app.post("/signup", async (req, res) => {
  console.log("dataBE"+JSON.stringify(req.body))
const { fullname, number, username,
  password } = req.body;

 
  try {
    const userDoc = await User.create({ fullname, number, username,
    password : bcrypt.hashSync( password,salt)})
    res.json(userDoc);
  }
  catch (e){
    console.log(e);
    res.status(400).json(e);
  }

});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


// app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
//   const {originalname,path} = req.file;
//   const parts = originalname.split('.');
//   const ext = parts[parts.length - 1];
//   const newPath = path+'.'+ext;
//   fs.renameSync(path, newPath);

//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, async (err,info) => {
//     if (err) throw err;
//     const {title,summary,content} = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover:newPath,
//       author:info.id,
//     });
//     res.json(postDoc);
//   });

// });

