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

  Promise.resolve().then(() => { // depending on event type, we start the chain with a certain promise or not
    if (!event) return // resolves `undefined`
    return Promise.resolve('doanupdate')
  })
  .then((data) => { // if that certain promise was run, we then update the entry
    if (data) {
      console.log('Doing an update!')
      return dynamodb.update(params).promise()
    }
    return
  })
  .then((data) => {
    if (data) {
      console.log('Done an update', data)
      assert.equal(uuidgen, data.Attributes.uuid)
    }
    console.log('Going to fetch', uuidgen)
    return dynamodb.get({ TableName: process.env.TABLE, Key: { uuid: uuidgen } }).promise()
  })
  .then((data) => {
    console.log('Done a get', data)
    // HALP? Assert only if we did an update earlier
    // assert.equal(uuidgen, data.Item.uuid)
    callback(null, { message: data })
  }).catch((error) => { callback(error) })
}
