const aws = require('aws-sdk');
const uuid = require('node-uuid');

aws.config.update({
	region: 'ap-southeast-1'
});

console.log("AWS version", aws.VERSION)
const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.promise = (event, context, callback) => {

	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
	dynamodb.scan({ TableName: process.env.TABLE }).promise()
	.then((data) => { console.log("After scan", data); })
	.catch(function(err) { console.error('Failed to scan:' + err); })

	const uuidgen = uuid.v4()
	const randomNumber = Math.random()

	dynamodb.update({ TableName: process.env.TABLE, Key: { uuid: uuidgen }, AttributeUpdates: { randomNumber: { Action: 'PUT', Value: randomNumber }}}).promise()
	.then((data) => { console.log("After put", data); })
	.catch(function(err) { console.error('Failed to put:' + err); })

	dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen }}).promise()
	.then((data) => { console.log("After get", data); return callback(null, { message: data }) })
	.catch(function(err) { console.error('Failed to get:' + err); })


	// return callback(null, { message: 'Hi there', event });

};
