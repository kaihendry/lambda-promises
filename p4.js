module.exports = (x) => { console.log("p4:" + x); return new Promise((resolve, reject) => {
	resolve(typeof(x));
});
}
