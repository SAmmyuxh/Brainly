import mongoose from "mongoose";
const TagsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    }
})
export default mongoose.model('Tag',TagsSchema)