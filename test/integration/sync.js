var expect = require('chai').expect;
var DynamoDB = require(process.cwd() + '/lib');
var fixture = require(process.cwd() + '/test/fixtures');

describe('Sync', function() {
  it('Should not re-run sync for already defined model', function(done) {
    DynamoDB.connect(fixture.dynamodb.options, function(err, result) {
      expect(err).to.be.a('null');
      expect(result).to.be.an('object');
      expect(result).to.have.property('sync');
      expect(result.sync).to.be.an('object');
      expect(result.sync).to.have.property('none');
      expect(result.sync.none).to.be.an('array');
      expect(result.sync.none).to.have.length(1);

      expect(result.sync).to.have.property('updated');
      expect(result.sync.updated).to.be.an('array');
      expect(result.sync.updated).to.have.length(0);

      expect(result.sync).to.have.property('created');
      expect(result.sync.created).to.be.an('array');
      expect(result.sync.created).to.have.length(0);
      done();
    });
  });
});
