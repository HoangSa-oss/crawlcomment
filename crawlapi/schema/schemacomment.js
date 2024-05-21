import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
    vid:String,
    cid:String,
    text:String,
    reply_comment_total:Number,
    crawl_reply:Boolean
}, { versionKey: false })
export default model('comment',profileSchema);
