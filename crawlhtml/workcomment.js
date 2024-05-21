import domComment from './domcomment.json' assert { type: 'json' }
import puppeteer from 'puppeteer-extra';
import Queue from 'bull';
import schemacomment from './schema/schemacomment.js';
const queueComment = new Queue('queueCommentCrawlHTML','redis://127.0.0.1:6379')
import cookie from "./cookiedefault.json" assert { type: 'json' }
import delay from 'delay';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
puppeteer.use(StealthPlugin());

const  tiktokProfile = async()=>{
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
          ],
          ignoreHTTPSErrors: true,
          executablePath:executablePath()

    });
    queueComment.process(1,async (job,done)=>{
        const totalCommentCrawl =5000;
        var timeWait = totalCommentCrawl;
        var condtionLoopMutation = false
        const customBrowser = await getBrowser(browser)
        const page = await customBrowser.newPage();
        await page.setCookie(...cookie[1][2]) 
        var domTiktok = domComment.dom
        page.setViewport({width: 1300, height: 1080});
        var totalComment = 0
        // try {
            await page.setRequestInterception(true);
            page.on('request', request => {
                if (
                    request.resourceType()=='image'
                   
                ){
                    request.abort();
                }else{
                    request.continue();
                } 
            });
          
            await page.goto(job.data.urlVideo)
            await delay(5000)
            page.on('response',async(response)=>{
                if(response.url().includes('https://www.tiktok.com/api/comment/list')){
                    try {
                        let text = await response?.text()
                        let textConvert = JSON.parse(text)
                        let comments = textConvert.comments.map(comment=>{
                            return {
                                content:comment.text
                            }
                        })
                        totalComment = totalComment + comments.length
                        comments.map(async(x)=>{
                            let insert = new schemacomment(x)
                            await insert.save()
                        })
                        condtionLoopMutation = true
                    } catch (error) { 
                        console.log(error)
                        condtionLoopMutation = true

                    }
                    
                }
            })
            await delay(10000)
            for(let i=0;i<=100000;i++){
                    for(let i=0;i<timeWait/100;i++){

                        if(condtionLoopMutation == true){
                            condtionLoopMutation = false
                            break;
                        }
                        await delay(100)
                        if(i==timeWait/2||i==timeWait/4 ||i==timeWait/6||i==timeWait/8 ||i==timeWait/10||i==timeWait/12 ||i==timeWait/14||i==timeWait/16 ||i==timeWait/18||i==timeWait/20 ){
                            await page.evaluate( (domTiktok) => {
                                                    document.querySelector(domTiktok.elementLastChildScroll).scrollIntoView()
                                                },domTiktok);  
                            await page.evaluate( () => {
                                scrollBy(0,-200)
                            }); 

                            await page.evaluate( () => {
                                scrollBy(0,200)
                            }); 

                        }
                        if(i==timeWait/3||i==timeWait/5 ||i==timeWait/7||i==timeWait/9 ||i==timeWait/11||i==timeWait/13 ){
                            
                            await page.evaluate( () => {
                                scrollBy(0, -500)
                            }); 
                            await page.evaluate( () => {
                                scrollBy(0, document.body.scrollHeight*1000000)
                            }); 

                        }
                        if(i==timeWait-1){
                            var conditionBreakScroll = true
                        }
                    }
                    if(conditionBreakScroll==true || totalComment > totalCommentCrawl){
                        break;
                    }
                    await page.evaluate( () => {
                        scrollBy(0, document.body.scrollHeight*1000000)
                    });
                
            }
        try {
            await page.close()
        } catch(error) {  
            console.log(error)
        } 
        done();   
    })
}
tiktokProfile()  
const clickMoreReplies = async(domTiktok,page)=>{
    await page.evaluate(async (domTiktok) => {

        async function wait(ms) {
            return new Promise(r => setTimeout(r, ms)).then(() => "Yay");
        }
        return (async () => {
            const array =  document.querySelectorAll(domTiktok.elementMoreReplies)
            for await (let x of array) {
                let fatherx = x.parentNode.parentNode
                await x.click(); 
                for(let i=0;i<60;i++){

                    let conditionBreak1 = fatherx.querySelector(domTiktok.elementLoading)
                    if(conditionBreak1==null){
                        break;
                    }
                    await wait(1000)
                }    
            }

        })();
    },domTiktok);
}
const clickViewMore = async(domTiktok,page)=>{   
    await page.evaluate(async (domTiktok) => {
        async function wait(ms) {
            return new Promise(r => setTimeout(r, ms)).then(() => "Yay");
        }
        return (async () => {  
            const array = document.querySelectorAll(domTiktok.elementFatherViewMore)
            for await (let x of array) {
                var conditinBreakViewMore = true
                let fatherx = x.parentNode
                while(conditinBreakViewMore){
                    if(x.querySelector(domTiktok.elementViewMore)!=null){
                        await x.querySelector(domTiktok.elementViewMore).click(); 
                        for(let i=0;i<60;i++){
                            let conditionBreak = x.querySelector(domTiktok.elementViewMore)
                            let conditionBreak1 = fatherx.querySelector(domTiktok.elementLoading)
                            if(conditionBreak1==null){
                                break;
                            }
                            if(conditionBreak==null&&conditionBreak1==null){
                                conditinBreakViewMore=false;
                                break;
                            }
                            await wait(500)
                        }  
                    }else{
                        conditinBreakViewMore = false
                    }
                }
            }
        })();
    },domTiktok);
}
function getBrowser(browser) {
    return new Promise(function (resolve, reject) {
        if (browser !== undefined && browser.isConnected()) {
            resolve(browser);
        }
        else {
            puppeteer
                .connect({
                browserWSEndpoint: "ws://chrome_browser:3000/"
            })
                .then(function (opened_browser) {
                browser = opened_browser;
                resolve(opened_browser);
                console.log("Browser is open");
            })
                .catch(function (err) {
                console.log("ERROR lunching browser: ", err);
                reject(err);
            });
        }
    });
}

