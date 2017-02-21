var types = require(process.cwd() + '/types');

function Formatter() {}

Formatter.prototype.schema = function(tableName, definition, options) {
  var keySchema = [], attributeDefinitions = [];
  var keys = Object.keys(definition);
  for (var i in keys) {
    var vals = definition[keys[i]];
    if (vals.index === types.Hash || vals.index === types.Range) {
      keySchema.push({
        AttributeName: keys[i],
        KeyType: vals.index
      });
    }

    attributeDefinitions.push({
      AttributeName: keys[i],
      AttributeType: vals.type
    });
  }

  return {
    TableName: tableName,
    KeySchema: keySchema,
    AttributeDefinitions: attributeDefinitions,
    ProvisionedThroughput: {
      ReadCapacityUnits: options.readCapacity,
      WriteCapacityUnits: options.writeCapacity
    }
  };
};

Formatter.prototype.operation = function(tableName, item) {
  return {
    TableName: tableName,
    Item: item
  };
};

module.exports = new Formatter();
