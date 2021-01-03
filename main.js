
const Discord = require('discord.js')

const BOT = "GoodBot";

const client = new Discord.Client();
const PREFIX = "!";
const BOTNAME = /\bgoodbot!?\b/i;
const HELLOBOT = /hello,? goodbot/i;
const NIGHTBOT = /goodnight,? goodbot!?/i;
const HIBOT = /hi,? goodbot/i;
const BADBOT = /bad bot/i;
const WHATIS = /goodbot,? what is\??/i;

//  Server for scraping

const http = require('http');
const PORT = 3000;
const axios = require('axios').default;
const cheerio = require('cheerio');
//const rp = require('request-promise');

runGetStuff = (username, category, message) => {

    axios
        .get(`https://playoverwatch.com/en-us/career/pc/TheZohan-1576/`)
        .then((response) => {
            const html = response.data;
            //console.log(response.data)
            const $ = cheerio.load(html);
            //let itemList = [];
            let tankSkill = $('.competitive-rank-level').first().text();
            //console.log(message)
            message.channel.send(`${username}'s ${category} skill is ${tankSkill}`);

            //console.log(itemList)
        })
        .catch((error) => {
            console.error(error)
    });
    
}

getRating = (username, category, response) => {
    //console.log(username, category, response);
}


client.once('ready', () => {
    console.log('GOOD BOT is here.')
})

client.on('message', (message) => {
    if (message.author.bot) return
    if (message.content === "zohan, why are you the most successful streamer?") {
        message.reply('mines');
    }

    if (message.content === "GoodBot, what is Zohan's chess ELO?") {
        message.reply("Zohan's chess elo is 554");
    }

    if (message.content.match(HELLOBOT) && message.content.match(HELLOBOT).length === 1) {
        message.channel.send('Hello, ' + message.author.username);
    }
    
    if (message.content.match(HIBOT) && message.content.match(HIBOT).length === 1) {
        message.channel.send('Hi, ' + message.author.username);
    }
    if (message.content.match(NIGHTBOT) && message.content.match(NIGHTBOT).length === 1) {
        message.channel.send('Goodnight!');
    }
    if (message.content.match(BADBOT) && message.content.match(BADBOT).length === 1) {
        message.channel.send(':(');
    }
    if (message.content.match(BOTNAME) && message.content.match(BOTNAME).length === 1 && (message.content.length === 7
        || message.content.length === 8)) {
        message.channel.send('THAT IS ME');
    }

    if (message.content.substring(0, (BOT.length + 10)).match(WHATIS)) {
        let words = message.content.split(/\W+/);
        if (words.length > 3) {
            if (words.length > 4) {
                console.log(words);
                runGetStuff("TheZohan", "tank", message)
                // let username = words[3];
                // let category;
                // if (words[4].length < 3) {
                //     category = words[5]
                // } else {
                //     category = words[4]
                // };
                // switch (category) {
                // case "rapid":
                //     getRating(username, category);
                //     break;
                // case "blitz":
                //     break;
                // case "bullet":
                //     break;
                // case "dailey":
                //     break;
                // default: 
                //     message.channel.send('I couldn\'t read the time control, what was that?');
                // }
            }   else {
                message.channel.send('Sorry, GoodBot didn\'t understand what you were trying to ask.');
            }
        } else {
            message.channel.send('What is what?');
        }
    }

    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content.trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if (CMD_NAME === 'kick') {
            message.channel.send('Kicked the user');
        }
    }
})

//runGetStuff("thezohansc", "rapid");

client.login('Nzk1MTcyMDE2MTcyODI2Njc1.X_Ffpg.lQWgRUGb2Iy1gY5fYNNAemPeuCU');