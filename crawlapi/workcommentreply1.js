import puppeteer from 'puppeteer-extra';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Queue from 'bull';
import schemacomment from './schema/schemacomment.js';
import schemacommentreply from './schema/schemacommentreply.js';

import delay from 'delay'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import {createCipheriv } from 'crypto'
import moment from 'moment';
import fs from 'fs/promises'
import { createLogger, format, transports } from 'winston'

puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = format;
const myFormat = printf(({ message,commentLength,cursor,has_more ,urlPost,timestamp}) => {
    return `${timestamp} | ${message} |commentLength:${commentLength}| cursor:${cursor}| urlPost:${urlPost}| has_more:${has_more}`;
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
        new transports.File({ filename: 'crawlapi/combinedreply.log' }),

    ]
  });

const  tiktokProfile = async()=>{
    try {
        const queueCommentReply = new Queue('queueCommentReplyCrawlApi','redis://127.0.0.1:6379')
        await delay(1000)
        const browser = await puppeteer.launch({
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
     
        const page = await browser.newPage({});
        await page.setBypassCSP(true)
        await page.goto("https://www.tiktok.com/",{})
        await delay(5000)
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
    queueCommentReply.process(2,async (job,done)=>{
      
        try {     
        
        await delay(3000)

        let conditionBreak = 0

        for(let j=0;j<100000;j++){
            const PARAMS = {
                WebIdLastTime: 1715161528,
                aid: 1988,
                app_language: `ja-JP`,
                app_name: `tiktok_web`,
                browser_language: `en-US`,
                browser_name: `Mozilla`,
                browser_online: true,
                browser_platform: `Win32`,
                browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
                channel: `tiktok_web`,
                comment_id: job.data.cid,
                cookie_enabled: true,
                count: 3,
                current_region: `JP`,
                cursor: j*3,
                device_id: 7366562589700539911,
                device_platform: `web_pc`,
                enter_from: `tiktok_web`,
                focus_state: true,
                fromWeb: 1,
                from_page: `video`,
                history_len: 3,
                is_fullscreen: false,
                is_page_visible: true,
                item_id: job.data.vid,
                os: `windows`,
                priority_region:`` ,
                referer:`` ,
                region: `VN`,
                screen_height: 1080,
                screen_width: 1920,
                tz_name: `Asia/Bangkok`,
                webcast_language: `en`,
            
                };
        try {
            const qsObject = new URLSearchParams(PARAMS) ;
            const qs = qsObject.toString();
            let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            const unsignedUrl = `https://www.tiktok.com/api/comment/list/reply/?${qs}`;
            let verify_fp = await generateVerifyFp();
            let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
            let token = await page.evaluate(`generateSignature("${newUrl}")`);
            let signed_url = newUrl + "&_signature=" + token;
            let queryString = new URL(signed_url).searchParams.toString();
            let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
            signed_url += "&X-Bogus=" + bogus;
            const xTtParams = await xttparams(queryString)
            const res = await testApiReq({userAgent,signed_url})
            const { data } = res;
            const {comments,cursor,has_more,status_code,status_msg} = data
            logger.info({timestamp,message:`comment:${job.data.cid}`,commentLength:comments?.length,cursor:cursor,has_more,urlPost:job.data.vid,status_code,status_msg})
            if(data.comments!=undefined){
                data.comments.map(async(item)=>{
                        let insert = new schemacommentreply({"text":item.text,"reply_id":item.reply_id,"vid":item.aweme_id,"cid":item.cid})
                        await insert.save()
                    }                         
                )
            }
            if(has_more==0||has_more==undefined){
                conditionBreak++
            }
            if(conditionBreak==3){
                break
            }
        } catch (error) {
            logger.info({timestamp,message:`comment:${job.data.cid}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.vid,status_code:undefined,status_msg:undefined})
        }
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
        
        } catch (error) {
       
            logger.info({timestamp,message:`comment:${job.data.cid}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.vid,status_code:undefined,status_msg:undefined})
        }
        try {
            // await page.close()
            // await browser.close()
        } catch (error) {
            logger.info({timestamp,message:`comment:${job.data.cid}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.vid,status_code:undefined,status_msg:undefined})
        }
        done();  
    })
    } catch (error) {
        logger.info({timestamp,message:`comment:undefined| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:undefined,status_code:undefined,status_msg:undefined})

    }
    
}

tiktokProfile()  



async function xttparams(query_str) {
    query_str += "&is_encryption=1";
    const password = "webapp1.0+202106";
    // Encrypt query string using aes-128-cbc
    const cipher = createCipheriv("aes-128-cbc", password, password);
    return Buffer.concat([cipher.update(query_str), cipher.final()]).toString(
        "base64"
    );
}
async function testApiReq({ userAgent, signed_url}) {
    const options = {
      method: "GET",
      timeout: 50000,

      headers: {
        "user-agent": userAgent,
      },
      url: signed_url,
    };
    return axios(options);
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