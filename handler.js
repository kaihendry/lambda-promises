const aws = require('aws-sdk');
const uuid = require('node-uuid');
const assert = require('assert');

aws.config.update({
	region: 'ap-southeast-1'
});

console.log("AWS version", aws.VERSION)
const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.promise = (event, context, callback) => {

	const uuidgen = uuid.v4()
	const randomNumber = Math.random()

	const params = { TableName: process.env.TABLE, ReturnValues: "ALL_NEW", Key: { uuid: uuidgen }, AttributeUpdates: { randomNumber: { Action: 'PUT', Value: randomNumber }}}

	return dynamodb.update(params).promise()
		.then((data) => { console.log("After update", data);
			assert(uuidgen, data.Attributes.uuid)
			return dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen }}).promise()
		})
		.then((data) => { console.log("After get", data);
			assert(uuidgen, data.Item.uuid);
			return callback(null, { message: data })
		})
		.catch((err) => { return callback(err) })

};
