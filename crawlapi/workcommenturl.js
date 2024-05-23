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
import { createLogger, format, transports } from 'winston'
import proxyList from './proxy.json'  assert { type: 'json' }
puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = format;
const myFormat = printf(({ message,commentLength,cursor,has_more ,urlPost,timestamp,status_code,status_msg,total,proxy,countQueue}) => {
    return `${timestamp} | commentLength:${commentLength} | urlPost:${urlPost} | cursor:${cursor} | ${message}|has_more:${has_more}| status_code:${status_code}| status_msg:${status_msg}|total:${total}|proxy:${proxy.proxy}|queue:${countQueue}`;
  });
  const myFormat2 = printf(({error}) => {
    return error;
  });
   
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
  const logger2 = createLogger({
    format: combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
      myFormat2
    ),
    
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'crawlapi/error.log' }),

    ]
  });

const  tiktokProfile = async(i)=>{
        await delay(i*1000)
        const queueComment = new Queue('queueCommentCrawlApi','redis://127.0.0.1:6379')
        var proxy=proxyList[i]
        process.setMaxListeners(0);
       
             queueComment.process(1,async (job,done)=>{
                const countQueue = await queueComment.count()
                let random_await = Math.floor(Math.random() * 4);
               try {
                if(Object.keys(proxy.proxy).length==0){
                    var browser = await puppeteer.launch({
                        headless: false,
                        // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
                        args: [
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
                        await page.setBypassCSP(true)
                }else
                {
                    var browser = await puppeteer.launch({
                        headless: false,
                        // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
                        args: [
                            `--proxy-server=${proxy.server}:${proxy.port}`,
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
                        await page.authenticate({
                            username: proxy.username,
                            password: proxy.password,
                            });
                        await page.setBypassCSP(true)
                    }
                   
                        await page.goto("https://www.tiktok.com/",{ })
                        await delay(3000)
                        // if(secUid=='width=1920'){
                        //     secUid = urlRes.split('&')[26].slice(7,1000000000000)
                        // }
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
                        await delay(3000)
                   
                    try {
                   
                        let tiktok_id_video = job.data.urlVideo.slice(job.data.urlVideo.indexOf('video')+6,job.data.urlVideo.indexOf('video')+6+19)
                        let conditionBreak = 0
                        for(let i=0;i<100000000;i++){
                            const PARAMS = {
                                WebIdLastTime: 1704213533,
                                aid: 1988,
                                app_name: `tiktok_web`,
                                aweme_id: tiktok_id_video,
                                browser_name: `Mozilla`,
                                browser_online: true,
                                browser_platform: `Win32`,
                                browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
                                channel: `tiktok_web`,
                                count: 20,
                                cursor: i*20,
                                device_id: 7319541331834226178,
                                device_platform: `web_pc`,
                                enter_from: `tiktok_web`,
                                focus_state: false,
                                fromWeb: 1,
                                from_page: `video`,
                                history_len: 2,
                                is_fullscreen: false,
                                is_non_personalized: false,
                                is_page_visible: true,
                                os:`windows`,
                                referer:`` ,
                                screen_height: 1080,
                                screen_width: 1920,
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
                                // if(i==0){
                                //     for(let j=0;j<3;j++){
                                //         try {
                                //             var res = await testApiReq({userAgent,xTtParams,signed_url})
                                //             var { data } = res;
                                //             if(data.comments!=undefined){
                                //                 break
                                //             }
                                //             await delay(10000)
                                //             logger.info({timestamp,message:`comment1:${tiktok_id_video}:reroll`,cursor:i*20,urlPost:job.data.urlVideo})
                                //         } catch (error) {
                                //             await delay(5000)
                                //             logger.info({timestamp,message:`comment2:${tiktok_id_video}:reroll||${error}`,cursor:i*20,urlPost:job.data.urlVideo})
                                //         }
                                    
                                //     }  
                                // } else {
                                    
                                    for(let j=0;j<2;j++){
                                        try {
                                            var res = await testApiReq({userAgent,xTtParams,signed_url,proxy})
                                           
                                            var {data} = res
                                            if(data.comments!=undefined){
                                                break
                                            }
                                            await delay(5000)
                                            logger.info({timestamp,message:`comment1:${tiktok_id_video}:reroll}}`,cursor:i*20,urlPost:job.data.urlVideo,proxy,countQueue})
                                        } catch (error) {
                                            await delay(3000)
                                            console.log(error)
                                            logger2.error({error})
                                            logger.info({timestamp,message:`comment2:${tiktok_id_video}:reroll:${JSON.stringify(error)}`,cursor:i*20,urlPost:job.data.urlVideo,proxy,countQueue})
                                        }
                                    
                                    }    
                                // }
                              
                                // var res = await testApiReq({userAgent,xTtParams,signed_url})
                                // var { data } = res;
                                const {comments,cursor,has_more,status_code,status_msg,total} = data ?? {}
                                logger.info({timestamp,message:`comment3:${tiktok_id_video}`,commentLength:comments?.length,cursor:i*20,has_more,urlPost:job.data.urlVideo,status_code,status_msg,total,proxy,countQueue})
                                if(comments!=undefined){
                                    comments.map(async(item)=>{
                                            let insert = new schemacomment({"text":item.text,"reply_comment_total":item.reply_comment_total,"vid":tiktok_id_video,"cid":item.cid,crawl_reply:false,urlPost:job.data.urlVideo,proxy})
                                            await insert.save()
                                        }
                                        // replace(/\r?\n/g, " ").trim()
                                    )
                                    conditionBreak = 0
                                }
                                if(has_more==0||has_more==undefined){
                                    conditionBreak++
                                }
                                if(conditionBreak==2){
                                    break
                                }
                    
                    
            
                            // let conditionBreak = false
                            // if(data.itemList!=undefined){
                            //     data.itemList.map(async(item,index)=>{
                            //         if(item.createTime>dateTimeStamp){
                                    
                            //             if(item.author!=undefined){
                            //                 let insert = new schemacomment({author:job.data.author,"date":item.createTime,urlPost:`https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`})
                            //                 await insert.save()
                            //             }
                            //         }else{
                            //             if(index==data.itemList.length-1){
                            //                 if(item.createTime<dateTimeStamp){
                            //                     conditionBreak = true
                            //                 }
                            //             }
                                        
                            //         }      
                            //     }
                            //     )
                            // }
                            // if(data.hasMore==false||conditionBreak==true){
                            //     break;
                            // }
                            await delay(3000)  
                        }  
                    } catch (error) {
                            console.log(error)
                            logger2.error({error})

                            logger.info({timestamp,message:`comment4:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy})
                        ;     
                    }    
            
                try {
                    await page.close()
                    await browser.close()
                } catch (error) {
                    logger.error({timestamp,message:`comment5:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy:proxy.proxy})
                    done();     
                }
            } catch (error) {
                logger2.error({error})

                logger.info({timestamp,message:`comment6:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy})
                try {
                    await page.close()
                    await browser.close()
                } catch (error) {
                    logger.error({timestamp,message:`comment7:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy:proxy.proxy}) 
                }
            }  
                done();     
            })
 
 
   
}
for(let i=0;i<8;i++){
    tiktokProfile(i)  
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
async function testApiReq({ userAgent,xTtParams, signed_url,proxy}) {
    // const options = {
    //   method: "GET",
    //   timeout: 50000,

    //   headers: {
    //     "user-agent": userAgent,
    //     // "x-tt-params": xTtParams,
    //   },
    //   proxy: {
    //     host: "103.74.107.77",
    //     protocol:"http",
    //     port: 54589,
    //     auth: {
    //         username: 'ibyv0x2m',
    //         password: 'iByV0x2m'
    //       }
    //     },
    //   url: signed_url,
    // }
    if(Object.keys(proxy.proxy).length==0){
        const response = await axios(signed_url, {
            headers:{
                "user-agent": userAgent,
            }
          });
        return response

    } else{
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
            }
          });
        return response
    }
  
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
