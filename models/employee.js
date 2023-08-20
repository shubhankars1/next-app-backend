const mongoose=require('mongoose');

const employeeSchema=new mongoose.Schema({
    name:String,
    email: String,
    // email: { type: String, unique: true, required: 'email is missing.' },
    title:String,
    avatar:String,
    dept:String,
    position:String,
    status:String,
},{versionKey:false});

const Employee =new mongoose.model('Employee', employeeSchema,'empTable');

module.exports=Employee;