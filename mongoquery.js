var mongoQuery = {};
const mongoose = require('mongoose');
var config = require('./config');
var bot = require('./bot.js');


mongoose.connect(config.mongo.connection, function (error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userID: String,
    pageID: String,
    invoiceLog: String,
    invoice: Number
});


var UserInvoice = db.model('messenger_users', UserSchema);




mongoQuery.sleep=function(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}



mongoQuery.insertMongoUserIfNotExist=function(senderID, pageID) {
    mongoQuery.sleep(2000);
    UserInvoice.find({ userID: senderID }, function (err, users) {
        if (users.length > 0) {
            console.log('userID already exisits', null);
        } else {
            var newUser = new UserInvoice();
            newUser.userID = senderID;
            newUser.invoice = 0;
            newUser.pageID = pageID;
            newUser.invoiceLog = "";
            newUser.save(function (err) {
                console.log(err);
            });
        }
    });

}


mongoQuery.clearMongoUserInvoice=function(senderID, pageID) {
    console.log("Mongo - Clearing bucket userID:" + senderID);
    UserInvoice.findOneAndUpdate({ userID: senderID }, { userID: senderID, invoice: 0, invoiceLog: "", pageID: pageID }, function (err, users) {
        console.log(users);
        bot.sendClearWithMenu(senderID, pageID);
    });

}



mongoQuery.completeMongoUserInvoice=function(senderID, pageID) {
    console.log("Mongo - Complete Order bucket userID:" + senderID);
    UserInvoice.find({ userID: senderID, pageID: pageID }, function (err, users) {
        bot.sendCompleteOrderWithInvoice(senderID, pageID, users);
    });

} 


mongoQuery.updateMongoUserInvoice=function(senderID, pageID, newInvoiceVal, newInvoiceItem) {

    var str = newInvoiceItem + " - " + newInvoiceVal;
    UserInvoice.find({ userID: senderID }, function (err, user) {
        var newUser = new UserInvoice();
        newUser = user[0];
        newUser.userID = senderID;
        newUser.pageID = pageID;
        newUser.invoiceLog = newUser.invoiceLog + str + "\n";
        newUser.invoice = newUser.invoice + newInvoiceVal;
        newUser.save(function (err) {
            if (err) {
                console.error('ERROR!');
            }
            else {
                mongoQuery.sendUpdatedInvoice(senderID, pageID);
            }
        });
    });

}


mongoQuery.getMongoUserInvoiceQuery=function(senderID, callback) {

    UserInvoice.find({ userID: senderID }, function (err, user) {
        if (err)
            callback(err, null);
        else {
            var newUser = new UserInvoice();
            newUser = user[0];
            callback(null, newUser.invoice, newUser.invoiceLog);
        }
    });

}


mongoQuery.sendUpdatedInvoice=function(recipientId, pageID) {
    mongoQuery.sleep(2000);
    mongoQuery.getMongoUserInvoiceQuery(recipientId, function (err, invoiceTotal, invoiceLog) {
        if (err) {
            console.log(err);
        } else {
            var messageData = {
                recipient: {
                    id: recipientId
                },

                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: "Order:\n" + invoiceLog + "\nTOTAL:   Rs " + invoiceTotal + "\n",
                            buttons: [{
                                type: "postback",
                                title: "Complete Order",
                                payload: "PAYLOAD_DONE",
                            }, {
                                type: "postback",
                                title: "Clear Bucket",
                                payload: "PAYLOAD_CLEAR",
                            }]
                        }
                    }
                }
            };
            bot.callSendAPI(messageData, pageID);
        }
    });

}









module.exports = mongoQuery;