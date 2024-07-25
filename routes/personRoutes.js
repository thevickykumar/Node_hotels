const express=require('express')
const router=express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware,generateToken}=require('./../jwt')

//post route to add a person
router.post('/signup', async (req, res) => {
  try {
    const data = req.body // Assuming the request contains the person data

    // create a new Person document using the Mongoose Model
    const newPerson = new Person(data);

    //save the new person to database
    const response = await newPerson.save();
    console.log('data saved');

    const payload={
      id:response.id,
      username:response.username
    }
    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("Token is : ",token)

    res.status(200).json({response:response,token:token});
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})
// Login Route
router.post('/login', async(req, res) => {
  try{
      // Extract username and password from request body
      const {username, password} = req.body;

      // Find the user by username
      const user = await Person.findOne({username: username});

      // If user does not exist or password does not match, return error
      if( !user || !(await user.comparePassword(password))){
          return res.status(401).json({error: 'Invalid username or password'});
      }

      // generate Token 
      const payload = {
          id: user.id,
          username: user.username
      }
      const token = generateToken(payload);

      // return token as response
      res.json({token})
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
      const userData = req.user;
      console.log("User Data: ", userData);

      const userId = userData.id;
      const user = await Person.findById(userId);

      res.status(200).json({user});
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

//get method to fetch the person
router.get('/',jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find();
    console.log('data fetched');
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//workType
router.get('/:workType', async (req, res) => {
    try {
      const workType = req.params.workType; //Extract the workType from the url parameter
      if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
        const response = await Person.find({ work: workType });
        console.log('response  fetched');
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: 'Invalid work type' });
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  //update
  router.put('/:id',async(req,res)=>{
    try {
      const personId=req.params.id; //extract the id from url parameter
      const updatePersonData=req.body; // update data for the person

      const response=await Person.findByIdAndUpdate(personId,updatePersonData,{
        new:true,  // return the updated document
        runValidators:true //run mongoose validators
      })
      if(!response){
        res.status(404).json({ error: 'Person not found' });
      }
      console.log('data updated');
      res.status(200).json(response);
    }
     catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  // delete
  router.delete('/:id',async(req,res)=>{
    try {
      const personId=req.params.id; // extract the id from url parameter

      //Assuming you have a person model
      const response=await Person.findByIdAndDelete(personId);
      if(!response){
        return res.status(404).json({ error: 'Person not found' });
      }
      console.log('Data Deleted')
      res.json({ message: 'Person deleted successfully' });
    } 
    catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  module.exports=router;
