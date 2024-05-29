import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
        id: String,
        type: String,
        index: String,
        siteId: String,
        siteName: String,
        insertedDate: String,
        publishedDate: String,
        url: String,
        author: String,
        authorId: String,
        title: String,
        description: String,
        content: String,
        delayCrawler:String,
        likes: String,
        shares: String,
        comments:String,
        views: String,
        interactions: String,
        delayMongo: String,
        delayEs: String,
        ds: {
            ip : String,
            source : String
        }
}, { versionKey: false })
export default model('urlInfo',profileSchema);
