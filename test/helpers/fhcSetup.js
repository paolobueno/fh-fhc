var fhc = require("fhc.js");
var ini = require('utils/ini.js');

module.exports = function(done){
  console.log('running before!');
  fhc.load(function (er) {
    ini.set("feedhenry", "https://apps.feedhenry.com");
    ini.set("domain", "apps");
    return done(er);
  });
};