import puppeteer from 'puppeteer-extra';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'hpagent';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Queue from 'bull';
import schemacomment from './schema/schemacomment.js';
import delay from 'delay'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import {createCipheriv } from 'crypto'
import moment from 'moment';
import fs from 'fs/promises'
import device_id_list from './deviceid.json'assert { type: 'json' }
import { createLogger, format, transports } from 'winston'
import proxyList from './proxy.json'  assert { type: 'json' }
import { workurl } from './workurl.js';
puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = format;
const myFormat = printf(({ message,commentLength,timestamp,statusText,proxy,job,cursor}) => {
    return `${timestamp} | commentLength:${commentLength}|statusText:${statusText}|proxy:${proxy.proxy}|job:${job}|${message}|cursor:${cursor}`;
  });

const RedisQueueConfig = {
redis: {
    host: '51.79.21.42',
    port: 1795,
    db: 7,
    password: '98ySUFdCXrFG',
}
};

const logger = createLogger({
    format: combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
      myFormat
    ),
    
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'crawlapi/combined.log' }),

    ]
  });

const  tiktokProfile = async()=>{
        const queueComment = new Queue('TT:URL:GET-POST',RedisQueueConfig)
        process.setMaxListeners(0);
            var browser = await puppeteer.launch({
                headless: false,
                // userDataDir: `F:/Use/Profie${i}`,
                args: [
                    `--proxy-server=42.96.11.50:55555`,
                    '--enable-features=NetworkService',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--shm-size=8gb', // this solves the issue
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ],
                    ignoreHTTPSErrors: true,
                    executablePath:executablePath(),  
                });
                await delay(1000)
                var page = await browser.newPage({});
                // var page1 = await browser.newPage({});
                await page.authenticate({
                    "username":"heai7r3x",
                    "password":"hEAI7r3x"
                    });
                await page.setBypassCSP(true)
                // await page1.setBypassCSP(true)

            // }
           
                await page.goto("https://www.tiktok.com/",{timeout:60000 })
                await delay(10000)
             
                let LOAD_SCRIPTS = ["signer.js", "webmssdk.js", "xbogus.js"];
                    LOAD_SCRIPTS.forEach(async (script) => {
                    await page.addScriptTag({
                        path: `${__dirname}/javascript/${script}`,
                    });
                    // console.log("[+] " + script + " loaded");
                });
        
                await page.evaluate(() => {
                    window.generateSignature = function generateSignature(url) {
                        if (typeof window.byted_acrawler.sign !== "function") {
                        throw "No signature function found";
                        }
                        return window.byted_acrawler.sign({ url: url });
                    };
                    window.generateBogus = function generateBogus(params) {
                        if (typeof window.generateBogus !== "function") {
                        throw "No X-Bogus function found";
                        }
                        return window.generateBogus(params);
                    };
                    return this;
                });
                await delay(15000)
         
             queueComment.process(1,async (job,done)=>{
                    try {
                        // const dataUrl = await workurl(job,page)
                        let random_index_device = Math.floor(Math.random() * device_id_list.length);
                        let device_id = device_id_list[random_index_device]
                        let tiktok_id_video = job.data.urlPost.slice(job.data.urlPost.indexOf('video')+6,job.data.urlPost.indexOf('video')+6+19)
                        let conditionBreak = 0
                        for(let i=0;i<100000000000;i++){
                            const PARAMS = {      
                                WebIdLastTime: 1716861358,
                                aid: 1988,
                                app_language: "ja-JP",
                                app_name: "tiktok_web",
                                aweme_id: tiktok_id_video,
                                browser_language: "en-US",
                                browser_name: "Mozilla",
                                browser_online: true,
                                browser_platform: "Win32",
                                browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3`,
                                channel: "tiktok_web",
                                cookie_enabled: true,
                                count: 20,
                                current_region: "JP",
                                cursor: i*20,
                                device_id: 7374330702114522640,
                                device_platform: "web_pc",
                                enter_from: "tiktok_web",
                                focus_state: false,
                                fromWeb: 1,
                                from_page: "video",
                                history_len: 8,
                                is_fullscreen: false,
                                is_non_personalized: false,
                                is_page_visible: true,
                                os: "windows",
                                priority_region: ``,
                                referer: ``,
                                region: "VN",
                                screen_height: 1080,
                                screen_width: 1920,
                                tz_name: "Asia/Saigon",
                                odinId: 7374328308312720385,
                                webcast_language: "en"
                                // WebIdLastTime: 1716861358,
                                // aid: 1988,
                                // app_language: `ja-JP`,
                                // app_name: `tiktok_web`,
                                // aweme_id: tiktok_id_video,
                                // browser_language: `en-US`,
                                // browser_name: `Mozilla`,
                                // browser_online: true,
                                // browser_platform: `Win32`,
                                // browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
                                // channel: `tiktok_web`,
                                // cookie_enabled: true,
                                // count: 20,
                                // current_region: `JP`,
                                // cursor: i*20,
                                // device_id: device_id,
                                // device_platform: `web_pc`,
                                // enter_from: `tiktok_web`,
                                // focus_state: false,
                                // fromWeb: 1,
                                // from_page: `video`,
                                // history_len: 2,
                                // is_fullscreen: false,
                                // is_non_personalized: false,
                                // is_page_visible: true,
                                // os:`windows`,
                                // priority_region: `VN`,
                                // referer:`` ,
                                // region: `VN`,//phai co
                                // screen_height: 1080,
                                // screen_width: 1920,
                                // tz_name: `Asia/Bangkok`,
                                // webcast_language:`en`,
                                // msToken:``
                                // msToken: "xPm5d7UAUrnPZJ8NlW0Y3tsBK9SdU19ODmjqtpvjOQoBVtuDX1sUttMxuvo6E3XatkokuTwWyGjsMiNuFVRelvcye0aIMfMpQlzBfVLNnWdGMvkbJGQXENuspBY6lGCSp6meIBo="
                                };
                                const qsObject = new URLSearchParams(PARAMS) ;
                                const qs = qsObject.toString();
                                let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                                const unsignedUrl = `https://www.tiktok.com/api/comment/list/?${qs}`;
                                let verify_fp = await generateVerifyFp();
                                let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
                                let token = await page.evaluate(`generateSignature("${newUrl}")`);
                                let signed_url = newUrl + "&_signature=" + token;
                                let queryString = new URL(signed_url).searchParams.toString();
                                let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
                                signed_url += "&X-Bogus=" + bogus;
                                const xTtParams = await xttparams(queryString)
                                console.log(signed_url)
                                for(let j=0;j<500;j++){
                                    let random_index = Math.floor(Math.random() * proxyList.length);
                                    var proxy = proxyList[random_index]
                                    try {
                                        var res = await testApiReq({userAgent,xTtParams,signed_url,proxy,referer:job.data.urlPost})

                                        var{data ,statusText} = res
                                
                                        if(data.length!=0){
                                            break
                                        }
                                        logger.info({timestamp,message:`comment1:${tiktok_id_video}:reroll:${Object.keys(data).length}`,proxy,statusText,job:JSON.stringify(job.data),cursor:i*20})
                                        await delay(3000)
                                    } catch (error) {
                                        await delay(500)
                                        console.log(error)
                                        logger.info({timestamp,message:`comment2:${tiktok_id_video}:reroll:${error}`,job:JSON.stringify(job.data),cursor:i*20})
                                    }
                                
                                }    
                               
                                const {comments,has_more,total} = data ?? {}
                                logger.info({timestamp,message:`comment3:${tiktok_id_video}:${Object.keys(data).length}`,proxy,statusText,job:JSON.stringify(job.data),cursor:i*20})
                                if(comments!=undefined){
                                    conditionBreak = 0
                                    // comments.map(async(item)=>{
                                    //         let insert = new schemacomment({
                                                
                                    //             // id :`${item.aweme_id}_${item.cid}`                                              "7319484858785352961_7353626449993351953",
                                    //             type : "tiktokComment",
                                    //             index : "master202414",
                                    //             siteId : "6996364702265115675",
                                    //             siteName : "cool.coolmate",
                                    //             insertedDate: "2024-04-03T13:06:32.000Z",
                                    //             publishedDate : "2024-04-03T13:06:32.000Z",
                                    //             url : "https://www.tiktok.com/@cool.coolmate/video/7319484858785352961#7353626449993351953",
                                    //             author : "Tạ Minh Nhựt",
                                    //             authorId : "nhut.ta",
                                    //             title : "Trong tất cả các loại bài tập em thích nhất là bài tập chân :) #coolmate #tapluyen #sports #viral #xuhuong ",
                                    //             description: "coolmate,quần coolmate,Các Bài Tập Cơ Chân,Một Số Bài Tập Cơ Bắp Chân,Những Bài Tập Luyện Cổ Chân,cool.coolmate",
                                    //             content : "yêu cầu làm màu trắng cái mẫu này gấp😞",
                                    //             parentDate : "2024-01-02T12:59:45.000Z",
                                    //             parentId : "6996364702265115675_7319484858785352961",
                                    //             likes : "0",
                                    //             shares : "0",
                                    //             comments : "0",
                                    //             interactions : "0",
                                    //             delayMongo : "0",
                                    //             delayEs : "0",
                                    //             delayCrawler : "0",
                                                
                                    //             // "text":item.text.replace(/\r?\n/g, " ").trim(),"reply_comment_total":item.reply_comment_total,"vid":tiktok_id_video,"cid":item.cid,crawl_reply:false,postApi:false})
                                    //         await insert.save()
                                    //     }
                                    //     // replace(/\r?\n/g, " ").trim()
                                    // )
                                
                                }
                                if(has_more==0||has_more==undefined||total==0||comments==undefined||comments==null){
                                    conditionBreak++
                                }
                                if(conditionBreak==3){
                                    break
                                }
                            await delay(3000)  
                        }  
                    } catch (error) {
                            console.log(error)

                            logger.info({timestamp,message:`comment4:${job.data.urlPost}| ${error}`})
                        ;     
                    }    
                    done();     
                // try {
                //     await page.close()
                //     await browser.close()
                // } catch (error) {
                //     logger.error({timestamp,message:`comment5:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy:proxy.proxy})
                //     done();     
                // }
           
           
 })
 
 
   
}
for(let i=0;i<1;i++){
    tiktokProfile()  
}


async function xttparams(query_str) {
    query_str += "&is_encryption=1";
    const password = "webapp1.0+202106";
    // Encrypt query string using aes-128-cbc
    const cipher = createCipheriv("aes-128-cbc", password, password);
    return Buffer.concat([cipher.update(query_str), cipher.final()]).toString(
        "base64"
    );
}
async function testApiReq({ userAgent,xTtParams, signed_url,proxy,referer}) {
    const response = await axios(signed_url, {
        userAgent: new HttpsProxyAgent({
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          scheduling: 'lifo',
          proxy: proxy.proxy
        }),
        headers:{
            "user-agent": userAgent,
            "referer": referer,  
        }
      });
    return response


}
async function generateVerifyFp() {
    var e = Date.now();
    var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
        ),
        e = t.length,
        n = Date.now().toString(36),
        r = [];
    (r[8] = r[13] = r[18] = r[23] = "_"), (r[14] = "4");
    for (var o = 0, i = void 0; o < 36; o++)
        r[o] ||
        ((i = 0 | (Math.random() * e)), (r[o] = t[19 == o ? (3 & i) | 8 : i]));
    return "verify_" + n + "_" + r.join("");
} 
