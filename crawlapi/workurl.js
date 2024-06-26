import puppeteer from 'puppeteer-extra';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'hpagent';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Queue from 'bull';
import schemaurl from './schema/schemaurl.js';
import delay from 'delay'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import {createCipheriv } from 'crypto'
import moment from 'moment';
import fs from 'fs/promises'
import device_id_list from './deviceid.json'assert { type: 'json' }
import { createLogger, format, transports } from 'winston'
import proxyList from './proxy.json'  assert { type: 'json' }
puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = format;
const myFormat = printf(({ message,timestamp,statusText,proxy,job}) => {
    return `${timestamp} | statusText:${statusText}| job:${job}|proxy:${proxy.proxy}| ${message}`;
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
        new transports.File({ filename: 'crawlapi/combinedurl.log' }),

    ]
  });

export const  workurl = async(job,page)=>{
    try {
        let random_index_device = Math.floor(Math.random() * device_id_list.length);
        let device_id = device_id_list[random_index_device]
        let tiktok_id_video = job.data.urlPost.slice(job.data.urlPost.indexOf('video')+6,job.data.urlPost.indexOf('video')+6+19)
            const PARAMS = {
                aid: 1988,
                app_language: "vi-VN",
                app_name: "tiktok_web",
                browser_language: "en-US",
                browser_name: "Mozilla",
                browser_online: true,
                browser_platform: "Win32",
                browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                channel: "tiktok_web",
                
                cookie_enabled: true,
                coverFormat: 2,
                device_id: device_id,
                device_platform: "web_pc",
                focus_state: true,
                from_page: "video",
                history_len: 3,
                is_fullscreen: false,
                is_page_visible: true,
            
            
                itemId: tiktok_id_video,
                language: "vi-VN",
                os: "windows",
                priority_region: "",
                referer: "",
                region: "VN",
                screen_height: 1080,
                screen_width: 1920,
                tz_name: "Asia/Saigon",
                webcast_language: "vi-VN",
                };
                const qsObject = new URLSearchParams(PARAMS) ;
                const qs = qsObject.toString();
                let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                const unsignedUrl = `https://www.tiktok.com/api/item/detail/?${qs}`;
                let verify_fp = await generateVerifyFp();
                let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
                let token = await page.evaluate(`generateSignature("${newUrl}")`);
                let signed_url = newUrl + "&_signature=" + token;
                let queryString = new URL(signed_url).searchParams.toString();
                let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
                signed_url += "&X-Bogus=" + bogus;
                const xTtParams = await xttparams(queryString)
                for(let j=0;j<100;j++){
                    let random_index = Math.floor(Math.random() * proxyList.length);
                    var proxy = proxyList[random_index]
                    try {
                        var res = await testApiReq({userAgent,xTtParams,signed_url,proxy,referer:job.data.urlPost})
                        var{data ,statusText} = res
                
                        if(data.length!=0){
                            break
                        }
                        logger.info({timestamp,message:`comment1url:${tiktok_id_video}:reroll:${Object.keys(data).length}`,proxy,statusText,job:job.data})
                        await delay(3000)
                    } catch (error) {
                        await delay(500)
                        console.log(error)
                        logger.info({timestamp,message:`comment2url:${tiktok_id_video}:reroll:${error}`,proxy,job:job.data})
                    }
                
                }    
                
                const {itemInfo} = data ?? {}
                const {itemStruct} = itemInfo
                logger.info({timestamp,message:`comment3url:${tiktok_id_video}:${Object.keys(data).length}`,proxy})
                if(itemInfo!=undefined){
                    var dataUrl = {
                        id:`${itemStruct.author.id}_${itemStruct.id}`,
                        type:"titkokTopic",
                        master:"master202401",
                        siteId:itemStruct.author.id,
                        siteName:itemStruct.author.uniqueId,
                        insertedDate:itemStruct.createTime,
                        publishedDate:itemStruct.createTime,
                        url: `https://www.tiktok.com/@${itemStruct.author.uniqueId}/video/${itemStruct.id}`,
                        author: itemStruct.author.uniqueId,
                        authorId: itemStruct.author.id,
                        title: itemStruct.contents[0].desc.replace(/\r?\n/g, " ").trim(),
                        description: itemStruct.suggestedWords?.toString()?.replace(/\r?\n/g, " ").trim(),
                        content: itemStruct.desc.replace(/\r?\n/g, " ").trim(),
                        delayCrawler: "0",
                        likes: itemStruct.stats.diggCount,
                        shares: itemStruct.stats.shareCount,
                        comments: itemStruct.stats.commentCount,
                        views: itemStruct.stats.playCount,
                        interactions: itemStruct.stats.diggCount+itemStruct.stats.shareCount+itemStruct.stats.commentCount+itemStruct.stats.playCount,
                        delayMongo: "0",
                        delayEs: "0",
                    }
                    
                            // let insert = new schemaurl({
                            //     id:`${itemStruct.author.id}_${itemStruct.id}`,
                            //     type:"titkokTopic",
                            //     master:"master202401",
                            //     siteId:itemStruct.author.id,
                            //     siteName:itemStruct.author.uniqueId,
                            //     insertedDate:itemStruct.createTime,
                            //     publishedDate:itemStruct.createTime,
                            //     url: `https://www.tiktok.com/@${itemStruct.author.uniqueId}/video/${itemStruct.id}`,
                            //     author: itemStruct.author.uniqueId,
                            //     authorId: itemStruct.author.id,
                            //     title: itemStruct.contents[0].desc.replace(/\r?\n/g, " ").trim(),
                            //     description: itemStruct.suggestedWords.toString.replace(/\r?\n/g, " ").trim(),
                            //     content: itemStruct.desc.replace(/\r?\n/g, " ").trim(),
                            //     delayCrawler: "0",
                            //     likes: itemStruct.stats.diggCount,
                            //     shares: itemStruct.stats.shareCount,
                            //     comments: itemStruct.stats.commentCount,
                            //     views: itemStruct.stats.playCount,
                            //     interactions: itemStruct.stats.diggCount+itemStruct.stats.shareCount+itemStruct.stats.commentCount+itemStruct.stats.playCount,
                            //     delayMongo: "0",
                            //     delayEs: "0",
                            
                            // })
                            // await insert.save()
        
                        // replace(/\r?\n/g, " ").trim()
            
                
                }
            
            await delay(3000)  
    
    } catch (error) {
            console.log(error)

            logger.info({timestamp,message:`comment4url:${job.data}| ${error}`})
        
    }    
            
                // try {
                //     await page.close()
                //     await browser.close()
                // } catch (error) {
                //     logger.error({timestamp,message:`comment5:${job.data.urlVideo}| ${error}`,commentLength:undefined,cursor:undefined,has_more:undefined,urlPost:job.data.urlVideo,status_code:undefined,status_msg:undefined,proxy:proxy.proxy})
                //     done();     
                // }
           
                return dataUrl 
                
 
 
   
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
