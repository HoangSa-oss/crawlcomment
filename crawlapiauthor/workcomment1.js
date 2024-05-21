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
import cookie from './cookiedefault.json' assert { type: 'json' }

puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const date = '2024-05-05'
const dateTimeStamp = moment(date).format('X')
const TT_REQ_PERM_URL =
"https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=1&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36%20Edg%2F107.0.1418.56&channel=tiktok_web&cookie_enabled=true&device_id=7165118680723998214&device_platform=web_pc&focus_state=true&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=RO&referer=&region=RO&screen_height=1440&screen_width=2560&tz_name=Europe%2FBucharest&webcast_language=en&msToken=G3C-3f8JVeDj9OTvvxfaJ_NppXWzVflwP1dOclpUOmAv4WmejB8kFwndJufXBBrXbeWNqzJgL8iF5zn33da-ZlDihRoWRjh_TDSuAgqSGAu1-4u2YlvCATAM2jl2J1dwNPf0_fk9dx1gJxQ21S0=&X-Bogus=DFSzswVYxTUANS/JS8OTqsXyYJUo&_signature=_02B4Z6wo00001CoOkNwAAIDBCa--cQz5e0wqDpRAAGoE8f";

const  tiktokProfile = async()=>{
    const queueComment = new Queue('queueUserCrawlApi','redis://127.0.0.1:6379')
  
    queueComment.process(1,async (job,done)=>{
        try {
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
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                ],
                ignoreHTTPSErrors: true,
                executablePath:executablePath(),  
        });
        await delay(1000)
        const page = await browser.newPage({});
        
        let urlRes = ''
        page.on('request',(req)=>{
            if(req.url().includes("https://www.tiktok.com/api/user/detail")){
                urlRes = req.url()
            }
        })
        await page.setBypassCSP(true)
        await page.goto(job.data.author,{waitUntil: 'networkidle2'})
     
        try {
            // await page.waitForRequest(req=>{
            //     return req.url().includes("https://www.tiktok.com/api/challenge/item_list")
            // })
            // await page.goto("https://www.tiktok.com",{  waitUntil: 'networkidle0'})
    
            // await page.focus("#app-header > div > div.e15qqn8h0 > div > form > input")
            // await page.keyboard.type(job.data.hashtag.trim(),{delay: 100})
            // await delay(1000)
            // await page.keyboard.press('Enter')
            // await delay(3000)
            // console.log(job.data)
            let secUid = urlRes.split('&')[25].slice(7,1000000000000)
            if(secUid=='width=1920'){
                secUid = urlRes.split('&')[26].slice(7,1000000000000)
            }
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
                    WebIdLastTime: 1702044943,
                    aid: 1988,
                    app_language: "en",
                    app_name: "tiktok_web",
                    browser_language: "en-US",
                    browser_name: "Mozilla",
                    browser_online: true,
                    browser_platform: "Win32",
                    browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    channel: "tiktok_web",
                    cookie_enabled: "true",
                    count: 35,
                    coverFormat: 2,
                    cursor: cursor,
                    device_id: 7310227331375826434,
                    device_platform: "web_pc",
                    focus_state: true,
                    from_page: "user",
                    history_len: 2,
                    is_fullscreen: false,
                    is_page_visible: true,
                    language: "en",
                    os: "windows",
                    priority_region: "",
                    referer: "",
                    region: "VN",
                    screen_height: 1080,
                    screen_width: 1920,
                    secUid: secUid.trim(),
                    tz_name: "Asia/Bangkok",
                    webcast_language: "en",
                    msToken: "q23uur02mI5G_8cjMFdIJHjOAUWliStPlMEDELZxHRueFJfkZzE04VtdIM3xQDXLrk_Mk6p2EtcGJyR1_boaVPdDYzW0Q4yitxDfOkVnkJb2s67BLD3g0k9DpU2vz4iB0FjJ6w==",
                  };
                    const qsObject = new URLSearchParams(PARAMS) ;
                    const qs = qsObject.toString();
                    let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
                    const unsignedUrl = `https://www.tiktok.com/api/post/item_list/?${qs}`;
                    
                    let verify_fp = await generateVerifyFp();
                    let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
                    let token = await page.evaluate(`generateSignature("${newUrl}")`);
                    let signed_url = newUrl + "&_signature=" + token;
                    let queryString = new URL(signed_url).searchParams.toString();
                    let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
                    signed_url += "&X-Bogus=" + bogus;
                    const page1 = await browser.newPage({});
                    for(let i =0;i<10;i++){
                        await delay(4000)
                        try {
                            await page1.goto(signed_url, { waitUntil: "networkidle0" })
                            const text = await page1.evaluate(()=>{
                                return document.querySelector("body > pre")?.textContent
                            });
                            var data = JSON.parse(text)
                            if(data.itemList!=undefined){
                                break;
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    cursor = data.cursor
                    console.log(data.itemList.length)
                    let conditionBreak = false
                    if(data.itemList!=undefined){
                        data.itemList.map(async(item,index)=>{
                            console.log(`https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`)
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
                    await page1.close()
                
              
            }  
        } catch (error) {
            // const a = await page.evaluate(()=>{
            //     return document.querySelector("#main-content-challenge > div > main > div > .emuynwa1")?.textContent
            // })
            // if(a!="Couldn't find this hashtag"&&a!="No videos with this hashtag yet"){
            //     queueComment.add({hashtag:`${job.data.hashtag}`})
            //     console.log('add')
            // }
            // console.log({hashtag:`${job.data.hashtag}`})

            console.log(error)

        }
        try {
            await page.close()
            await browser.close()
        } catch (error) {
            
        }
       
   
        } catch (error) {
            if(error.message=="TimeoutError: Navigation timeout of 30000 ms exceeded"){
                queueComment.add({author:`${job.data.author}`})
            }
            console.log(error.message)
        }
        done();  
         
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

async function testApiReq({ userAgent, signed_url }) {
    const options = {
      method: "GET",
      timeout: 50000,

      headers: {
        "user-agent": userAgent,
        // "x-tt-params": xTtParams,
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