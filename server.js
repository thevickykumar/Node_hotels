const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const passport=require('./auth')



const bodyParser = require('body-parser');
app.use(bodyParser.json()) // req.body
const PORT= process.env.PORT || 3000;

//Middleware function
const logRequest=(req,res,next) =>{
  console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
  next(); //Move to next phase
}
app.use(logRequest);

  
app.use(passport.initialize());
const localAuthMiddleware=passport.authenticate('local',{session:false})

app.get('/',function(req, res) {
  res.send('Welcome to Our Hotel... ');

});

//import the person routes
const personRoutes=require('./routes/personRoutes');
//import the menu routes
const menuItemRoutes=require('./routes/menuItemRoutes');

//Use the routes
app.use('/person',localAuthMiddleware,personRoutes);
app.use('/menu',menuItemRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on 3000`);
});
