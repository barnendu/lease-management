
const mongoose = require("mongoose");

var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var requireStringValidator=[
    function(val){
        var testVal=val.trim();
        return (testVal.length>0);
    },
    '{PATH} cannot be empty '
];

var UserSchema= new Schema({
    userName:{ type:String, 
        require:true,
        unique: true,
        validate:requireStringValidator },
    firstName:{ type:String, 
        require:true,
        validate:requireStringValidator },
    lastName:{ type:String, 
        require:true,
        validate:requireStringValidator },
    email:{ type:String, 
        require:true,
        validate:requireStringValidator },
        
    phone:String,
    password:String
});


UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
var User=mongoose.model("User",UserSchema);
module.exports=User;