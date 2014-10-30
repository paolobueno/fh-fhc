var fs = require('fs'),
_ = require('underscore'),
async = require('async'),
path = require('path'),
genericCommand = require('./genericCommand'),
cbCalled = false;

function _removeDotFiles(list){
  return _.reject(list, function(d){
    return d[0] === '.'; // no dotfiles
  });
}

module.exports = function(cb){
  cmdDir = path.join(__dirname, 'cmd', path.sep),
  files = [];
  
  var finder = require('findit')(cmdDir);
  
  finder.on('file', function (file, stat) {
      var base = path.basename(file);
      if (base[0] === '.' || base[0] === '_'){
        return;
      }
      file = file.replace(cmdDir, '');
      files.push(file); 
  });
  
  finder.on('error', function(err){
    finder.stop();
    return cb(err);
  });

  finder.on('end', function(){
    var commands = {};
    files.forEach(function(f, idx){
      var split = f.split(path.sep),
      ref = commands;
      
      split.forEach(function(s, idx){
        if (idx === split.length-1){
          var cmdName = s.replace(/\.js$/, ''),
          cmd = require(path.join(cmdDir, f));
          // Apply the generic command function if it's a new-style command
          if (typeof cmd === 'object'){
            cmd._path = f;
            cmd._cmdName = cmdName;
            cmd = genericCommand(cmd);
          }
          ref[cmdName] = cmd;
        }else{
          ref[s] = ref[s] || {};
          ref[s]._groupName = s;
        }
        ref = ref[s];
      });
    });
    return cb(null, commands);
  });
}