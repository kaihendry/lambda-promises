const aws = require('aws-sdk');
const uuid = require('node-uuid');

aws.config.update({
	region: 'ap-southeast-1'
});

console.log("AWS version", aws.VERSION)
const dynamodb = new aws.DynamoDB.DocumentClient();

function getItem(params) { return dynamodb.get(params).promise() }
function putItem(params) { return dynamodb.update(params).promise() }

module.exports.promise = (event, context, callback) => {

	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
	dynamodb.scan({ TableName: process.env.TABLE }, function(err, data) {
		if (err) console.log("Callback scan error", err);
		else console.log("Callback scan", data);
	});

	// Using a Promise
	dynamodb.scan({ TableName: process.env.TABLE }).promise()
	.then(function(data) {
		  console.log('Promise Scan Success', data);
	}).catch(function(err) {
		  console.log("Promise scan error", err);
	});

	// Using a Promise, shorter
	dynamodb.scan({ TableName: process.env.TABLE }).promise()
	.then((data) => { console.log("After scan", data); })

	const uuidgen = uuid.v4()
	const randomNumber = Math.random()

	dynamodb.update({ TableName: process.env.TABLE, Key: { uuid: uuidgen }, AttributeUpdates: { randomNumber: { Action: 'PUT', Value: randomNumber }}}).promise()
	.then((data) => { console.log("After put", data); })

	// putItem({ TableName: process.env.TABLE, Key: { uuid: uuidgen }, AttributeUpdates: { randomNumber: { Action: 'PUT', Value: randomNumber }}})
	//.then((data) => { console.log("After put", data); getItem({ TableName: process.env.TABLE, Key: { uuid: uuidgen }}) })
	//.then((data) => { console.log("After get", data, uuidgen); return callback(null, { message: data, event }) })
	//.catch(function(err) { console.error('Uh oh:' + err); })

};
