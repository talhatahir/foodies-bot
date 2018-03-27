var bot = {};
const request = require('request');
var fbpage = require('./fbpage.js');


////////////////////



/////////////////////

bot.callSendAPI = function(messageData, pageID) {
  console.log(fbpage.accessTokens[pageID]);
  console.log("pageID " + pageID);
  console.log("pageIDAccessToken " + fbpage.accessTokens[pageID]);
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbpage.accessTokens[pageID] },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      //console.log("Successfully sent generic message with id %s to recipient %s",
      // messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

///////////////////////

bot.sendClearWithMenu=function(recipientId, pageID) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Your Bucket has been cleared!",
                        subtitle: "FoodiesBot",
                        image_url: "http://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/brain_food_slideshow/istock_photo_of_assorted_smoothies.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Order from Menu",
                                payload: "SHOW_MENU"
                            }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);

}

//////////////////////

bot.sendHelpMenu=function(recipientId, pageID) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Select an option from below",
                        subtitle: "FoodiesBot",
                        image_url: "http://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/brain_food_slideshow/istock_photo_of_assorted_smoothies.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Clear Bucket",
                                payload: "PAYLOAD_CLEAR"
                            },
                            {
                                type: "postback",
                                title: "Order from Menu",
                                payload: "SHOW_MENU"
                            },
                            {
                                type: "postback",
                                title: "Complete Order",
                                payload: "PAYLOAD_DONE"
                            }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);

}

////////////////


bot.initMessage=function(recipientId, pageID) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Hello, I am your Food Ordering Assistant. How may i help you?",
                        subtitle: "FoodiesBot",
                        image_url: "https://www.broadsheet.com.au/media/cache/f0/0c/f00c5f1a73d5f12f431d1738e5363c3c.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Order from Menu",
                                payload: "SHOW_MENU"
                            },
                            {
                                type: "postback",
                                title: "Help",
                                payload: "SHOW_HELP"
                            },
                            {
                                type: "phone_number",
                                title: "Call us!",
                                payload: "+923244687831"
                            }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);

}

/////////////////

bot.sendMenu=function(recipientId, pageID) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Please Select Category",
            quick_replies: [
                {
                    content_type: "text",
                    title: "Desi",
                    payload: ""
                },
                {
                    content_type: "text",
                    title: "Desserts",
                    payload: ""
                },
                {
                    content_type: "text",
                    title: "Frozen",
                    payload: ""
                }
            ]
        }
    }
    bot.callSendAPI(messageData, pageID);

}

///////////////

bot.sendFrozenMenu=function(recipientId, pageID) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Frozen Chicken Samosas",
                        subtitle: "Rs:300 - 12 pieces",
                        image_url: "https://qph.ec.quoracdn.net/main-qimg-39ca1e1fff43c4a1c90135db48f89136-c",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_FROZENCHICKENSAMOSA",
                        }],
                    }, {
                        title: "Frozen Beef Kebabs",
                        subtitle: "Rs:650 - 12 pieces",
                        image_url: "http://www.seriouseats.com/recipes/assets_c/2013/04/041813-248874-SeriousEats-Sunday-Supper-TurkishMeatballsB-thumb-625xauto-320058.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_FROZENBEEFKEBABS",
                        }]
                    }, {
                        title: "Frozen Chicken Nuggets",
                        subtitle: "Rs:500 - 12 pieces",
                        image_url: "http://www.skinnytaste.com/wp-content/uploads/2011/04/baked-chicken-nuggets-550x387.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_FROZENCHICKENNUGGETS",
                        }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);
}

///////////


bot.sendDessertsMenu=function(recipientId, pageID) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Oreo Muffins",
                        subtitle: "Rs:1000 - 12 pieces",
                        image_url: "http://images.sweetauthoring.com/recipe/126852_977.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_OREOMUFFINS",
                        }],
                    }, {
                        title: "Glazed Donuts",
                        subtitle: "Rs:650 - 6 pieces",
                        image_url: "http://shannonpresson.com/dash/wp-content/uploads/2015/10/donuts.png",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_GLAZEDDONUTS",
                        }]
                    }, {
                        title: "Cinnamon Rolls",
                        subtitle: "Rs:700 - 5 pieces",
                        image_url: "http://dailywaffle.com/wp-content/uploads/2012/07/cinnamon-roll-front.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_CINNAMONROLLS",
                        }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);
}

/////////////////


bot.sendDesiMenu=function(recipientId, pageID) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "horizontal",
                    elements: [{
                        title: "Chicken Karahi",
                        subtitle: "Rs:750 1kg",
                        image_url: "https://i1.wp.com/deliposts.com/wp-content/uploads/2017/01/Screenshot_13-1.png?fit=624%2C415",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_CHICKENKARAHI",
                        }],
                    }, {
                        title: "Murgh Makhni",
                        subtitle: "Rs:800 1kg",
                        image_url: "https://www.easy-chicken.com/stat/img/640/040ButterChicken.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_MURGHMAKHNI",
                        }]
                    }, {
                        title: "Chicken Kofta",
                        subtitle: "Rs:700 1kg",
                        image_url: "http://www.funloveandcooking.com/wp-content/uploads/2015/07/Chicken-Kofta-Curry-Meatball-funloveandcooking.com-feature.jpg",
                        buttons: [{
                            type: "postback",
                            title: "Add to Order",
                            payload: "PAYLOAD_CHICKENQUOFTA",
                        }]
                    }]
                }
            }
        }
    };

    bot.callSendAPI(messageData, pageID);
}

//////////////////


bot.sendTextMessage=function(recipientId, messageText, pageID) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    bot.callSendAPI(messageData, pageID);
}

///////////////////////

bot.sendCompleteOrderWithInvoice=function(recipientId, pageID, users) {
    var messageData;
    console.log(users[0].invoice);

    if (users[0] && users[0].invoice == 0) {
        messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        image_aspect_ratio: "horizontal",
                        elements: [{
                            title: "Your Bucket is empty! please add some grub!",
                            subtitle: "FoodiesBot",
                            image_url: "http://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/brain_food_slideshow/istock_photo_of_assorted_smoothies.jpg",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Order from Menu",
                                    payload: "SHOW_MENU"
                                }]
                        }]
                    }
                }
            }
        };

    } else {
        messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        image_aspect_ratio: "horizontal",
                        elements: [{
                            title: "Thank you for Ordering, We will ping you back shortly!",
                            subtitle: "FoodiesBot",
                            image_url: "http://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/brain_food_slideshow/istock_photo_of_assorted_smoothies.jpg",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Order from Menu",
                                    payload: "SHOW_MENU"
                                }]
                        }]
                    }
                }
            }
        };

    }

    bot.callSendAPI(messageData, pageID);

}

//////////////////


module.exports = bot;

