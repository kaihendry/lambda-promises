const p1 = require('./p1.js');
const p2 = require('./p2.js');
const p3 = require('./p3.js');
const p4 = require('./p4.js');

console.log(p1, p2, p3, p4)

module.exports.promise = (event, context, callback) => {

	p1()
	.then(p2)
	.then(p3)
	.then(p4)
	.then((result) => { return callback(null, { message: result, event }) })
	.catch(function(err) { console.error('Uh oh:' + err); })

};
