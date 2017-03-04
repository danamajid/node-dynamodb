var types = require(process.cwd() + '/lib/types');

function Formatter() {}

Formatter.prototype.table = function(tableName, schema) {
  var keySchema = [], attributeDefinitions = [], keys = {};
  var definitions = Object.keys(schema.definition);
  for (var i in definitions) {
    var vals = schema.definition[definitions[i]];
    if (vals.index === types.Hash || vals.index === types.Range) {
      keySchema.push({
        AttributeName: definitions[i],
        KeyType: vals.index
      });

      attributeDefinitions.push({
        AttributeName: definitions[i],
        AttributeType: vals.type
      });
    }

    keys[definitions[i]] = vals.type;
  }

  return {
    keys: keys,
    schema: {
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      ProvisionedThroughput: {
        ReadCapacityUnits: schema.options.readCapacity,
        WriteCapacityUnits: schema.options.writeCapacity
      }
    }
  };
};

Formatter.prototype._toDynamoDB = function(raw, schema) {
  var item = {};
  var itemKeys = Object.keys(raw);
  for (var i in itemKeys) {
    var key = itemKeys[i];
    if (!item[key]) {
      item[key] = {};
    }

    var schemaDefined = schema.definition[key];
    var val = raw[key];
    if (typeof val === 'number') {
      val = val.toString();
    }

    item[key][schemaDefined.type] = val;
  }

  return item;
};

Formatter.prototype._fromDynamoDB = function(raw) {
  var item = {};
  var itemKeys = Object.keys(raw);
  for (var i in itemKeys) {
    var key = itemKeys[i];
    var val = raw[key];
    var valType = Object.keys(val)[0];

    if (valType === 'S') {
      val = val.S;
    } else if (valType === 'N') {
      val = parseInt(val.N, 10);
    }

    item[key] = val;
  }

  return item;
};

Formatter.prototype.putItemInput = function(tableName, rawItem, schema) {
  return {
    TableName: tableName,
    Item: this._toDynamoDB(rawItem, schema)
  };
};

Formatter.prototype.putItemOutput = function(callback) {
  return callback;
};

Formatter.prototype.getItemInput = function(tableName, rawItem, schema) {
  return {
    TableName: tableName,
    Key: this._toDynamoDB(rawItem, schema)
  };
};

Formatter.prototype.getItemOutput = function(callback) {
  var self = this;
  return function(err, resp) {
    callback(err, self._fromDynamoDB(resp.Item));
  };
};

module.exports = new Formatter();
