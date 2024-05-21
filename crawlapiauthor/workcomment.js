import puppeteer from 'puppeteer-extra';
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

puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const date = '2024-05-18'
const dateTimeStamp = moment(date).format('X')
const TT_REQ_PERM_URL =
"https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1694080746&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F120.0.0.0%20Safari%2F537.36%22&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7276021344730334727&device_platform=web_pc&focus_state=true&from_page=user&history_len=2&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=&referer=&region=VN&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAAPvTTzV9HF_QEH73vS5A61yx2CYGtiYkhQWlVkVelt5fr029jQVgMF_jYdOHdxo-p&tz_name=Asia%2FBangkok&verifyFp=verify_lm8zy1iy_x0Y0i89Y_01k7_4q5z_8WAT_GV80tpVMQzCh&webcast_language=en&msToken=&X-Bogus=DFSzswVO8ghANCdTt78vTt9WcBJp&_signature=_02B4Z6wo00001Bub5zwAAIDAG5vnP92oXAQbm-OAAGN31c";

const  tiktokProfile = async()=>{
    const queueComment = new Queue('queueUserCrawlApi','redis://127.0.0.1:6379')
  
    queueComment.process(1,async (job,done)=>{
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
        await delay(1000)
        const page = await browser.newPage({});
        const page1 = await browser.newPage({});
        try {
              

        let urlRes = ''
        page.on('request',(req)=>{
            if(req.url().includes("https://www.tiktok.com/api/user/playlist")){
                urlRes = req.url()
            }
        })
        await page.setBypassCSP(true)
        await page.goto(job.data.author,{waitUntil: 'networkidle2'})
    
        let secUid = urlRes.split('&')[27].slice(7,1000000000000)
        // if(secUid=='width=1920'){
        //     secUid = urlRes.split('&')[26].slice(7,1000000000000)
        // }
        console.log(secUid)
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
        let cursor = 0
        await delay(3000)
        for(let i=0;i<10000;i++){
            const PARAMS = {
                WebIdLastTime: 1705655912,
                aid: 1988,
                app_language: `en`,
                app_name: `tiktok_web`,
                browser_language: `en-US`,
                browser_name: `Mozilla`,
                browser_online: `true`,
                browser_platform: `Win32`,
                browser_version: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
                channel: `tiktok_web`,
                cookie_enabled: true,
                count: 35,
                coverFormat: 2,
                cursor: cursor,
                device_id: 7325736252249359890,
                device_platform: `web_pc`,
                focus_state: true,
                from_page: `user`,
                history_len: 2,
                is_fullscreen: false,
                is_page_visible: true,
                language: `en`,
                os: `windows`,
                priority_region: ``,
                referer: ``,
                region: `VN`,
                screen_height: 1080,
                screen_width: 1920,
                secUid: secUid.trim(),
                tz_name: `Asia/Bangkok`,
                webcast_language: `en`

              
           
                };
                const qsObject = new URLSearchParams(PARAMS) ;
                const qs = qsObject.toString();
                let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                const unsignedUrl = `https://www.tiktok.com/api/post/item_list/?${qs}`;
                let verify_fp = await generateVerifyFp();
                let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
                let token = await page.evaluate(`generateSignature("${newUrl}")`);
                let signed_url = newUrl + "&_signature=" + token;
                let queryString = new URL(signed_url).searchParams.toString();
                let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
                signed_url += "&X-Bogus=" + bogus;
                const xTtParams = await xttparams(queryString)
         
                for(let i=0;i<10;i++){
                    await delay(4000)
                    try {
                        await page1.goto(signed_url, { waitUntil: "networkidle0" })
                        const text = await page1.evaluate(()=>{
                            return document.querySelector("body > pre")?.textContent
                        });
                        var data = JSON.parse(text)
                        if(data.itemList!=undefined){
                            break
                        }
                    } catch (error) {
                        console.log('loi for'+error.message)
                    }
                 
                }      
             
              
                const privateAccount =  await page.evaluate(()=>{
                    return document.querySelector('p.css-1ovqurc-PTitle.emuynwa1')?.textContent
                })  

                cursor = data.cursor
                if(cursor==0||privateAccount!=undefined){
                    throw new Error("No Content")
                }
             
                console.log(data.hasMore)
                let conditionBreak = false
                if(data.itemList!=undefined){
                    data.itemList.map(async(item,index)=>{
                        if(item.createTime>dateTimeStamp){
                        
                            if(item.author!=undefined){
                                let insert = new schemacomment({author:job.data.author,"date":item.createTime,urlPost:`https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`})
                                await insert.save()
                            }
                        }else{
                            if(index==data.itemList.length-1){
                                if(item.createTime<dateTimeStamp){
                                    conditionBreak = true
                                }
                            }
                            
                        }      
                    }
                    )
                }
                if(data.hasMore==false||conditionBreak==true){
                    break;
                }
                await delay(2000)  
            }  
        } catch (error) {
            if(error.message=="Navigation timeout of 30000 ms exceeded"||error.message=="Cannot read properties of undefined (reading 'length')"){
                queueComment.add({author:`${job.data.author}`})
                console.log(job.data.author)
            }
            console.log(error.message)
        }
        try {
            await page.close()
            await page1.close()
            await browser.close()
        } catch (error) {
            console.log(error)
        }
        done();  
    })
}
for(let i=0;i<4;i++){
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