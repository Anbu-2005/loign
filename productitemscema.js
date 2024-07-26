const mongoose = require("mongoose");

const dataitem=new mongoose.Schema({
    itemname:{type:String, unique:true},
    
},{
   collection:"itemninfo" 
});
mongoose.model("iteminfo",dataitem);