// import puppeteer from 'puppeteer-extra';
// import axios from 'axios';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import Queue from 'bull';
// import schemacomment from './schema/schemacomment.js';
// import delay from 'delay'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import  {executablePath} from 'puppeteer'
// import cookie from "./cookiedefault.json" assert { type: 'json' }

// puppeteer.use(StealthPlugin());
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// const  tiktokProfile = async()=>{
//     const queueComment = new Queue('queueCommentCrawlApi','redis://127.0.0.1:6379')
  
//     queueComment.process(1,async (job,done)=>{
//         await delay(1000)
//             const browser = await puppeteer.launch({
//             headless: false,
//             // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
//             args: [
//                 '--enable-features=NetworkService',
//                 '--no-sandbox',
//                 '--disable-setuid-sandbox',
//                 '--disable-dev-shm-usage',
//                 '--disable-web-security',
//                 '--disable-features=IsolateOrigins,site-per-process',
//                 '--shm-size=8gb', // this solves the issue
//                 '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//                 ],
//                 ignoreHTTPSErrors: true,
//                 executablePath:executablePath(),  
//         });
//         await delay(1000)
//         const page = await browser.newPage({});
//         // const page1 = await browser.newPage({});
//         try {
              

//         // let urlRes = ''
//         // page.on('request',(req)=>{
//         //     if(req.url().includes("https://www.tiktok.com/api/user/playlist")){
//         //         urlRes = req.url()
//         //     }
//         // })
//         // await page.setBypassCSP(true)
//         await page.goto(`https://www.tiktok.com/@callduckofficial?lang=en`,{waitUntil: 'networkidle2'})
            
//         // let secUid = urlRes.split('&')[27].slice(7,1000000000000)
//         // if(secUid=='width=1920'){
//         //     secUid = urlRes.split('&')[26].slice(7,1000000000000)
//         // }
//         console.log('concac')
//         let LOAD_SCRIPTS = ["signer.js", "webmssdk.js", "xbogus.js"];
//             LOAD_SCRIPTS.forEach(async (script) => {
//             await page.addScriptTag({
//                 path: `${__dirname}/javascript/${script}`,
//             });
//             // console.log("[+] " + script + " loaded");
//         });
//         await delay(5000)
//         await page.evaluate(() => {
//             window.generateSignature = function generateSignature(url) {
//                 if (typeof window.byted_acrawler.sign !== "function") {
//                 throw "No signature function found";
//                 }
//                 return window.byted_acrawler.sign({ url: url });
//             };
//             window.generateBogus = function generateBogus(params) {
//                 if (typeof window.generateBogus !== "function") {
//                 throw "No X-Bogus function found";
//                 }
//                 return window.generateBogus(params);
//             };
//             return this;
//         });
//         let cursor = 0
//         let tiktok_id_video = job.data.urlVideo.slice(job.data.urlVideo.indexOf('video')+6,job.data.urlVideo.indexOf('video')+6+19)
//         await delay(3000)
//         for(let i=0;i<10000;i++){
//             const PARAMS = {
//                 WebIdLastTime: 1704213533,
//                 aid: 1988,
//                 app_language: `ja-JP`,
//                 app_name: `tiktok_web`,
//                 aweme_id: tiktok_id_video,
//                 browser_language: `en-US`,
//                 browser_name: `Mozilla`,
//                 browser_online: true,
//                 browser_platform: `Win32`,
//                 browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
//                 channel: `tiktok_web`,
//                 cookie_enabled: true,
//                 count: 20,
//                 current_region: `JP`,
//                 cursor: 20,
//                 device_id: 7319541331834226178,
//                 device_platform: `web_pc`,
//                 enter_from: `tiktok_web`,
//                 focus_state: false,
//                 fromWeb: 1,
//                 from_page: `video`,
//                 history_len: 2,
//                 is_fullscreen: false,
//                 is_non_personalized: false,
//                 is_page_visible: true,
//                 os:`windows`,
//                 priority_region: `VN`,
//                 referer:`` ,
//                 region: `VN`,
//                 screen_height: 1080,
//                 screen_width: 1920,
//                 tz_name: `Asia/Bangkok`,
//                 webcast_language:`en`,
//                 };
//                 try {
//                     const qsObject = new URLSearchParams(PARAMS) ;
//                     const qs = qsObject.toString();
//                     let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//                     const unsignedUrl = `https://www.tiktok.com/api/comment/list/?${qs}`;
//                     let verify_fp = await generateVerifyFp();
//                     let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
//                     console.log(newUrl)
//                     let token = await page.evaluate(`generateSignature("${newUrl}")`);
//                     console.log('token:'+token)
//                     let signed_url = newUrl + "&_signature=" + token;
//                     let queryString = new URL(signed_url).searchParams.toString();
//                     let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
//                     signed_url += "&X-Bogus=" + bogus;
//                 } catch (error) {
//                     console.log(error)
//                 }
             
