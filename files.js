/**
 * Created by richard on 4/12/16.
 */
'use strict';

var fs = require('fs');

exports.retrieve = function(req, res){
  console.log('files.retrieve: ' + req.params.name);
  res.sendFile(req.params.name, {root:"./files/" + req.user.id});
};

exports.create = function(req, res){
  console.log('files.create: ' + req.file.originalname);
  fs.renameSync(req.file.path, "./files/" + req.user.id + "/" + req.file.originalname, function(err) {
    if (err) {
      console.error(err);
      return res.status(404).end();
    }
    console.log("File saved successfully!");
    return res.status(201).end();
  });
};

exports.delete = function(req, res){
  console.log('files.delete: ' + req.params.name);
  fs.unlink("./files/" + req.user.id + "/" + req.params.name, function(err) {
    if (err) {
      console.error(err);
      return res.status(404).end();
    }
    console.log("File deleted successfully!");
    return res.status(200).end();
  });
};
