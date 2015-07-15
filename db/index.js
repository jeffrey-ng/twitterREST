var mongoose = require('mongoose');
var config = require('../config');
var userSchema = require('./schemas/user');
var tweetSchema = require('./schemas/tweet');

// var connection = mongoose.createConnection(
//     config.get('database:host')
//     , config.get('database:name')
//     , config.get('database:port'))

var connection = mongoose.connect("mongodb://test:password@ds047772.mongolab.com:47772/twitterclone");

connection.model('User',userSchema);
connection.model('Tweet',tweetSchema);
module.exports = connection;
