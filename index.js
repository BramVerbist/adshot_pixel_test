import Express from "express";
import Jimp from "jimp";
import formData from "express-form-data";
import fetch from "node-fetch";


const app = Express();
const port = 8080;
app.use(Express.json());
app.use(Express.urlencoded({extended: false}));
app.use(formData.parse());
app.use(Express.static('static'));
app.listen(port);


const STREAMER_NAME = "rafzegers";
const TWITCH_CLIENT_ID = ""; //  eg. '123456789abcdefghijklmnopqrstu'
const TWITCH_AUTHORIZATION = ""; // eg. 'Bearer 123456789abcdefghijklmnopqrstu'


// blabla db
let browser_info_id = 1;
let browser_info = [{"id":1,"foto":"https:\/\/861555.smushcdn.com\/1888099\/wp-content\/uploads\/2019\/12\/ADSHOT-LOGO-pNG-3-scaled-lightred-1.png","locatie":"BR","grootte":"600"}]
let user_info = [{"id":0,"twitch":"rafzegers"}];

app.get("/api/browser",(req,res)=> {
    res.json(browser_info);
})

app.post("/api/update",function(req,res) {
    var info = req.body;
    browser_info_id++;
    browser_info = [{"id":browser_info_id,"foto": info["foto"],"locatie":info["locatie"],"grootte":info["grootte"]}];

    //console.log(browser_info);
    console.log(info);

    //res.json(y);
    res.redirect('/update.html');
})


async function load_streamer(streamer_name){

    const twitch_response = await fetch('https://api.twitch.tv/helix/streams/?user_login='+streamer_name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client-id': TWITCH_CLIENT_ID,
            'Authorization': TWITCH_AUTHORIZATION
        },
    }).then(response => { return response.json(); });

    return twitch_response;
}

async function check_streamer(image_url){
    
    const kleur = await Jimp.read(image_url)
    .then(image => {
        return Jimp.intToRGBA(image.getPixelColor(2, 2));
    })


    return (kleur.r > 240 && kleur.g < 20 && kleur.b < 20);
}


app.get("/api/check",async function(req,res) {

    const twitch_result = await load_streamer(STREAMER_NAME);

    if(await twitch_result["data"].length > 0){
        
        const frame_url = await twitch_result["data"][0]["thumbnail_url"].replace('{width}', '1920').replace('{height}', '1080');
        const views = await twitch_result["data"][0]["viewer_count"];

        const frame_oke = await  check_streamer(frame_url);

        res.json({online: true, views: views, screen: frame_url, verified: frame_oke});

    }else{
        res.json({online: false, views: 0, screen: '', verified: false});
    }

})