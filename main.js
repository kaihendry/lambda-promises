var p1 = require('./p1.js')();
var p2 = require('./p2.js');
var p3 = require('./p3.js');
var p4 = require('./p4.js');

console.log(p1, p2, p3, p4)

p1
.then(p2)
.then(p3)
.then(p4)
.then((result) => { console.log("Result: " + result); }).catch(function(err) { console.error('crapastic:' + err); });
