const mongoose=require('mongoose')
const bcrypt=require('bcrypt');

//define the person schema

const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
personSchema.pre('save',async function(next){
    const person=this;
    //Hash the password only if it is modified
    if(!person.isModified('password')) return next();

    try {
        //hash the password generation
        const salt=await bcrypt.genSalt(10);

        // hash password generation
        const hashPassword=await bcrypt.hash(person.password,salt);

        //override the plain password with hashed password
        person.password=hashPassword;
        
        next();
    } 
    catch (error) {
        return next(error);
    }
})
personSchema.methods.comparePassword=async function(candidatePassword){
    try {
        //use bcrypt to compare the hashed password with the provided password
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    } 
    catch (error) {
       throw error; 
    }
}

//Create Person Model
const Person=mongoose.model('Person',personSchema);
module.exports=Person;

