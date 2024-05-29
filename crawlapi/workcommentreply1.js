import puppeteer from 'puppeteer-extra';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Queue from 'bull';
import schemacomment from './schema/schemacomment.js';
import schemacommentreply from './schema/schemacommentreply.js';
import { HttpsProxyAgent } from 'hpagent';

import delay from 'delay'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import {createCipheriv } from 'crypto'
import moment from 'moment';
import fs from 'fs/promises'
import { createLogger, format, transports } from 'winston'
import device_id_list from './deviceid.json'assert { type: 'json' }

import proxyList from './proxy.json'  assert { type: 'json' }
puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = format;
const myFormat = printf(({ message,commentLength,cursor,total,timestamp}) => {
    return `${timestamp} | ${message} |commentLength:${commentLength}| cursor:${cursor}|total:${total}`;
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
        await delay(10000)
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
    queueCommentReply.process(3,async (job,done)=>{
        try {   
            let random_index_device = Math.floor(Math.random() * device_id_list.length);
            let device_id = device_id_list[random_index_device]  
            let conditionBreak = 0
            for(var j=0;j<100000000000000;j++){
                const PARAMS = {
                    // WebIdLastTime: 1715161528,
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
                    device_id: device_id,
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
                for(let i=0;i<500;i++){
                    let random_index = Math.floor(Math.random() * proxyList.length);
                    var proxy = proxyList[random_index]
                    try {
                        var res = await testApiReq({userAgent,xTtParams,signed_url,proxy,referer:job.data.urlVideo})
                        var{data ,statusText} = res
                
                        if(data.length!=0){
                            break
                        }
                        logger.info({timestamp,message:`comment1:${job.data.vid}:${job.data.cid}:reroll:${Object.keys(data).length}`,cursor:j*3,proxy,statusText})
                        await delay(3000)
                    } catch (error) {
                        await delay(500)
                        console.log(error)
                        logger.info({timestamp,message:`comment2:${job.data.vid}:${job.data.cid}:reroll:${error}`,cursor:j*3,proxy})
                    }
                
                }    
                const {comments,cursor,has_more,status_code,status_msg,total} = data ?? {}
                logger.info({timestamp,message:`comment3:${job.data.vid}:${job.data.cid}:${Object.keys(data).length}`,commentLength:comments?.length,cursor:j*3,total,proxy})
                if(data.comments!=undefined){
                    conditionBreak==0
                    data.comments.map(async(item)=>{
                            let insert = new schemacommentreply({"text":item.text.replace(/\r?\n/g, " ").trim(),"reply_id":item.reply_id,"vid":item.aweme_id,"cid":item.cid,postApi:false})
                            await insert.save()
                        }                         
                    )
                }
                if(has_more==0||has_more==undefined||total==0||comments==undefined||comments==null){
                    conditionBreak++
                }
                if(conditionBreak==1){
                    break
                }
            } catch (error) {
                logger.info({timestamp,message:`comment4:${job.data.cid}:${job.data.vid}| ${error}`})
            }
            }         
        } catch (error) {   
            logger.info({timestamp,message:`comment5:${job.data.cid}:${job.data.vid}| ${error}`})
        }
        try {
            // await page.close()
            // await browser.close()
        } catch (error) {
            logger.info({timestamp,message:`comment6:${job.data.cid}:${job.data.vid}| ${error}`})
        }
        done();  
    })
    } catch (error) {
        logger.info({timestamp,message:`comment:undefined| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:undefined,status_code:undefined,status_msg:undefined})

    }
    
}

for(let i=0;i<2;i++){
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