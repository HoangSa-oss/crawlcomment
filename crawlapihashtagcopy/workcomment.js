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

puppeteer.use(StealthPlugin());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const date = '2024-01-01'
const dateTimeStamp = moment(date).format('X')
const TT_REQ_PERM_URL_Array =  
[
    "https://www.tiktok.com/api/challenge/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=0.54&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F109.0.0.0%20Safari%2F537.36&challengeID=13187&channel=tiktok_web&cookie_enabled=true&count=30&cursor=30&device_id=7195820289077478917&device_platform=web_pc&focus_state=true&from_page=hashtag&history_len=5&is_fullscreen=false&is_page_visible=true&language=en&os=mac&priority_region=&referer=&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2F404%3FfromUrl%3D%2Fhashtag&screen_height=1120&screen_width=1792&tz_name=Europe%2FBucharest&verifyFp=verify_ldo6d7go_rfalj7WR_Cqtf_4z9G_Aj1J_WSrSUzWZSJ6U&webcast_language=en&msToken=8G5wMuMotboG4hiWsuvDxdQ-VbOZh29r-tMYpFzA56ODNmsk1_RL6xYfiJJvzznY8jK4h4m9CHR2QHJLayqE7lzKFm97L5pmXen7VCGVVIt9s6vU2nNnlmiZW-HTn10YT83WW__OMEaK42s=&X-Bogus=DFSzswVOe5bANjvTS4iHxr7TlqCW&_signature=_02B4Z6wo0000146bL2gAAIDAGk10ZlbQ1n-OmyvAAICC3d",
    "https://www.tiktok.com/api/challenge/item_list/?WebIdLastTime=1697447279&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F109.0.0.0%20Safari%2F537.36&challengeID=13187&channel=tiktok_web&cookie_enabled=true&count=30&coverFormat=2&cursor=30&device_id=7290480495212250625&device_platform=web_pc&focus_state=false&from_page=hashtag&history_len=12&is_fullscreen=true&is_page_visible=true&language=en&os=mac&priority_region=VN&referer=https%3A%2F%2Fwww.tiktok.com%2Fvi-VN%2F&region=VN&root_referer=https%3A%2F%2Fwww.google.com%2F&screen_height=812&screen_width=375&tz_name=Asia%2FSaigon&verifyFp=verify_lnsob08n_QgJiSVSO_LMIX_4Tp0_8sgX_0XmZDbjVfftV&webcast_language=en&msToken=deFnpzMo3UGzTyEX_Vb05rnYQh3oODXl4GEfhQ8z6XnkKHtOUvAaK59yb1ZgaLFCwiexYlIfvuf3OQd4qG7fjrO_OZQCShY_wSHuT_0E-HIRNzprGcSUzAzhYVuRgAHplfCHYhBzxwD26xI=&X-Bogus=DFSzswVYKpbANeIItTqh/09WcBrn&_signature=_02B4Z6wo00001aDo6zwAAIDBoOjrPg.lZzmg6O-AAA0Y43",
    "https://www.tiktok.com/api/challenge/item_list/?WebIdLastTime=1697450264&aid=1988&app_language=vi-VN&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F109.0.0.0%20Safari%2F537.36&challengeID=1614677337213958&channel=tiktok_web&cookie_enabled=true&count=30&coverFormat=2&cursor=30&device_id=7290493316226614786&device_platform=web_pc&focus_state=true&from_page=hashtag&history_len=4&is_fullscreen=true&is_page_visible=true&language=vi-VN&os=mac&priority_region=VN&referer=https%3A%2F%2Fwww.tiktok.com%2Fvi-VN%2F&region=VN&root_referer=https%3A%2F%2Fwww.google.com%2F&screen_height=812&screen_width=375&tz_name=Asia%2FSaigon&verifyFp=verify_lnsq2lmy_gWrfpn2q_Ge2v_4XpH_8B38_x6onFpRN67l0&webcast_language=vi-VN&msToken=CA9Jab5Ta1Hv3Qs7jlsyNXvSOasHLSfvJCl7NpLi_yXeC8SIAt7fkYMewEWmmrh2bbDmO8Dw9ymT9MKCczBasQ2qUqmohyGAPtRLBl-Vrlr2n2KXL40l8APwpGwqXDm40KRLJAQ0qwagaPg=&X-Bogus=DFSzswVYZFhANeIItTq0dz9WcBjC&_signature=_02B4Z6wo000016pWa1AAAIDDqlZrU3ZGUXuqVm.AAI.B8e",
    "https://www.tiktok.com/api/challenge/item_list/?WebIdLastTime=1697450073&aid=1988&app_language=vi-VN&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F109.0.0.0%20Safari%2F537.36&challengeID=1689680134204418&channel=tiktok_web&cookie_enabled=true&count=30&coverFormat=2&cursor=30&device_id=7290492496006071809&device_platform=web_pc&focus_state=true&from_page=hashtag&history_len=4&is_fullscreen=true&is_page_visible=true&language=vi-VN&os=mac&priority_region=VN&referer=https%3A%2F%2Fwww.tiktok.com%2Fvi-VN%2F&region=VN&root_referer=https%3A%2F%2Fwww.google.com%2F&screen_height=812&screen_width=375&tz_name=Asia%2FSaigon&verifyFp=verify_lnspzk23_PzHNwZFf_1mtc_4vQN_9adn_doT4MTGjZuzg&webcast_language=vi-VN&msToken=by7cjM1RvGkdBzBkpiR279T63BYsLerlUxF9NalF92dCOw3MmyUjXP5ykhM5UtEqkCPS_MhHNdEik5J-wXVelYTBOLqbJvX6ybTWxCDTL8MdppDLWl6ll4joyicJIg6bi9n_DARv_6WUhfg=&X-Bogus=DFSzswVYSWXANeIItTq8Pz9WcBJD&_signature=_02B4Z6wo00001RRIU8AAAIDBFEhTwj1JT6EUSFdAACBBe3"
];

