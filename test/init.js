var expect = require('chai').expect;
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1' });

var DynamoDB = require(process.cwd() + '/lib');
describe('Init', function() {
  var options = {
    env: 'dev',
    database: 'biem',
    connection: {
      db: new AWS.DynamoDB({
        endpoint: new AWS.Endpoint('http://localhost:4337')
      }),
      client: new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint('http://localhost:4337')
      })
    }
  };

  before('Init DynamoDB', function(done) {
    DynamoDB.connect(options, function(err, result) {
      expect(err).to.be.a('null');
      expect(result).to.have.property('sync');
      expect(result.sync).to.have.property('updated');
      expect(result.sync.updated).to.equal(0);
      expect(result.sync).to.have.property('created');
      expect(result.sync.created).to.equal(0);
      done();
    });
  });

  it('Should have the appropriate env, database and models set', function() {
    expect(DynamoDB).to.have.property('env');
    expect(DynamoDB.env).to.equal('dev');
    expect(DynamoDB).to.have.property('database');
    expect(DynamoDB.database).to.equal('biem');
    expect(DynamoDB).to.have.property('connection');
    expect(DynamoDB.connection).to.have.property('db');
    expect(DynamoDB.connection).to.have.property('client');
    expect(Object.keys(DynamoDB.models)).to.have.length(0);
  });

  it('Should update models dictionary when a model gets defined', function(done) {
    require(process.cwd() + '/test/stubs/models/movie');

    var models = Object.keys(DynamoDB.models);
    expect(models).to.have.length(1);
    expect(models).to.include('Movies');
    done();
  });

  it('Should sync models after model is defined', function(done) {
    DynamoDB.connect(options, function(err, results) {
      expect(err).to.be.a('null');
      done();
    });
  });
});
