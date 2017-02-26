var expect = require('chai').expect;
var formatter = require(process.cwd() + '/lib/formatter');
var schema = require(process.cwd() + '/test/stubs/schemas/movie');

describe('Formatter', function() {
  describe('JSON to DynamoDB', function() {
    var formatted = null;
    beforeEach(function() {
      formatted = null;
    });

    it('String', function() {
      formatted = formatter._toDynamoDB({
        title: 'value'
      }, schema);

      expect(formatted).to.have.key('title');
      expect(formatted.title).to.have.key('S');
      expect(formatted.title.S).to.equal('value');
    });

    it('Number (number)', function() {
      formatted = formatter._toDynamoDB({
        year: 2
      }, schema);

      expect(formatted).to.have.key('year');
      expect(formatted.year).to.have.key('N');
      expect(formatted.year.N).to.equal('2');
    });

    it('Number (string)', function() {
      formatted = formatter._toDynamoDB({
        year: '2'
      }, schema);

      expect(formatted).to.have.key('year');
      expect(formatted.year).to.have.key('N');
      expect(formatted.year.N).to.equal('2');
    });
  });

  describe('DynamoDB to JSON', function() {
    var formatted = null;
    beforeEach(function() {
      formatted = null;
    });

    it('String', function() {
      formatted = formatter._fromDynamoDB({
        title: { S: 'value' }
      });

      expect(formatted).to.have.key('title');
      expect(formatted.title).to.equal('value');
    });

    it('Number', function() {
      formatted = formatter._fromDynamoDB({
        year: { N: '2' }
      });

      expect(formatted).to.have.key('year');
      expect(formatted.year).to.equal(2);
    });
  });
});
