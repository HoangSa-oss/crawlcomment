import Queue from 'bull';

const queueComment = new Queue('queueCommentCrawlApi','redis://127.0.0.1:6379')


console.log(await queueComment.count())
// console.log(await queueKeyWord.count())
// console.log(await queueHasTag.count())
// console.log(await queueKeyWordApi.count())
// console.log(await queueKeyWordApi1.count())

// cookie.map((x)=>{console.log(x.length)})
// console.log(await queueDetailUrl.count())
// console.log(await queueKeyWord.count())
// console.log(await queueHasTag.count())
// console.log(await queueKeyWordApi.count())
// console.log(await queueKeyWordApi1.count())
// cookie2.map((x)=>{console.log(x.length)})