//                 // console.log(signed_url)
//                 // console.log('concac')
//                 const xTtParams = await xttparams(queryString)
         
//                 for(let i=0;i<10;i++){
//                     await delay(4000)
//                     try {
//                         await page1.goto(signed_url, { waitUntil: "networkidle0" })
//                         const text = await page1.evaluate(()=>{
//                             return document.querySelector("body > pre")?.textContent
//                         });
//                         var data = JSON.parse(text)
//                         if(data.itemList!=undefined){
//                             break
//                         }
//                     } catch (error) {
//                         console.log('loi for'+error.message)
//                     }
                 
//                 }      
             
              
//                 const privateAccount =  await page.evaluate(()=>{
//                     return document.querySelector('p.css-1ovqurc-PTitle.emuynwa1')?.textContent
//                 })  

//                 cursor = data.cursor
//                 if(cursor==0||privateAccount!=undefined){
//                     throw new Error("No Content")
//                 }
             
//                 console.log(data.itemList.length)
//                 let conditionBreak = false
//                 if(data.itemList!=undefined){
//                     data.itemList.map(async(item,index)=>{
//                         if(item.createTime>dateTimeStamp){
                        
//                             if(item.author!=undefined){
//                                 let insert = new schemacomment({author:job.data.author,"date":item.createTime,urlPost:`https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`})
//                                 await insert.save()
//                             }
//                         }else{
//                             if(index==data.itemList.length-1){
//                                 if(item.createTime<dateTimeStamp){
//                                     conditionBreak = true
//                                 }
//                             }
                            
//                         }      
//                     }
//                     )
//                 }
//                 if(data.hasMore==false||conditionBreak==true){
//                     break;
//                 }
//                 await delay(2000)  
//             }  
//         } catch (error) {
//             // if(error.message=="Navigation timeout of 30000 ms exceeded"||error.message=="Cannot read properties of undefined (reading 'length')"){
//             //     queueComment.add({author:`${job.data.author}`})
//             //     console.log(job.data.author)
//             // }
//             console.log(error.message)
//         }
//         try {
//             await page.close()
//             await browser.close()
//         } catch (error) {
//             console.log(error)
//         }
//         done();  
//     })
// }
// for(let i=0;i<4;i++){
//     tiktokProfile()  
// }


// async function xttparams(query_str) {
//     query_str += "&is_encryption=1";
//     const password = "webapp1.0+202106";
//     // Encrypt query string using aes-128-cbc
//     const cipher = createCipheriv("aes-128-cbc", password, password);
//     return Buffer.concat([cipher.update(query_str), cipher.final()]).toString(
//         "base64"
//     );
// }
// async function testApiReq({ userAgent, signed_url}) {
//     const options = {
//       method: "GET",
//       timeout: 50000,

