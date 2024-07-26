const mongoose=require('mongoose');

const ImageSchema=moongose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        data:Buffer,
        contentType:String
    }
})
module.exports=ImageModel=moongose.model('ImageModel',ImageSchema
    
)