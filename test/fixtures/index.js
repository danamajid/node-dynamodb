var expect = require('chai').expect;
var async = require('async');
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1' });

var url = 'http://localhost:4337';
module.exports.url = url;
module.exports.clear = function(dynamodb, done) {
  async.auto({
    list: function(next) {
      dynamodb.listTables({}, function(err, data) {
        expect(err).to.be.a('null');
        expect(data).to.have.property('TableNames');
        next(null, data.TableNames);
      });
    },
    remove: ['list', function(data, next) {
      async.each(data.list,
        function(table, removed) {
          dynamodb.deleteTable({
            TableName: table
          }, removed);
        }
      , next);
    }]
  }, done);
};

module.exports.dynamodb = {
  options: {
    env: 'dev',
    database: 'biem',
    connection: {
      db: new AWS.DynamoDB({
        endpoint: new AWS.Endpoint(url)
      }),
      client: new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint(url)
      })
    }
  }
};