//       headers: {
//         "user-agent": userAgent,
//       },
//       url: signed_url,
//     };
//     return axios(options);
//   }
// async function generateVerifyFp() {
//     var e = Date.now();
//     var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
//         ""
//         ),
//         e = t.length,
//         n = Date.now().toString(36),
//         r = [];
//     (r[8] = r[13] = r[18] = r[23] = "_"), (r[14] = "4");
//     for (var o = 0, i = void 0; o < 36; o++)
//         r[o] ||
//         ((i = 0 | (Math.random() * e)), (r[o] = t[19 == o ? (3 & i) | 8 : i]));
//     return "verify_" + n + "_" + r.join("");
// } 
// // const  tiktokProfile = async()=>{
// //     queueComment.process(1,async (job,done)=>{
// //         const browser = await puppeteer.launch({
// //             headless: false,
// //             // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
// //             args: [
// //                 '--enable-features=NetworkService',
// //                 '--no-sandbox',
// //                 '--disable-setuid-sandbox',
// //                 '--disable-dev-shm-usage',
// //                 '--disable-web-security',
// //                 '--disable-features=IsolateOrigins,site-per-process',
// //                 '--shm-size=8gb', // this solves the issue
// //                 '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
// //                 ],
// //                 ignoreHTTPSErrors: true,
// //                 executablePath:executablePath(),  
// //         });
// //         const page = await browser.newPage({});
// //         // await page.setCookie(...cookie[1][4])

// //         await page.setBypassCSP(true)
// //         await page.goto("https://www.tiktok.com",{
// //         })
// //         await delay(3000)
// //         // await page.goto(job.data.urlVideo,{waitUntil: 'load'})
// //         // const urlRes = await page.waitForRequest(req=>{
// //         //     return req.url().includes("https://www.tiktok.com/api/comment/list")
// //         // })
    