const  tiktokProfile = async(TT_REQ_PERM_URL,i)=>{
    const queueComment = new Queue('queueHashtagCrawlApiCopy','redis://127.0.0.1:6379')
    process.setMaxListeners(0);
    queueComment.process(1,async (job,done)=>{
        await delay(i*1000)
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
        await delay(1000)
        const page = await browser.newPage({});
        try {
              
        let urlRes = ''
        page.on('request',(req)=>{
            if(req.url().includes("https://www.tiktok.com/api/challenge/item_list")){
                urlRes = req.url()
            }
        })
        await page.setBypassCSP(true)
        await page.goto(`https://www.tiktok.com/tag/${job.data.hashtag.slice(1,2000)}`,{      waitUntil: 'networkidle2'})
     
         
            const challengeID = urlRes.split('&')[9].slice(12,1000000000000)
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
            let  b = 0
            for(let i=0;i<1000;i++){
                const PARAMS = {
                    aid: "1988",
                    count: 30,
                    challengeID: challengeID,
                    cursor: i*30,
                    cookie_enabled: true,
                    screen_width: 0,
                    screen_height: 0,
                    browser_language: "",
                    browser_platform: "",
                    browser_name: "",
                    browser_version: "",
                    browser_online: "",
                    timezone_name: "Europe/London",
                  };
                    const qsObject = new URLSearchParams(PARAMS) ;
                    const qs = qsObject.toString();
                    let userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
                    const unsignedUrl = `https://www.tiktok.com/api/challenge/item_list/?${qs}`
                    let verify_fp = generateVerifyFp();
                    let newUrl = unsignedUrl + "&verifyFp=" + verify_fp;
                    let token = await page.evaluate(`generateSignature("${newUrl}")`);
                    let signed_url = newUrl + "&_signature=" + token;
                    let queryString = new URL(signed_url).searchParams.toString();
                    let bogus = await page.evaluate(`generateBogus("${queryString}","${userAgent}")`);
                    signed_url += "&X-Bogus=" + bogus;
                    const xTtParams = await xttparams(queryString)
                    for(let i=0;i<10;i++){
                        try {
                          
                            var res = await testApiReq({ userAgent, xTtParams ,TT_REQ_PERM_URL});
                            var { data } = res;
                            if(data.itemList!=undefined&&data.hasMore!=undefined){
                                break
                            }
                          
                        } catch (error) {
                            await delay(4000)
                            console.log('loi for:'+error.message)
                        }
                      
                      
                    }     
                   
                    console.log(data.hasMore)
                    if(data.itemList!=undefined){
                        data.itemList.map(async(item)=>{
                            if(item.createTime>dateTimeStamp){
                                if(item.author!=undefined){
                                    let insert = new schemacomment({hashtag:job.data.hashtag,"date":item.createTime,urlPost:`https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`})
                                    await insert.save()
                                }
                            
                            }       
                        })
                    }
                    if(data.hasMore==false){
                        break;
                    }
                    await delay(3000)
            }  
        } catch (error) {
       
            if(error.message=="Navigation timeout of 30000 ms exceeded"||error.message=="Cannot read properties of undefined (reading 'length')"){
                queueComment.add({hashtag:`${job.data.hashtag}`})
                console.log('add')
            }
         
            console.log(error.message)

        }
        try {
            await page.close()
            await browser.close()
        } catch (error) {
            
        }
       
        done();  
    })
}
for(let i=0;i<2;i++){
    tiktokProfile(TT_REQ_PERM_URL_Array[i],i)  
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
async function testApiReq({ userAgent, xTtParams,TT_REQ_PERM_URL }) {
    const options = {
      method: "GET",
      timeout: 50000,

      headers: {
        "user-agent": userAgent,
        "x-tt-params": xTtParams,
      },
      url: TT_REQ_PERM_URL,
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