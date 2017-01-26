var p1 = require('./p1.js')();
var p2 = require('./p2.js')();

console.log(p1, p2)

p1.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(p2).then(function(val) {
  console.log(val);
})
