const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const axios = require('axios').default;
const client = new Discord.Client();

var prefix = config.prefix;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('ready',() => {
    client.user.setActivity(`${prefix}help`,{type:"PLAYING"})
});

client.on('message',message => {
    if (message.content.startsWith(`${prefix}`)){
        if (message.content.startsWith(`${prefix}joke `)) {
            var param=message.content.slice(6);
            if (param.length<=3){
                axios.get(`http://api.icndb.com/jokes/${param}`)
                .then(response => 
                    {if (response.data.type==='success') {
                        message.channel.send(response.data.value.joke)
                    }})
                .catch();
            } else {
                axios.get(`http://api.icndb.com/jokes/random?limitTo=[${param}]`)
                .then(response => 
                    {if (response.data.type==='success') {
                        message.channel.send(response.data.value.joke)
                    }})
                .catch();
            } 
        }
        if (message.content.startsWith(`${prefix}prefix`)) {
            var newPrefix=message.content.slice(8);
            if (newPrefix.length==1){
                config.prefix=newPrefix; 
                let configJson = JSON.stringify(config);
                fs.writeFile('./config.json',configJson, (erreur) => {
                    if (erreur) console.log(erreur);
                    else message.channel.send (`Prefix has been changed to ${newPrefix}`);
                })
                prefix = config.prefix;
            } else {
                message.channel.send(`Prefix is still ${prefix}, prefix suggested not correct`);
            }
            client.user.setActivity(`${prefix}help`,{type:"PLAYING"});
        }
        switch (message.content) {
            case `${prefix}joke` :
                axios.get('http://api.icndb.com/jokes/random')
                    .then(response => 
                        {if (response.data.type==='success') {
                            message.channel.send(response.data.value.joke)
                        }})
                    .catch();
                break;
            case `${prefix}jokeCount` :
                axios.get('http://api.icndb.com/jokes/count')
                    .then(response => 
                        {if (response.data.type==='success') {
                            message.channel.send(response.data.value)
                        }})
                    .catch();
                    break;
            case `${prefix}jokeCategories` :
                axios.get('http://api.icndb.com/categories')
                    .then(response => 
                        {if (response.data.type==='success') {
                            message.channel.send(response.data.value)
                        }})
                    .catch();
                    break;
            case `${prefix}ping` :
                var ping = `${Date.now() - message.createdTimestamp} ms`;
                message.channel.send(`Ponged after ${ping}`);
                break;
            case `${prefix}help` :
                message.channel.send(`**${prefix}help** - Displays the help menu \n**${prefix}joke** - returns a joke from Chuck Norris API\n**${prefix}jokeCount** - returns the number of jokes of Chuck Norris API\n**${prefix}joke [category]** - returns a joke from a spiecified category\n**${prefix}jokeCategories** - returns the available categories\n**${prefix}joke [id]** - returns a joke by the specified id\n**${prefix}ping** - returns a message with the latency\n**${prefix}prefix [prefix]** - changes the prefix of the bot commands
                `);                
                break;
            default :
                break;
        }   
    }
});

client.login(config.token);

