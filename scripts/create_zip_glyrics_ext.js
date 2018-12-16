var fs = require('fs');
var archiver = require('archiver');
var config = require('.././glyrics-ext/manifest.json');
var targetDir = __dirname + '/../target';

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir);
}

var fileName =  targetDir + '/glyrics_ext_'+config.version+'.zip'
var fileOutput = fs.createWriteStream(fileName);
var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

fileOutput.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

fs.d

archive.pipe(fileOutput);
archive.directory("glyrics-ext/", false); 
archive.on('error', function(err){
    throw err;
});
archive.finalize();

