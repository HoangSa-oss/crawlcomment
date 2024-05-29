import Queue from 'bull';

const queueComment = new Queue('queueUrlApi','redis://127.0.0.1:6379')

const urlVdideo = [
      //////////////////////////////
      "https://www.tiktok.com/@cool.coolmate/video/7319484858785352961"


]
// for(let i=0;i<urlVdideo.length;i++){
//     queueComment.add({urlVideo:`${urlVdideo[i]}`})
// }
console.log(urlVdideo.length)
let addQueue1 = 8
for(let i=0;i<urlVdideo.length;i++){
  
// if(urlPost.length ==0){
        if(addQueue1<7){
            addQueue1++
            queueComment.add({urlVideo:`${urlVdideo[i]}`})
            await delay(10000)
        }else{
            queueComment.add({urlVideo:`${urlVdideo[i]}`})
        }
}
// await queueComment.obliterate({ force: true });