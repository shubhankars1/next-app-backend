const express = require('express');
let router = express.Router();

const mongoose = require('mongoose');

const Employee = require('../models/employee');

const User = require('../models/user');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const avatarInitials = require('avatar-initials');
const multer  = require('multer');
// Set up multer storage for avatar uploads
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
const upload = multer({ storage });

let date = new Date();

// ==============================>

// ############################# Database Connection start here ######################################
mongoose.connect("mongodb://0.0.0.0:27017/nextDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("mongoDb Connected");
}).catch((err)=>{
    console.log(err);
})
// ############################# Database Connection end here ######################################


// ############################# Employee API start here ######################################
// CREATE ---------------------------------------------------------------------->
router.post('/addEmployee', upload.single('avatar'), (req,res)=>{
    let employeeModel = new Employee();

    employeeModel.name = req.body.name;
    employeeModel.email = req.body.email;
    employeeModel.title = req.body.title;
    employeeModel.avatar = `http://localhost:3001/public/uploads/` + req.file.filename;
    employeeModel.dept = req.body.dept;
    employeeModel.position = req.body.position;
    employeeModel.status = req.body.status;

    employeeModel.save().then(()=>{
        res.status(202).json({
            success: true, 
            message:'1 Employee added Successfully'
        })
    }).catch((err)=>{
        res.status(404).json({
            success: false, 
            message:err
        })
    });
});
// CREATE end here ---------------------------------------------------------------------->


// READ ---------------------------------------------------------------------->
router.get('/getAllEmployee', (req,res)=>{
    Employee.find({}).then((data)=>{
        res.status(202).json({
            success: true,
            data:data
        })
    }).catch((err)=>{
        res.status(404).json({
            success: false, 
            message:err
        })
    })
})

 // for get Product by ID GET API
 router.get('/getEmployeeById/:id', (req,res)=>{
    Employee.findById(req.params.id).exec().then((data)=>{
        res.status(202).json({
            success: true, 
            data:data
        })
    }).catch((err)=>{
        res.status(404).json({message:err})
    })
})
// READ end here ---------------------------------------------------------------------->


// UPDATE ---------------------------------------------------------------------->
router.put('/updateEmployeeById', upload.single('avatar'), (req,res)=>{

    Employee.findByIdAndUpdate(req.body.id,{
         $set:{
           name : req.body.name,
           email : req.body.email,
           title : req.body.title,
           avatar : `http://localhost:3001/public/uploads/` + req.file.filename,
           dept : req.body.dept,
           position : req.body.position,
           status : req.body.status
         }
     }).then((data)=>{
        res.status(202).json({
            success: true,
            message:'1 record is updated successfuly'
        })
     }).catch((err)=>{
         res.status(404).json({
            success: false,
            message:err
        })
     });
 });

// PATCH request
// update only required data
router.patch('/patchEmployeeById/:id', (req,res)=>{
    Employee.findByIdAndUpdate(req.params.id, req.body, {
        new:true
    }).then((data)=>{
        res.status(202).json({
            success: true,
            message:'Updated'
        })
    }).catch((err)=>{
        res.status(404).json({
            success: false,
            message:err
        })
    })
})
// UPDATE end here  ---------------------------------------------------------------------->

// DELETE  ---------------------------------------------------------------------->
router.delete('/deleteEmployeeById/:id', (req,res)=>{
    Employee.findByIdAndDelete(req.params.id).then(()=>{
        res.status(202).json({
            success: true,
            message:'1 record deleted successfully'
        })
    }).catch((err)=>{
        res.status(404).json({
            success: false,
            message:err
        })
    })
})
// DELETE end here ---------------------------------------------------------------------->
// ############################# Employee API end here ######################################


// router.post('/post/date', (req,res)=>{
//     let startDate = req.body.startDate;
//     let endDate = req.body.endDate;

//     Product.find({
//         createdOn : {
//             $gte:startDate,
//             $lte:endDate
//         }

//     }).then((data)=>{
//         res.status(202).json({
//             Products:data
//         })
//     })
// })


// ############################# Login & Registration API start here ######################################

// registration
router.post('/register', (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    // let phonecode = req.body.phonecode;
    // let phone = req.body.phone;
    // let country = req.body.country;

    const saltRounds = 11;
    let newUserModel = new User();

    bcrypt.genSalt(saltRounds, function(err,salt) {
        bcrypt.hash(password, salt, function(err, hash){
            newUserModel.name=name;
            newUserModel.email=email;
            newUserModel.password=hash;
            // newUserModel.phonecode=phonecode;
            // newUserModel.phone=phone;
            // newUserModel.country=country;
            newUserModel.save().then(()=>{
                res.status(202).json({success: true, message:'SignUp Successfully'})
            }).catch((err)=>{
                res.status(202).json({success: false, message:err})
            })
        })
    })
})

// login
router.post('/login',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({'email':email}).then((user)=>{
        if(user===null) {
            res.status(404).json({message:'User not found'});
        } else {
            const hashPass=user.password;
            bcrypt.compare(password, hashPass, (err,result)=>{
                if(result) {

                    const token = jwt.sign({
                        'user':user.name,
                        'email':user.email,
                    },'secret',{'expiresIn':'1h'})

                    res.status(202).json({success: true, auth_token:token, message:'Logged In Successfully', data: [{'name':user.name, 'email': user.email, 'phonecode': user.phonecode, 'phone': user.phone, 'country': user.country}]});
                } else {
                    res.status(202).json({success: false, message:'Invalid Credentials', data:[]});
                }
            })
        }
    })
})
// ############################# Login & Registration API end here ######################################


module.exports=router;