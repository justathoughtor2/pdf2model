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
    cb(null, '/home/thoug/pdf2model/uploads');
  },
  filename: function (req, file, cb) {
    var filenameEdit = file.originalname.replace(/\(/g, '_').replace(/\)/g, '_').replace(/\[/g, '_').replace(/\]/g, '_').replace(/\s/g, '_');
    cb(null, filenameEdit + Date.now());
  }
});

var upload = multer({ storage: storage, limits: { fileSize: 9 * 1024 * 1024 }, fileFilter: function(req, file, cb) {
  // To accept the file pass `true`, like so:
  if(file.mimetype === 'application/pdf') {
    cb(null, true);
    console.log('Uploaded');
  }
  else {
    // To reject this file pass `false`, like so:
    cb(null, false);
    console.log('Failure');
  }
} });



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'pdf2model - Home' });
});

// POST documentify
router.post('/', upload.single('documentUpload'), function (req, res, next) {
  if(!req.file) {
    res.render('complete', { title: 'pdf2model - Upload Failure!', linkArr: null });
  }
  // req.file is the `documentUpload` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  console.log(req.body);
  var fileTrim = req.file.filename.substr(0, req.file.filename.lastIndexOf('.'));
  // var filenameLength = fileTrim.length;
  
  if(fileTrim.length) {
    var checked = '';
    
    if(req.body.single === 'on') checked = 'true';
    
    fs.stat('/home/thoug/pdf2model/uploads/' + req.file.filename, function(err, stat) {
        var linkArr = [];
        if(err) console.log(err);
        var operation = retry.operation();
        operation.attempt(function(currentAttempt) {
          exec('/home/thoug/pdf2model/documentify.sh /home/thoug/pdf2model/uploads/' + fileTrim + ' ' + checked, function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            console.log(currentAttempt);
            fs.readdir('/home/thoug/pdf2model/uploads', function(error, files) {
          if(error) console.log(error);
          async.map(files, function(file, callback) {
            var uploadThis = new RegExp(fileTrim + '-text[0-9]*\.png');
            var uploadThis2 = new RegExp(fileTrim + '-*[0-9]*\.png');
            var filePath = '/home/thoug/pdf2model/uploads/' + file;
            console.log(fileTrim);
            console.log(file);
            console.log(uploadThis.test(file));
            console.log(uploadThis2.test(file));
            
            if(uploadThis.test(file) || uploadThis2.test(file)) {
              unirest.post("https://imgur-apiv3.p.mashape.com/3/image")
                .header("X-Mashape-Key", process.env.MASHAPE_KEY)
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
          res.render('complete', { title: 'pdf2model - Upload Complete!', linkArr: linkArr });
        });
      });
          })
        });
        
    });
};
});

