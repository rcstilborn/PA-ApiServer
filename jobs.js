/**
 * Created by richard on 4/12/16.
 */
'use strict';

var fs = require('fs');
var util = require('util');
var spawn = require('child_process').spawn;
var env = process.env;

// Jobs
//   id
//   status - running, terminated, ?
//   exit_code
//   start_time
//   end_time
//   output file name
//   child_process

var running_jobs = {};

exports.start = function(req, res){
  var scriptname = req.query.scriptname;
  var inputfilename = req.query.inputfilename;
  var outputfilename = req.query.outputfilename;

  console.log('jobs.start: scriptname=' + scriptname + ', inputfilename=' + inputfilename + ', outputfilename=' + outputfilename);
  console.log(running_jobs);

  // Check there is an input filename provided
  if(!inputfilename) {
    console.log("ERROR: no inputfilename sent");
    return res.status(400).send("Missing inputfilename parameter");
  }

  inputfilename = "./files/" + req.user.id + "/" + inputfilename;

  // Check the provided filename actually exists and is readable
  fs.access(inputfilename, fs.R_OK, function(err) {
    if (err) {
      console.error(err);
      return res.status(400).send("Inputfilename \'" + inputfilename + "\' could not be found");
    }

    if(scriptname)
      scriptname = './scripts/' + scriptname;
    else
      scriptname = './scripts/test_script.R';

    // Check the script exists and is executable
    fs.access(scriptname, fs.R_OK | fs.X_OK, function(err) {
      if (err) {
        console.error(err);
        return res.status(400).send("Script requested \'" + scriptname + "\' could not be found");                                                                                                                  fs.X_OK
      }

      if(outputfilename)
        outputfilename = "./files/" + req.user.id + "/" + outputfilename;
      else
        outputfilename = "./files/" + req.user.id + "/output.txt";

      var opts = {
        cwd: './',
        env: process.env,
        stdio: ['pipe', process.stdout, process.stderr]
      };
      var params = [inputfilename, outputfilename];

      var R  = spawn(scriptname, params, opts);
      R.on('exit',function(code){
        console.log('got exit event with code: '+code + " at: " + new Date().toTimeString().substr(0, 8));
        running_jobs[R.pid].status = 'terminated';
        running_jobs[R.pid].exit_code = code;
        running_jobs[R.pid].end_time = Date.now();
        delete running_jobs[R.pid].child_process;
        console.log(running_jobs);
      });
      R.on('error',function(err){
        console.log('got error event: '+err);
        running_jobs[R.pid].status = 'terminated';
        running_jobs[R.pid].exit_code = err;
        running_jobs[R.pid].end_time = Date.now();
        delete running_jobs[R.pid].child_process;
        console.log(running_jobs);
      });

      console.log("Job started at: " + new Date().toTimeString().substr(0, 8));
      running_jobs[R.pid] = {pid: R.pid, child_process: R, status: "running", start_time: Date.now(), inputfilename: inputfilename, outputfilename: outputfilename};
      console.log(running_jobs);

      var foo = running_jobs[R.pid];
      delete foo.child_process;
      res.status(202).json(foo);
    });
  });
};

exports.status = function(req, res){
  console.log('jobs.status: ' + req.params.jobid);
  if(running_jobs[req.params.jobid]) {
    var foo = running_jobs[req.params.jobid];
    delete foo.child_process;
    res.json(foo);
  } else {
    res.status(404).end();
  }
};

exports.list_all = function(req, res){
  console.log('jobs.list_all');
  res.json(Object.keys(running_jobs));
};

exports.delete = function(req, res){
  console.log('jobs.delete: ' + req.params.jobid);
  if(running_jobs[req.params.jobid]) {
    if(running_jobs[req.params.jobid].status == 'running') {
      running_jobs[req.params.jobid].child_process.kill();
    }
    delete running_jobs[req.params.jobid];
    res.end();
  } else {
    res.status(404).end();
  }
};
