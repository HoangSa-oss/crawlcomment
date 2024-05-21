import Queue from 'bull';

const queueComment = new Queue('queueCommentCrawlHTML','redis://127.0.0.1:6379')

const urlVdideo = [
    "https://www.tiktok.com/@ivnqna05/video/7228169427613682950"

]
for(let i=0;i<urlVdideo.length;i++){
    queueComment.add({urlVideo:`${urlVdideo[i]}`})
}

// await queueComment.obliterate({ force: true });