var uploadchip = multer({ storage: storage, limits: { fileSize: 9 * 1024 * 1024 }, fileFilter: function(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
  if(!req.files['topUpload'][0] || !req.files['bottomUpload'][0] || !req.files['sideUpload'][0]) {
    res.render('complete', { title: 'img2chip - Upload Failure!', linkArr: null });
  }
  // req.files are the files
  // req.body will hold the text fields, if there were any
  console.log(req.files['topUpload'][0].filename + req.files['bottomUpload'][0].filename + req.files['sideUpload'][0].filename);
  console.log(req.body);
  var fileTrim0 = req.files['topUpload'][0].filename.substr(0, req.files['topUpload'][0].filename.lastIndexOf('.'));
  var fileName0 = req.files['topUpload'][0].filename;
  var fileTrim1 = req.files['bottomUpload'][0].filename.substr(0, req.files['bottomUpload'][0].filename.lastIndexOf('.'));
  var fileName1 = req.files['bottomUpload'][0].filename;
  var fileTrim2 = req.files['sideUpload'][0].filename.substr(0, req.files['sideUpload'][0].filename.lastIndexOf('.'));
  var fileName2 = req.files['sideUpload'][0].filename;
  // var filenameLength = fileTrim.length;
  
  if(fileTrim0.length && fileTrim1.length && fileTrim2.length) {
    console.log('Starting file stat');
    
    fs.stat('/home/thoug/pdf2model/uploads/' + req.files['topUpload'][0].filename, function(err, stat) {
      console.log('Statting top...');
      if(err) {
        console.log(err);} else {
        fs.stat('/home/thoug/pdf2model/uploads/' + req.files['bottomUpload'][0].filename, function(err, stat) {
          if(err) {
            console.log(err); } else {
            fs.stat('/home/thoug/pdf2model/uploads/' + req.files['sideUpload'][0].filename, function(err, stat) {
            
        var linkArr = [];
        if(err) console.log(err);
        var operation = retry.operation();
        operation.attempt(function(currentAttempt) {
          console.log(currentAttempt);
          exec('/home/thoug/pdf2model/chipify.sh /home/thoug/pdf2model/uploads/' + fileName0 + ' /home/thoug/pdf2model/uploads/' + fileName1 + ' /home/thoug/pdf2model/uploads/' + fileName2 + ' /home/thoug/pdf2model/uploads/' + fileTrim0, function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            console.log(currentAttempt);
            fs.readdir('/home/thoug/pdf2model/uploads', function(error, files) {
          if(error) console.log(error);
          async.map(files, function(file, callback) {
            var uploadThis = new RegExp(fileTrim0 + '-chip\.png');
            var filePath = '/home/thoug/pdf2model/uploads/' + file;
            console.log(fileTrim0);
            console.log(file);
            console.log(uploadThis.test(file));
            
            if(uploadThis.test(file)) {
              unirest.post("https://imgur-apiv3.p.mashape.com/3/image")
                .header("X-Mashape-Key", process.env.MASHAPE_KEY)
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
          }});}});
};
});

// POST tokenify
router.post('/img2token', uploadchip.single('imageUpload'), function (req, res, next) {
  if(!req.file) {
    res.render('complete', { title: 'img2token - Upload Failure!', linkArr: null });
  }
  // req.files are the files
  // req.body will hold the text fields, if there were any
  console.log(req.file.filename);
  console.log(req.body);
  var fileTrim = req.file.filename.substr(0, req.file.filename.lastIndexOf('.'));
  var fileName = req.file.filename;
  // var filenameLength = fileTrim.length;
  
  if(fileTrim.length) {
    var fuzzAmount = 0;
    if(!isNaN(req.body.fuzzAmount)) {
      if(req.body.fuzzAmount <= 100 && req.body.fuzzAmount >= 0) {
        fuzzAmount = req.body.fuzzAmount;
      }
    }
    console.log('Starting file stat');
    
    fs.stat('/home/thoug/pdf2model/uploads/' + req.file.filename, function(err, stat) {
      console.log('Statting image...');
      if(err) {
        console.log(err);} else {
            fs.stat('/home/thoug/pdf2model/uploads/' + req.file.filename, function(err, stat) {
            
        var linkArr = [];
        if(err) console.log(err);
        var operation = retry.operation();
        operation.attempt(function(currentAttempt) {
          console.log(currentAttempt);
          exec('/home/thoug/pdf2model/tokenify.sh /home/thoug/pdf2model/uploads/' + fileName + ' /home/thoug/pdf2model/uploads/' + fileTrim + ' ' + fuzzAmount, function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            console.log(currentAttempt);
            fs.readdir('/home/thoug/pdf2model/uploads', function(error, files) {
          if(error) console.log(error);
          async.map(files, function(file, callback) {
            var uploadThis = new RegExp(fileTrim + '-token\.png');
            var filePath = '/home/thoug/pdf2model/uploads/' + file;
            console.log(fileTrim);
            console.log(file);
            console.log(uploadThis.test(file));
            
            if(uploadThis.test(file)) {
              unirest.post("https://imgur-apiv3.p.mashape.com/3/image")
                .header("X-Mashape-Key", process.env.MASHAPE_KEY)
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
          res.render('complete', { title: 'img2token - Upload Complete!', linkArr: linkArr });
        });
      });
          })
        });
        
    });
          }});}});

module.exports = router;
