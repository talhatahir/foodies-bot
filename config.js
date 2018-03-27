var config = {};

config.mongo={};
config.web = {};

config.mongo.connection='mongodb://talhatahir:talhatahir@ds119682.mlab.com:19682/mongo-foodiebot';
config.web.port = process.env.PORT || 5000;

module.exports = config;