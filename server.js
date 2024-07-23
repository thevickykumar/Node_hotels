const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();


const bodyParser = require('body-parser');
app.use(bodyParser.json()) // req.body
const PORT= process.env.PORT || 3000;


//import the person routes
const personRoutes=require('./routes/personRoutes');
//import the menu routes
const menuItemRoutes=require('./routes/menuItemRoutes');

//Use the routes
app.use('/person',personRoutes);
app.use('/menu',menuItemRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Our Hotel... ');

});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on 3000`);
});
