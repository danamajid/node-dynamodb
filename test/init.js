var expect = require('chai').expect;
var fixture = require(process.cwd() + '/test/fixtures');

var DynamoDB = require(process.cwd() + '/lib');
describe('Init', function() {
  var model;

  before('Init DynamoDB before models', function(done) {
    DynamoDB.connect(fixture.dynamodb.options, function(err, result) {
      expect(err).to.be.a('null');
      expect(result).to.have.property('sync');
      expect(result.sync).to.have.property('none');
      expect(result.sync.none.length).to.equal(0);
      expect(result.sync).to.have.property('updated');
      expect(result.sync.updated.length).to.equal(0);
      expect(result.sync).to.have.property('created');
      expect(result.sync.created.length).to.equal(0);
      done();
    });
  });

  before('Clear all tables', function(done) {
    fixture.clear(DynamoDB.connection.db, done);
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
    model = require(process.cwd() + '/test/stubs/models/movie');

    var models = Object.keys(DynamoDB.models);
    expect(models).to.have.length(1);
    expect(models).to.include('Movies');
    done();
  });

  it('Should sync models after model is defined', function(done) {
    DynamoDB.connect(fixture.dynamodb.options, function(err, result) {
      expect(err).to.be.a('null');
      expect(result).to.have.property('sync');
      expect(result.sync).to.have.property('none');
      expect(result.sync.none.length).to.equal(0);
      expect(result.sync).to.have.property('updated');
      expect(result.sync.updated.length).to.equal(0);
      expect(result.sync).to.have.property('created');
      expect(result.sync.created.length).to.equal(1);
      done();
    });
  });

  it('Models dictionary should now be updated', function() {
    expect(DynamoDB).to.have.property('env');
    expect(DynamoDB.env).to.equal('dev');
    expect(DynamoDB).to.have.property('database');
    expect(DynamoDB.database).to.equal('biem');
    expect(DynamoDB).to.have.property('connection');
    expect(DynamoDB.connection).to.have.property('db');
    expect(DynamoDB.connection).to.have.property('client');
    var definedModels = Object.keys(DynamoDB.models);
    expect(definedModels).to.have.length(1);
    expect(definedModels).to.contain('Movies');

    expect(DynamoDB.models.Movies).to.have.property('modelName');
    expect(DynamoDB.models.Movies.modelName).to.equal('Movies');

    var schema = require(process.cwd() + '/test/stubs/schemas/movie');
    expect(DynamoDB.models.Movies).to.have.property('definition');
    expect(DynamoDB.models.Movies.definition).to.equal(schema.definition);
    expect(DynamoDB.models.Movies).to.have.property('options');
    expect(DynamoDB.models.Movies.options).to.equal(schema.options);
    expect(DynamoDB.models.Movies).to.have.property('connection');
  });

  it('DynamoDB should have the synced table listed', function(done) {
    DynamoDB.connection.db.listTables({}, function(err, data) {
      expect(err).to.be.a('null');
      expect(data).to.have.property('TableNames');
      expect(data.TableNames.length).to.equal(1);
      expect(data.TableNames).to.contain(fixture.dynamodb.options.env + '.' + fixture.dynamodb.options.database + '.' + model.modelName);
      done();
    });
  });
});
