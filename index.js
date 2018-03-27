'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const mongoose = require('mongoose')
const JSONbig = require('json-bigint')
const staticFile = require('connect-static-file');


var config = require('./config');
var bot = require('./bot.js');
var mongoQuery=require('./mongoquery.js');



const app = express();


app.set('port', (config.web.port));

app.use(bodyParser.text({ type: 'application/json' }));

var path = 'public/privacypolicy.htm';
var path2 = 'public/main.html';
var options = {};
app.use('/privacypolicy.html', staticFile(path, options));


// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
    // res.sendfile('public/main.html', { root: __dirname })
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.status(200).send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');

})

app.post('/webhook', function (req, res) {
    var data = JSONbig.parse(req.body);

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            console.log(pageID);

           // bot = require('./'+pageID+'.js');
            

            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.postback) {
                    receivedPostback(event, pageID);
                }
                else if (event.message && event.message.text) {
                    console.log(event.message);
                    receivedMessage(event, pageID);
                }
                else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});



function receivedMessage(event, pageID) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageEcho = event.is_echo;
    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        messageText = messageText.trim().toLowerCase();

        mongoQuery.insertMongoUserIfNotExist(senderID, pageID);
        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'desi':
                bot.sendDesiMenu(senderID, pageID);
                break;
            case 'desserts':
                bot.sendDessertsMenu(senderID, pageID);
                break;
            case 'frozen':
                bot.sendFrozenMenu(senderID, pageID);
                break;

            default:
                bot.initMessage(senderID, pageID);

        }
    }

}

//////////////////


function receivedPostback(event, pageID) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    //console.log(event.postback);
    var payload = event.postback.payload;

    if (payload == "SHOW_MENU") {
        bot.sendMenu(senderID, pageID);
    }
    else if (payload == "PAYLOAD_CHICKENKARAHI") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 750, "Chicken Karahi");
    }
    else if (payload == "PAYLOAD_MURGHMAKHNI") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 800, "Murgh Makhni");
    }
    else if (payload == "PAYLOAD_CHICKENQUOFTA") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 700, "Chicken Quofta");
    }
    else if (payload == "PAYLOAD_OREOMUFFINS") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 1000, "Oreo Muffins");
    }
    else if (payload == "PAYLOAD_GLAZEDDONUTS") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 650, "Glazed Donuts");
    }
    else if (payload == "PAYLOAD_CINNAMONROLLS") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 700, "Cinnamon Rolls");
    }
    else if (payload == "PAYLOAD_FROZENCHICKENSAMOSA") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 300, "Frozen Chicken Samosas");
    }
    else if (payload == "PAYLOAD_FROZENBEEFKEBABS") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 650, "Frozen Beef Kebabs");
    }
    else if (payload == "PAYLOAD_FROZENCHICKENNUGGETS") {
        mongoQuery.updateMongoUserInvoice(senderID, pageID, 500, "Frozen Chicken Nuggets");
    }
    else if (payload == "SHOW_HELP") {
        bot.sendHelpMenu(senderID, pageID);
    }
    else if (payload == "PAYLOAD_DONE") {
        //  sendTextMessage(senderID, "Thank you for ordering!\nWe will ping you back shortly.", pageID);
        mongoQuery.completeMongoUserInvoice(senderID, pageID);
    }
    else if (payload == "PAYLOAD_CLEAR") {
        mongoQuery.clearMongoUserInvoice(senderID, pageID);
    }

    //console.log("Received postback for user %d and page %d with payload '%s' " +
    // "at %d", senderID, recipientID, payload, timeOfPostback);

}



function attachPersistentMenu() {
    var messageData = {
        persistent_menu: [
            {
                locale: "default",
                composer_input_disabled: true,
                call_to_actions: [
                    {
                        type: "web_url",
                        title: "Your Invoice",
                        url: "http://petershats.parseapp.com/hat-news",
                        webview_height_ratio: "full"
                    },
                    {
                        type: "web_url",
                        title: "Clear Invoice",
                        url: "http://petershats.parseapp.com/hat-news",
                        webview_height_ratio: "full"
                    }
                ]
            },
            {
                locale: "zh_CN",
                composer_input_disabled: false
            }
        ]
    };

    request({
        uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });

}










// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'));

});




