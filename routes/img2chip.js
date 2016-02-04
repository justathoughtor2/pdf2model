var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var path = require('path');
var multer = require('multer');
var exec = require('child_process').exec;
var unirest = require('unirest');
var async = require('async');
var retry = require('retry');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/thoughthaven/pdf2model/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var uploadchip = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: function(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if(path.extname(file.originalname) === '.png' || path.extname(file.orginalname) === '.jpg') {
    cb(null, true);
    console.log('Uploaded');
  }
  else {
    // To reject this file pass `false`, like so:
    cb(null, false);
    console.log('Failure');
  }
}});

// POST chipify
router.post('/img2chip', uploadchip.fields([{name: 'topUpload', maxCount: 1}, {name: 'bottomUpload', maxCount: 1}, {name: 'sideUpload', maxCount: 1}]), function (req, res, next) {
  // req.file is the `textureUpload` file
  // req.body will hold the text fields, if there were any
  console.log(req.file[0], req.file[1], req.file[2]);
  console.log(req.body);
  var fileTrim0 = req.file[0].filename.substr(0, req.file.filename.lastIndexOf('.'));
  var fileName0 = req.file[0].filename;
  var fileTrim1 = req.file[1].filename.substr(0, req.file.filename.lastIndexOf('.'));
  var fileName1 = req.file[1].filename;
  var fileTrim2 = req.file[2].filename.substr(0, req.file.filename.lastIndexOf('.'));
  var fileName2 = req.file[2].filename;
  // var filenameLength = fileTrim.length;
  
  if(fileTrim0.length && fileTrim1.length && fileTrim2.length) {
    var fileArr = [];
    var linkArr = [];
    
    fs.stat('/home/thoughthaven/pdf2model/uploads/' + req.file.filename, function(err, stat) {
        var linkArr = [];
        if(err) console.log(err);
        var operation = retry.operation();
        operation.attempt(function(currentAttempt) {
          exec('/home/thoughthaven/pdf2model/texturify.sh /home/thoughthaven/pdf2model/uploads/' + fileName0 + ' ' + fileName1 + ' ' + fileName2, function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            console.log(currentAttempt);
            fs.readdir('/home/thoughthaven/pdf2model/uploads', function(error, files) {
          if(error) console.log(error);
          async.map(files, function(file, callback) {
            var uploadThis = new RegExp(fileTrim0 + '-chip\.png');
            var filePath = '/home/thoughthaven/pdf2model/uploads/' + file;
            console.log(fileTrim0);
            console.log(file);
            console.log(uploadThis.test(file));
            
            if(uploadThis.test(file)) {
              unirest.post("https://imgur-apiv3.p.mashape.com/3/image")
                .header("X-Mashape-Key", "9Z879s0gtDmshJOBdM7EgMc2bu5Fp1fXKfOjsnYLHcXBWNXqEB")
                .header("Authorization", "Client-ID 84e5b2c103eb243")
                .header("Content-Type", "multipart/form-data")
                .attach("image", filePath)
                .end(function (result) {
                  fs.unlink(filePath, function(err) {
                    if(err) {
                      console.log(err);
                    }
                    linkArr.push(result.body.data.link);
                    console.log(result.status, result.headers, result.body);
                    callback(null, result.body.data.link);
                  });
              });
            }
            else {
              fs.unlink(filePath, function(err) {
                if(err) {
                  console.log(err);
                }
                callback(null, null);
              });
            }
        }, function(error, result) {
          console.log(result);
          var linkArr = result.filter(function(val) { return val !== null; })
          res.render('complete', { title: 'img2chip - Upload Complete!', linkArr: linkArr });
        });
      });
          })
        });
        
    });
};
});

module.exports = router;
