module.exports = function(x) { console.log("p3:" + x); return new Promise((resolve, reject) => {
	if (x > 10) {
		resolve('Success!');
	} else {
		reject('Failure!');
	}
});
}