// //         // await page.waitForNavigation({
// //         // });
// //         // await delay(5000)
// //         // const msToken = urlRes.url().split('&')[32].slice(8,1000000000000)
// //         const msToken ="xghmBuuDJpyIOLrfW4dGMZlRsB5i2HKIvSHx_hjyrkW6mJ5ikRHfdk-mnrdY6aeMj-9tXAlLNdxawvoWd3rnsNuJred1yaYABzRbaBA15ghtjNkGN7kP-xEa_tu0uZaAoyH-Qjw="
// //         let LOAD_SCRIPTS = ["signer.js", "webmssdk.js", "xbogus.js"];
// //             LOAD_SCRIPTS.forEach(async (script) => {
// //             await page.addScriptTag({
// //                 path: `${__dirname}/javascript/${script}`,
// //             });
// //             // console.log("[+] " + script + " loaded");
// //         });
// //         console.log('cncac')
// //         await delay(3000)
// //         await page.evaluate(() => {
// //             window.generateSignature = function generateSignature(url) {
// //                 if (typeof window.byted_acrawler.sign !== "function") {
// //                 throw "No signature function found";
// //                 }
// //                 return window.byted_acrawler.sign({ url: url });
// //             };
// //             window.generateBogus = function generateBogus(params) {
// //                 if (typeof window.generateBogus !== "function") {
// //                 throw "No X-Bogus function found";
// //                 }
// //                 return window.generateBogus(params);
// //             };
// //             return this;
// //         });
// //         console.log('concac')
// //         let conditionBreak = 0
// //         let tiktok_id_video = job.data.urlVideo.slice(job.data.urlVideo.indexOf('video')+6,job.data.urlVideo.indexOf('video')+6+19)
// //         for(let i=0;i<10000;i++){
// //             let PARAMS = {
// //                 WebIdLastTime: 1704213533,
// //                 aid: 1988,
// //                 app_language: `ja-JP`,
// //                 app_name: `tiktok_web`,
// //                 aweme_id: 7319484034243906817,
// //                 browser_language: `en-US`,
// //                 browser_name: `Mozilla`,
// //                 browser_online: true,
// //                 browser_platform: `Win32`,
// //                 browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
// //                 channel: `tiktok_web`,
// //                 cookie_enabled: true,
// //                 count: 20,
// //                 current_region: `JP`,
// //                 cursor: 20,
// //                 device_id: 7319541331834226178,
// //                 device_platform: `web_pc`,
// //                 enter_from: `tiktok_web`,
// //                 focus_state: false,
// //                 fromWeb: 1,
// //                 from_page: `video`,
// //                 history_len: 2,
// //                 is_fullscreen: false,
// //                 is_non_personalized: false,
// //                 is_page_visible: true,
// //                 os:`windows`,
// //                 priority_region: `VN`,
// //                 referer:`` ,
// //                 region: `VN`,
// //                 screen_height: 1080,
// //                 screen_width: 1920,
// //                 tz_name: `Asia/Bangkok`,
// //                 webcast_language:`en`,
// //                 // aweme_id: tiktok_id_video,
// //                 // cursor: i*20,
// //                 // count: 20,
// //                 // msToken: msToken,
// //                 // aid: 1988,
// //                 // app_language: "ja-JP",
// //                 // app_name: "tiktok_web",
// //                 // browser_language: "en-US",
// //                 // browser_name: "Mozilla",
// //                 // browser_online: true,
// //                 // browser_platform: "Win32",
// //                 // browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
// //                 // channel: "tiktok_web",
// //                 // cookie_enabled: true,
// //                 // current_region: "JP",
// //                 // device_id: "7242972052013434386",
// //                 // device_platform: "web_pc",
// //                 // from_page: "video",
// //                 // os: "windows",
// //                 // priority_region: "VN",
// //                 // referer: '',
// //                 // region: "VN",
// //                 // screen_height: 1080,
// //                 // screen_width: 1920,
// //                 // webcast_language: "en",
// //             }
// //             const qsObject = new URLSearchParams(PARAMS) ;
// //             const qs = qsObject.toString();
// //             console.log(qs)
// //             let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
// //             const unsignedUrl = `https://www.tiktok.com/api/comment/list/?${qs}`;
// //             let verify_fp = await generateVerifyFp();
// //             let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
// //             let token = await page.evaluate(`generateSignature("${newUrl}")`);
// //             let signed_url = newUrl + "&_signature=" + token;
// //             console.log(signed_url)
// //             let queryString = new URL(signed_url).searchParams.toString();
// //             let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
// //             signed_url += "&X-Bogus=" + bogus;
// //             // const qsObject = new URLSearchParams(payload) ;
// //             // const qs = qsObject.toString();
// //             // let unsignUrl = `https://www.tiktok.com/api/comment/list/?${qs}`
// //             // let verify_fp = "verify_lj720og1_ONJPD8Y8_fmGX_4iwe_8rRB_UzTxV9tjNrKV";
// //             // let newUrl = unsignUrl + "&verifyFp=" + verify_fp;
            
// //             // let token = await page.evaluate(()=>{
// //             //     return generateSignature("${newUrl}")
// //             // });
// //             // let signed_url = newUrl + "&_signature=" + token;
// //             // let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
// //             // let queryString = new URL(signed_url).searchParams.toString();
// //             // let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
// //             // signed_url += "&X-Bogus=" + bogus;
// //             // const res = await testApiReq({userAgent},signed_url,job.data.urlVideo)
// //             // const { data } = res;
// //             console.log(data)
// //             try {
// //                 data.comments.map(async(x)=>{
// //                     let insert = new schemacomment({"text":x.text,"cid":x.cid,"reply_comment_total":x.reply_comment_total,"vid":tiktok_id_video})
// //                     await insert.save()
// //                 })
// //             } catch (error) {
// //                 conditionBreak++
// //                 console.log(error)
// //                 await delay(5000)
// //             }
// //             if(conditionBreak>5){
// //                 break;
// //             }
// //         }    
// //         try {
// //             await page.close()
// //             await browser.close();
// //         } catch (error) {
// //         }
// //         console.log('done')
// //         done();   
// //     })
// // }
// // tiktokProfile()  
// // async function testApiReq({ userAgent }, url,referer) {
// //     const options = {
// //         timeout: 10000,
// //         method: "GET",
// //         headers: {
// //         "user-agent": userAgent,
// //         "referer": referer // !!! Referer is required
// //         },
// //         url: url,
// //     };
// //     return axios(options);
// // }
// // async function generateVerifyFp() {
// //     var e = Date.now();
// //     var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
// //         ""
// //         ),
// //         e = t.length,
// //         n = Date.now().toString(36),
// //         r = [];
// //     (r[8] = r[13] = r[18] = r[23] = "_"), (r[14] = "4");
// //     for (var o = 0, i = void 0; o < 36; o++)
// //         r[o] ||
// //         ((i = 0 | (Math.random() * e)), (r[o] = t[19 == o ? (3 & i) | 8 : i]));
// //     return "verify_" + n + "_" + r.join("");
// // } 
// ////////////////////////////////////////////////////////////////
// import puppeteer from 'puppeteer-extra';
// import axios from 'axios';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// import Queue from 'bull';
// import schemacomment from './schema/schemacomment.js';
// const queueComment = new Queue('queueCommentCrawlApi','redis://127.0.0.1:6379')
// import delay from 'delay'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import  {executablePath} from 'puppeteer'
// import cookie from "./cookiedefault.json" assert { type: 'json' }
// import schemacommentreply from './schema/schemacommentreply.js';
// puppeteer.use(StealthPlugin());
// const  tiktokProfile = async()=>{


