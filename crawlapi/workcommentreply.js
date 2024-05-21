import puppeteer from 'puppeteer-extra';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Queue from 'bull';
import schemacomment from './schema/schemacomment.js';
const queueComment = new Queue('queueCommentCrawlApi','redis://127.0.0.1:6379')
import delay from 'delay'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import cookie from "./cookiedefault.json" assert { type: 'json' }
import schemacommentreply from './schema/schemacommentreply.js';
puppeteer.use(StealthPlugin());
const  tiktokProfile = async()=>{


queueComment.process(1,async (job,done)=>{
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
            '--user-agent="5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"'
            ],
            ignoreHTTPSErrors: true,
            executablePath:executablePath(),  
    });
    const page = await browser.newPage({});
    await page.setCookie(...cookie[1][4])

    await page.setBypassCSP(true)
    await page.goto("https://www.tiktok.com",{
    })
    await delay(3000)
    page.goto(job.data.urlVideo,{
    })
    const urlRes = await page.waitForRequest(req=>{
        return req.url().includes("https://www.tiktok.com/api/comment/list")
    })
    await page.waitForNavigation({
    });
    const msToken = urlRes.url().split('&')[32].slice(8,1000000000000)
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
    let conditionBreak = 0
    let tiktok_id_video = job.data.urlVideo.slice(job.data.urlVideo.indexOf('video')+6,job.data.urlVideo.indexOf('video')+6+19)
    for(let i=0;i<10000;i++){
        let payload = {
            aweme_id: tiktok_id_video,
            cursor: i*20,
            count: 20,
            msToken: msToken,
            aid: 1988,
            app_language: "ja-JP",
            app_name: "tiktok_web",
            browser_language: "en-US",
            browser_name: "Mozilla",
            browser_online: true,
            browser_platform: "Win32",
            browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            channel: "tiktok_web",
            cookie_enabled: true,
            current_region: "JP",
            device_id: "7242972052013434386",
            device_platform: "web_pc",
            from_page: "video",
            os: "windows",
            priority_region: "VN",
            referer: '',
            region: "VN",
            screen_height: 1080,
            screen_width: 1920,
            webcast_language: "en",
        }
        const qsObject = new URLSearchParams(payload) ;
        const qs = qsObject.toString();
        let unsignUrl = `https://www.tiktok.com/api/comment/list/?${qs}`
        let verify_fp = "verify_lj720og1_ONJPD8Y8_fmGX_4iwe_8rRB_UzTxV9tjNrKV";
        let newUrl = unsignUrl + "&verifyFp=" + verify_fp;
        
        let token = await page.evaluate(()=>{
            return generateSignature("${newUrl}")
        });
        let signed_url = newUrl + "&_signature=" + token;
        let userAgent = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        let queryString = new URL(signed_url).searchParams.toString();
        let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
        signed_url += "&X-Bogus=" + bogus;
        const res = await testApiReq({userAgent},signed_url,job.data.urlVideo)
        const { data } = res;
        try {
            data.comments.map(async(x)=>{
                let insert = new schemacomment({"text":x.text,"cid":x.cid,"reply_comment_total":x.reply_comment_total,"vid":tiktok_id_video})
                await insert.save()
            })
        } catch (error) {
            conditionBreak++
            console.log(error)
            await delay(5000)
        }
        if(conditionBreak>5){
            break;
        }
    }
    const replyComment = await schemacomment.find({vid:tiktok_id_video,reply_comment_total:{"$gte":1}})
    for(let j=0;j<replyComment.length;j++){
        for(let i=0;i<1000;i++){
            let payload = {
                cursor: i*3,
                count: 3,
                msToken: msToken,
                comment_id:replyComment[j].cid,
                item_id:replyComment[j].vid,
                aid: 1988,
                app_language: "ja-JP",
                app_name: "tiktok_web",
                browser_language: "en-US",
                browser_name: "Mozilla",
                browser_online: true,
                browser_platform: "Win32",
                browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                channel: "tiktok_web",
                cookie_enabled: true,
                current_region: "JP",
                device_id: "7242972052013434386",
                device_platform: "web_pc",
                from_page: "video",
                os: "windows",
                priority_region: "VN",
                referer: '',
                region: "VN",
                screen_height: 1080,
                screen_width: 1920,
                webcast_language: "en",
            }
            let qsObject = new URLSearchParams(payload) ;
            let qs = qsObject.toString();
            let unsignUrl = `https://www.tiktok.com/api/comment/list/reply/?${qs}`
            let verify_fp = "verify_lj720og1_ONJPD8Y8_fmGX_4iwe_8rRB_UzTxV9tjNrKV";
            let newUrl = unsignUrl + "&verifyFp=" + verify_fp;
            
            let token = await page.evaluate(()=>{
                return generateSignature("${newUrl}")
            });
            let signed_url = newUrl + "&_signature=" + token;
            let userAgent = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
            let queryString = new URL(signed_url).searchParams.toString();
            let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
            signed_url += "&X-Bogus=" + bogus;
            const res = await testApiReq({userAgent},signed_url,job.data.urlVideo)
            const { data } = res;
            data.comments?.map(async(x)=>{
                let insert = new schemacommentreply({"text":x.text,"reply_id":x.reply_id,"vid":tiktok_id_video})
                await insert.save()
            })
            if(data.has_more==0){
                break
            }
            await delay(1000)

        }  
    }
        
  
    try {
        await page.close()
        await browser.close();
       } catch (error) {
    }
    console.log('done')
    done();   
})
}
tiktokProfile()  
async function testApiReq({ userAgent }, url,referer) {
const options = {
    timeout: 10000,
    method: "GET",
    headers: {
    "user-agent": userAgent,
    "referer": referer // !!! Referer is required
    },
    url: url,
};
return axios(options);}