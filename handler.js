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
  const uuidgen = uuid.v4()
  const randomNumber = Math.random()

  const params = { TableName: process.env.TABLE,
    ReturnValues: 'ALL_NEW',
    Key: { uuid: uuidgen },
    AttributeUpdates: {
      randomNumber: { Action: 'PUT', Value: randomNumber }
    } }

  return (
      event ? update().then(get) : get()
  )
  .then(data => callback(null, data), callback)

  function get () {
    return dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen } }).promise()
  }

  function update () {
    return dynamodb.update(params).promise()
      .then(data => {
        console.log('Doing an update', data)
        assert.equal(uuidgen, data.Attributes.uuid, 'uuid does not match')
        console.log('uuid', uuidgen)
      })
  }
}