// queueComment.process(1,async (job,done)=>{
//     const browser = await puppeteer.launch({
//         headless: false,
//         // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
//         args: [
//             '--enable-features=NetworkService',
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--disable-web-security',
//             '--disable-features=IsolateOrigins,site-per-process',
//             '--shm-size=8gb', // this solves the issue
//             '--user-agent="5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"'
//             ],
//             ignoreHTTPSErrors: true,
//             executablePath:executablePath(),  
//     });
//     const page = await browser.newPage({});
//     await page.setCookie(...cookie[1][4])

//     await page.setBypassCSP(true)
//     await page.goto("https://www.tiktok.com",{
//     })
//     await delay(3000)
//     page.goto(job.data.urlVideo,{
//     })
//     const urlRes = await page.waitForRequest(req=>{
//         return req.url().includes("https://www.tiktok.com/api/comment/list")
//     })
//     await page.waitForNavigation({
//     });
//     const msToken = urlRes.url().split('&')[32].slice(8,1000000000000)
//     let LOAD_SCRIPTS = ["signer.js", "webmssdk.js", "xbogus.js"];
//         LOAD_SCRIPTS.forEach(async (script) => {
//         await page.addScriptTag({
//             path: `${__dirname}/javascript/${script}`,
//         });
//         // console.log("[+] " + script + " loaded");
//     });
//     await page.evaluate(() => {
//         window.generateSignature = function generateSignature(url) {
//             if (typeof window.byted_acrawler.sign !== "function") {
//             throw "No signature function found";
//             }
//             return window.byted_acrawler.sign({ url: url });
//         };
//         window.generateBogus = function generateBogus(params) {
//             if (typeof window.generateBogus !== "function") {
//             throw "No X-Bogus function found";
//             }
//             return window.generateBogus(params);
//         };
//         return this;
//     });
//     let conditionBreak = 0
//     let tiktok_id_video = job.data.urlVideo.slice(job.data.urlVideo.indexOf('video')+6,job.data.urlVideo.indexOf('video')+6+19)
//     for(let i=0;i<10000;i++){
//         let payload = {
//             aweme_id: tiktok_id_video,
//             cursor: i*20,
//             count: 20,
//             msToken: msToken,
//             aid: 1988,
//             app_language: "ja-JP",
//             app_name: "tiktok_web",
//             browser_language: "en-US",
//             browser_name: "Mozilla",
//             browser_online: true,
//             browser_platform: "Win32",
//             browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
//             channel: "tiktok_web",
//             cookie_enabled: true,
//             current_region: "JP",
//             device_id: "7242972052013434386",
//             device_platform: "web_pc",
//             from_page: "video",
//             os: "windows",
//             priority_region: "VN",
//             referer: '',
//             region: "VN",
//             screen_height: 1080,
//             screen_width: 1920,
//             webcast_language: "en",
//         }
//         const qsObject = new URLSearchParams(payload) ;
//         const qs = qsObject.toString();
//         let unsignUrl = `https://www.tiktok.com/api/comment/list/?${qs}`
//         let verify_fp = "verify_lj720og1_ONJPD8Y8_fmGX_4iwe_8rRB_UzTxV9tjNrKV";
//         let newUrl = unsignUrl + "&verifyFp=" + verify_fp;
        
