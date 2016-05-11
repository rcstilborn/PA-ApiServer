/**
 * Created by richard on 4/11/16.
 */
'use strict';

exports = module.exports = function(app, passport) {

  app.all('/*', passport.authenticate('basic', { session: false }));

  // File based actions
  app.post('/api/files', require('./files').create);
  app.get('/api/files/:name', require('./files').retrieve);
  app.delete('/api/files/:name', require('./files').delete);

  // Job based actions
  app.post('/api/jobs', require('./jobs').start);
  app.get('/api/jobs/all', require('./jobs').list_all);
  app.get('/api/jobs/:jobid', require('./jobs').status);
  app.delete('/api/jobs/:jobid', require('./jobs').delete);


  //route not found
  app.all('*', function(req, res) {res.status(404)});
};