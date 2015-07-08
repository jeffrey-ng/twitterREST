var nconf = require('nconf');
var path = require('path');

nconf.env();

var configPath = 'config-' + nconf.get('NODE_ENV') +'.json';

nconf.file(path.join(__dirname, configPath));

module.exports = nconf;
