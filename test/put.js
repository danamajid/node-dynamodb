var expect = require('chai').expect;
var async = require('async');

describe('Put operation', function() {
  var Movie;

  it('Should be able to handle empty put or missing range / index key', function(done) {
    Movie = require(process.cwd() + '/test/stubs/models/movie');

    var cases = [
      { }, // Empty
      { year: 2017 }, // Only specifying the index key,
      { title: 'Hello World' } // Only specifying the range key
    ];

    async.each(
      cases,
      function(input, next) {
        Movie.put(input, function(err, result) {
          expect(err).to.have.property('code');
          expect(err.code).to.equal('ValidationException');
          expect(err).to.have.property('message');
          expect(err.message).to.equal('One of the required keys was not given a value');
          expect(err).to.have.property('statusCode');
          expect(err.statusCode).to.equal(400);
          expect(err).to.have.property('retryable');
          expect(err.retryable).to.equal(false);
          expect(err).to.have.property('retryDelay');
          expect(err.retryDelay).to.equal(0);

          expect(result).to.be.a('null');
          next();
        });
      },
      done
    );
  });

  it('Should be able to handle input not matching the field data type', function(done) {
    var cases = [
      // Empty string provided to a required key
      {
        input: {
          year: 1,
          title: ''
        },
        expectation: {
          code: 'ValidationException',
          message: 'One or more parameter values were invalid: An AttributeValue may not contain an empty string'
        }
      }
    ];

    async.each(
      cases,
      function(testingCase, next) {
        Movie.put(testingCase.input, function(err, result) {
          expect(err).to.have.property('code');
          expect(err.code).to.equal(testingCase.expectation.code);
          expect(err).to.have.property('message');
          expect(err.message).to.equal(testingCase.expectation.message);
          expect(err).to.have.property('statusCode');
          expect(err.statusCode).to.equal(400);
          expect(err).to.have.property('retryable');
          expect(err.retryable).to.equal(false);
          expect(err).to.have.property('retryDelay');
          expect(err.retryDelay).to.equal(0);

          expect(result).to.be.a('null');
          next();
        });
      },
      done
    );
  });
});
