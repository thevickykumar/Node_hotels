const mongoose=require('mongoose');
require('dotenv').config();

//define the MongoDb connection Url
//const mongoURL=process.env.MONGODB_URL_LOCAL
const mongoURL=process.env.MONGODB_URL;

//set up MongoDB Connection
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    UseUnifiedTopology:true
})
// mongoose.connect(mongoURL, {
//     tls: true, // Ensure TLS/SSL is enabled
//   })
//     .then(() => console.log("Connected to MongoDB server"))
//     .catch((err) => console.log("MongoDB connection error", err));

const db=mongoose.connection;

//define event listeners for database connection
db.on('connected',() =>{
    console.log("connected to MongoDB server")
});

db.on('error',(err) =>{
    console.log("MongoDB connection error",err)
});

db.on('disconnected',() =>{
    console.log("MongoDB Disconnected")
});

module.exports=db;