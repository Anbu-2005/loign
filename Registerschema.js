const { default: mongoose } = require("mongoose");

const RegisterSchema=new mongoose.Schema({
    SetEmail1:{type:String, unique:true},
    SetEmail:{type:String},
    SetPassword:{type:String},
    
});
const Register=mongoose.model('Register',Register)



const itemSchema = new mongoose.Schema({
    itemname: { type: String, required: true }
  });
  
  const Item = mongoose.model('Item', itemSchema);