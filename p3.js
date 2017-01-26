module.exports = (x) => { console.log("p3:" + x); return Promise(function(resolve, reject) {
	if (x > 10) {
		resolve('Success!');
	} else {
		reject('Failure!');
	}
});
}
