const keyClass = require('./key.js');

const Discord = require('discord.js');

let keyClassX = new keyClass();

const BOT = "GoodBot";

const client = new Discord.Client();
const PREFIX = "!";
const BOTNAME = /\bgoodbot!?\b/i;
const HELLOBOT = /hello,? goodbot/i;
const NIGHTBOT = /goodnight,? goodbot!?/i;
const HIBOT = /hi,? goodbot/i;
const BADBOT = /bad bot/i;
const WHATIS = /goodbot,? what is\??/i;

//  OW roles

const tank = /tank/i
const support = /support/i
const damage = /damage/i
const allOW = /all/i

//  Server for scraping

const http = require('http');
const PORT = 3000;
const axios = require('axios').default;
const cheerio = require('cheerio');
//const rp = require('request-promise');

runGetStuff = (username, category, code, message) => {

    axios
        .get(`https://playoverwatch.com/en-us/career/pc/${username}-${code}/`)
        .then((response) => {
            const html = response.data;
            //console.log(response.data)
            const $ = cheerio.load(html);
            //let itemList = [];
            let testing = $('.u-align-center').first().text();
            if (testing === "Profile Not Found") {
                console.log("not found")
                message.channel.send(`GoodBot could not find ${username}'s profile.`);
            } else {
                console.log("found")
                let results = $('.competitive-rank').children().length
                let tankSkillString = `GoodBot could not find ${username}'s Tank Skill Rating... maybe ${username} is not ranked?`;
                let supportSkillString = `GoodBot could not find ${username}'s Support Skill Rating... maybe ${username} is not ranked?`;
                let damageSkillString = `GoodBot could not find ${username}'s Damage Skill Rating... maybe ${username} is not ranked?`;
                let tankSkillRating = -1;
                let supportSkillRating = -1;
                let damageSkillRating = -1;
                if (results >= 1) {
                    console.log("results found")

                    let i = 0;
    
                    $('.competitive-rank').children().each(function(i, item) {
                        let foundSkillRow = $(".competitive-rank-level", item).parent().html().split('data-ow-tooltip-text')[1];
                        let foundSkill = foundSkillRow.substring(2, foundSkillRow.indexOf(">") - 1).trim();
                        let foundRating = $(this).find('.competitive-rank-level').html();
                        switch (foundSkill) {
                            case "Tank Skill Rating":
                                tankSkillRating = foundRating;
                                tankSkillString = `Goodbot finds ${username}'s OW Tank Skill Rating to be ${tankSkillRating}.`;
                                break;
                            case "Damage Skill Rating":
                                damageSkillRating = foundRating;
                                damageSkillString = `Goodbot finds ${username}'s OW Damage Skill Rating to be ${damageSkillRating}.`;
                                break;
                            case "Support Skill Rating":
                                supportSkillRating = foundRating;
                                supportSkillString = `Goodbot finds ${username}'s OW Support Skill Rating to be ${supportSkillRating}.`;
                                break;
                        }
                    });

                } else {
                    console.log("no results");
                }
                if (tankSkillRating === -1 && damageSkillRating === -1 && supportSkillRating === -1) {
                    message.channel.send(`While GoodBot found ${username}'s profile, GoodBot was not able to find any stats on ${username}.`);
                } else {
                    if (category.match(tank)) {
                        message.channel.send(tankSkillString);
                    }
                    if (category.match(damage)) {
                        message.channel.send(damageSkillString);
                    }
                    if (category.match(support)) {
                        message.channel.send(supportSkillString);
                    }
                    if (category.match(allOW)) {
                        message.channel.send(`${tankSkillString}  ${damageSkillString}  ${supportSkillString}`);
                    }
                }
                //console.log(words);
            }
            //console.log($('data-ow-tooltip-text').first())
            //let tankSkill = $('.competitive-rank-level').first().text();
            //console.log(message)
            //message.channel.send(`${username}'s ${category} skill is ${tankSkill}`);

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
                runGetStuff("TheZohan", "tank", message);
            }   else {
                message.channel.send('Sorry, GoodBot didn\'t understand what you were trying to ask.');
            }
        } else {
            message.channel.send('What is what?');
        }
    }

    if (message.content.substring(0, 2) === "!O") {
        let words = message.content.split(" ");
        let usernameCode = words[1].split("#");
        if (words.length >= 3) {
            if (usernameCode.length >= 2) {
                let username = usernameCode[0];
                let code = usernameCode[1];
                let role = words[2];

                runGetStuff(username, role, code, message);
            } else {
                message.channel.send('Goodbot needs a code and username in order to look up stats!  Ex. TheZohan#1234');
                //break;
            }
        } else {
            message.channel.send('Goodbot needs a username, code, and SR category in order to look up stats!  Ex. !O TheZohan#1234 Tank');
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

//let getKeyClass = keyClassM.getKeyClass();

const key = (keyClassX.getKeyClass())();

console.log(key);

client.login(key);