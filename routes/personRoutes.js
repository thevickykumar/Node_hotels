const express=require('express')
const router=express.Router();
const Person = require('../models/Person');

//post route to add a person
router.post('/', async (req, res) => {
  try {
    const data = req.body // Assuming the request contains the person data

    // create a new Person document using the Mongoose Model
    const newPerson = new Person(data);

    //save the new person to database
    const response = await newPerson.save();
    console.log('data saved');
    res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})
//get method to fetch the person
router.get('/', async (req, res) => {
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
