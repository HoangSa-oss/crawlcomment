
import  Queue  from 'bull'
import Keyword from './schema/schemacomment.js'
const queueCommentReply = new Queue('queueCommentReplyCrawlApi','redis://127.0.0.1:6379')
import mongo_info from './schema/connectmongo.js'
import { schedule } from 'node-cron'
import mongoose from 'mongoose'
const addQueue = async  ()=>{
    mongoose.connect(mongo_info.name_colection);
    try {
        const data =  await Keyword.find({crawl_reply:false,reply_comment_total:{$gte: 1}}).select("-_id -crawl_reply").limit(30)
        console.log(data.length)
        data.map(async(x)=>{
            queueCommentReply.add({...x.toObject()})
            await Keyword.updateMany(x,{crawl_reply:true})
        })  
    } catch (error) {
        console.log(error)
    }



 
}

schedule(`*/30 * * * * *`, async() => {
    await addQueue()
    console.log(await queueCommentReply.count())
});
  

// await queueCommentReply.obliterate({ force: true })