var expect = require('chai').expect;
var async = require('async');

describe('CRUD operations', function() {
  var Movie;

  describe('PUT', function() {
    it('Should be able to handle empty put or missing range / index key', function(done) {
      Movie = require(process.cwd() + '/test/stubs/models/movie');

      var cases = [
        { }, // Empty
        { year: 2017 }, // Only specifying the index key,
        { title: 'Hello World' }, // Only specifying the range key
        { description: 'What' } // Only specifying non-key field
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
            message: 'One or more parameter values were invalid: An AttributeValue may not contain an empty string',
            extraProperties: true
          }
        },
        {
          input: {
            year: '',
            title: 'hello'
          },
          expectation: {
            code: 'ValidationException',
            message: 'A value provided cannot be converted into a number',
            extraProperties: true
          }
        },
        {
          input: {
            year: new Date(),
            title: 'Test'
          },
          expectation: {
            code: 'InvalidParameterType',
            message: 'Expected params.Item[\'year\'].N to be a string',
            extraProperties: false
          }
        }
      ];

      async.each(
        cases,
        function(testingCase, next) {
          Movie.put(testingCase.input, function(err, result) {
            expect(err).to.not.be.a('null');
            expect(err).to.have.property('code');
            expect(err.code).to.equal(testingCase.expectation.code);
            expect(err).to.have.property('message');
            expect(err.message).to.equal(testingCase.expectation.message);

            if (testingCase.expectation.extraProperties) {
              expect(err).to.have.property('statusCode');
              expect(err.statusCode).to.equal(400);
              expect(err).to.have.property('retryable');
              expect(err.retryable).to.equal(false);
              expect(err).to.have.property('retryDelay');
              expect(err.retryDelay).to.equal(0);
            }

            expect(result).to.be.a('null');
            next();
          });
        },
        done
      );
    });

    it('Should allow inserting a new item', function(done) {
      var cases = [{
        title: 'A Beautiful Mind',
        year: 2001
      }, {
        title: 'Office Space',
        year: 1999,
        description: 'Hello world'
      }, {
        title: 'The Godfather',
        year: 1999,
        description: 'Hello world',
        actors: ['Al Pacino', 'Marlon Brando'],
        rating: 9.1
      }];

      async.each(
        cases,
        function(input, next) {
          Movie.put(input, function(err, result) {
            expect(err).to.be.a('null');
            expect(result).to.be.an('object');
            expect(Object.keys(result)).to.have.length(0);
            next();
          });
        }, done
      );
    });
  });

  describe('GET', function() {
    it('Should return validation error when no key/not all keys are provided ', function(done) {
      var cases = [{
        // Empty
      }, {
        title: 'Office Space'
      }, {
        year: 1999
      }, {
        description: 'Hello world'
      }];

      async.each(
        cases,
        function(input, next) {
          Movie.get(input, function(err) {
            expect(err).to.not.be.a('null');
            expect(err.code).to.equal('ValidationException');
            expect(err.message).to.equal('The number of conditions on the keys is invalid');
            next();
          });
        },
        done
      );
    });

    it('Should return null if no match is found', function(done) {
      var cases = [{
        title: 'The Office',
        year: 1999
      }, {
        title: 'Office Space',
        year: 2000
      }];

      async.each(
        cases,
        function(input, next) {
          Movie.get(input, function(err, result) {
            expect(err).to.be.a('null');
            expect(result).to.be.a('null');
            next();
          });
        },
        done
      );
    });

    it('Should get an existing item by combination of keys - returning additional fields', function(done) {
      var cases = [{
        title: 'Office Space',
        year: '1999'
      }, {
        title: 'Office Space',
        year: 1999
      }, {
        title: 'A Beautiful Mind',
        year: 2001
      }, {
        title: 'The Godfather',
        year: 1999
      }];

      async.each(
        cases,
        function(input, next) {
          Movie.get(input, function(err, result) {
            expect(err).to.be.a('null');
            expect(result).to.be.an('object');
            expect(result).to.have.property('title');
            expect(result.title).to.equal(input.title);

            var year = (typeof input.year === 'string' ? parseInt(input.year, 10) : input.year);
            expect(result).to.have.property('year');
            expect(result.year).to.equal(year);

            if (result.title === 'Office Space') {
              expect(result).to.have.property('description');
              expect(result.description).to.equal('Hello world');
            } else if (result.title === 'The Godfather') {
              expect(result).to.have.property('description');
              expect(result.description).to.equal('Hello world');
              expect(result).to.have.property('rating');
              expect(result.rating).to.equal(9.1);
              expect(result).to.have.property('actors');
              expect(result.actors).to.be.an('array');
              expect(result.actors).to.have.length(2);
              expect(result.actors).to.contain('Al Pacino');
              expect(result.actors).to.contain('Marlon Brando');
            } else {
              expect(result).to.not.have.property('description');
            }

            next();
          });
        },
        done
      );
    });
  });
});
