var DynamoDB = require(process.cwd() + '/lib');

module.exports = {
  definition: {
    year: {
      type: DynamoDB.types.Number,
      index: DynamoDB.types.Hash
    },
    title: {
      type: DynamoDB.types.String,
      index: DynamoDB.types.Range
    },
    description: {
      type: DynamoDB.types.String
    },
    actors: {
      type: DynamoDB.types.StringSet
    },
    rating: {
      type: DynamoDB.types.Number
    }
  },
  options: {
    readCapacity: 10,
    writeCapacity: 20
  }
};
