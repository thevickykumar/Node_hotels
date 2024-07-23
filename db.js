const mongoose=require('mongoose');

//define the MongoDb connection Url
const mongoURL='mongodb://127.0.0.1:27017/hotels'

//set up MongoDB Connection
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    UseUnifiedTopology:true
})

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