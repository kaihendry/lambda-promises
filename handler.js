// vim: set sw=2 sts=2 expandtab:
const aws = require('aws-sdk')
const uuid = require('node-uuid')
const assert = require('assert')

aws.config.update({
  region: 'ap-southeast-1'
})

console.log('AWS version', aws.VERSION)
const dynamodb = new aws.DynamoDB.DocumentClient()

module.exports.promised = (event, context, callback) => {
  console.log('event', event)

  const uuidgen = uuid.v4()
  const randomNumber = Math.random()

  const params = { TableName: process.env.TABLE,
    ReturnValues: 'ALL_NEW',
    Key: { uuid: uuidgen },
    AttributeUpdates: {
      randomNumber: { Action: 'PUT', Value: randomNumber }
    } }

  return (
    !event ? dynamodb.update(params).promise().then((data) => {
      console.log('Doing an update', data)
      assert.equal(uuidgen, data.Attributes.uuid)
      console.log('uuid', uuidgen)
    }).then(() => { return dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen } }).promise() })
    : dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen } }).promise()
  )
  .then((data) => {
    console.log('Done a get', data)
    // HALP? Assert only if we did an update earlier
    // assert.equal(uuidgen, data.Item.uuid)
    callback(null, { message: data })
  }).catch((error) => { callback(error) })
}
