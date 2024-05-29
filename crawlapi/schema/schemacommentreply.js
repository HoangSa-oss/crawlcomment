import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
    vid:String,
    reply_id:String,
    cid:String,
    text:String,
    postApi:Boolean
}, { versionKey: false })
export default model('commentreply',profileSchema);
