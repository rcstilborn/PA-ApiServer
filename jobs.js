/**
 * Created by richard on 4/12/16.
 */
'use strict';

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
  console.log('jobs.start: ' + req.body.scriptname + ", " + req.body.filename);
  console.log(running_jobs);
  var opts = { cwd: './',
    env: process.env
  };

  var params = ['--vanilla',req.body.scriptname, req.body.filename];
  var R  = spawn('./scripts/sleepscript', params, opts);
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
  running_jobs[R.pid] = {pid: R.pid, child_process: R, status: "running", start_time: Date.now()};
  console.log(running_jobs);

    var foo = running_jobs[R.pid];
    delete foo.child_process;
    res.status(202).json(foo);
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
