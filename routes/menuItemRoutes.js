const express=require('express')
const router=express.Router();
const MenuItem = require('../models/MenuItem');

//post route to add a Menu
router.post('/', async (req, res) => {
  try {
    const data = req.body

    const newMenuItem = new MenuItem(data);

    const response = await newMenuItem.save();
    console.log('data saved');
    res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/', async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log('data fetched');
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/:tasteType',async(req,res)=>{
  try{
    const tasteType = req.params.tasteType; //Extract the workType from the url parameter
    if (tasteType == 'sour' || tasteType == 'sweet' || tasteType == 'spicy') {
      const response = await MenuItem.find({ taste: tasteType });
      console.log('response  fetched');
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Invalid taste type' });
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
    const menuId=req.params.id; //extract the id from url parameter
    const updateMenuData=req.body; // update data for the person

    const response=await MenuItem.findByIdAndUpdate(menuId,updateMenuData,{
      new:true,  // return the updated document
      runValidators:true //run mongoose validators
    })
    if(!response){
      res.status(404).json({ error: 'Menu not found' });
    }
    console.log('data updated');
    res.status(200).json(response);
  }
   catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
//delete
router.delete('/:id',async(req,res)=>{
  try {
    const menuId=req.params.id; // extract the id from url parameter

    //Assuming you have a person model
    const response=await MenuItem.findByIdAndDelete(menuId);
    if(!response){
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    console.log('Data Deleted')
    res.json({ message: 'Menuitem deleted successfully' });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports=router;