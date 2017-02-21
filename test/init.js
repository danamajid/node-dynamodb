var expect = require('chai').expect;
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1' });

var DynamoDB = require(process.cwd() + '/lib');
var user = require(process.cwd() + '/test/dummy/user');

var instance;
describe('Init', function() {
  before('Init DynamoDB', function() {
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
  });

  it('Should have the appropriate env, database and models set', function() {
    expect(instance).to.have.property('env');
    expect(instance.env).to.equal('dev');
    expect(instance).to.have.property('database');
    expect(instance.database).to.equal('biem');
    expect(instance).to.have.property('dynamodb');
    expect(instance.dynamodb).to.have.property('db');
    expect(instance.dynamodb).to.have.property('client');
    expect(Object.keys(instance.models)).to.have.length(0);
  });

  it('Should update models dictionary when a model gets defined', function(done) {
    instance.model('Users', user.definition, user.options);
    var models = Object.keys(instance.models);
    expect(models).to.have.length(1);
    expect(models).to.include('Users');
    done();
  });

  it('Should sync models', function(done) {
    instance.sync(function(err) {
      expect(err).to.be.a('null');
      done();
    });
  });

  after(function() {
    global.instance = instance;
  });
});
