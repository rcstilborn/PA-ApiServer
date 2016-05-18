/**
 * Created by richard on 4/12/16.
 */
'use strict';

var users = [
    { id: 123, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 234, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

exports.authenticate = function(req, res){
  console.log('files.retrieve: ' + req.params.name);
  res.sendFile(req.params.name, {root:"./files/" + req.user.id});
};

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}