//         let token = await page.evaluate(()=>{
//             return generateSignature("${newUrl}")
//         });
//         let signed_url = newUrl + "&_signature=" + token;
//         let userAgent = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
//         let queryString = new URL(signed_url).searchParams.toString();
//         let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
//         signed_url += "&X-Bogus=" + bogus;
//         const res = await testApiReq({userAgent},signed_url,job.data.urlVideo)
//         const { data } = res;
//         try {
//             data.comments.map(async(x)=>{
//                 let insert = new schemacomment({"text":x.text,"cid":x.cid,"reply_comment_total":x.reply_comment_total,"vid":tiktok_id_video})
//                 await insert.save()
//             })
//         } catch (error) {
//             conditionBreak++
//             console.log(error)
//             await delay(5000)
//         }
//         if(conditionBreak>5){
//             break;
//         }
//     }
//     const replyComment = await schemacomment.find({vid:tiktok_id_video,reply_comment_total:{"$gte":1}})
//     for(let j=0;j<replyComment.length;j++){
//         for(let i=0;i<1000;i++){
//             let payload = {
//                 cursor: i*3,
//                 count: 3,
//                 msToken: msToken,
//                 comment_id:replyComment[j].cid,
//                 item_id:replyComment[j].vid,
//                 aid: 1988,
//                 app_language: "ja-JP",
//                 app_name: "tiktok_web",
//                 browser_language: "en-US",
//                 browser_name: "Mozilla",
//                 browser_online: true,
//                 browser_platform: "Win32",
//                 browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
//                 channel: "tiktok_web",
//                 cookie_enabled: true,
//                 current_region: "JP",
//                 device_id: "7242972052013434386",
//                 device_platform: "web_pc",
//                 from_page: "video",
//                 os: "windows",
//                 priority_region: "VN",
//                 referer: '',
//                 region: "VN",
//                 screen_height: 1080,
//                 screen_width: 1920,
//                 webcast_language: "en",
//             }
//             let qsObject = new URLSearchParams(payload) ;
//             let qs = qsObject.toString();
//             let unsignUrl = `https://www.tiktok.com/api/comment/list/reply/?${qs}`
//             let verify_fp = "verify_lj720og1_ONJPD8Y8_fmGX_4iwe_8rRB_UzTxV9tjNrKV";
//             let newUrl = unsignUrl + "&verifyFp=" + verify_fp;
            
//             let token = await page.evaluate(()=>{
//                 return generateSignature("${newUrl}")
//             });
//             let signed_url = newUrl + "&_signature=" + token;
//             let userAgent = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
//             let queryString = new URL(signed_url).searchParams.toString();
//             let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
//             signed_url += "&X-Bogus=" + bogus;
//             const res = await testApiReq({userAgent},signed_url,job.data.urlVideo)
//             const { data } = res;
//             data.comments?.map(async(x)=>{
//                 let insert = new schemacommentreply({"text":x.text,"reply_id":x.reply_id,"vid":tiktok_id_video})
//                 await insert.save()
//             })
//             if(data.has_more==0){
//                 break
//             }
//             await delay(1000)

//         }  
//     }
        
  
//     try {
//         await page.close()
//         await browser.close();
//        } catch (error) {
//     }
//     console.log('done')
//     done();   
// })
// }
// tiktokProfile()  
// async function testApiReq({ userAgent }, url,referer) {
// const options = {
//     timeout: 10000,
//     method: "GET",
//     headers: {
//     "user-agent": userAgent,
//     "referer": referer // !!! Referer is required
//     },
//     url: url,
// };
// return axios(options);}