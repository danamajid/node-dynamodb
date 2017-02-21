var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1' });

var DynamoDB = require(process.cwd() + '/lib');

describe('Init', function() {
  var instance;

  it('Should allow init', function(done) {
    instance = new DynamoDB({
      env: 'dev',
      database: 'biem',
      dynamodb: {
        db: new AWS.DynamoDB({
          endpoint: new AWS.Endpoint('http://localhost:8000')
        }),
        client: new AWS.DynamoDB.DocumentClient({
          endpoint: new AWS.Endpoint('http://localhost:8000')
        })
      }
    });

    var User = instance.model('Users', {
      year: {
        type: DynamoDB.types.Number,
        index: DynamoDB.types.Hash
      },
      title: {
        type: DynamoDB.types.String,
        index: DynamoDB.types.Range
      }
    }, {
      readCapacity: 10,
      writeCapacity: 20
    });

    instance.sync(function() {
      User.put({
        year: 2017,
        title: 'Dana'
      }, done);
    });
  });
});
