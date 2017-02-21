var Model = require(process.cwd() + '/model');
var sync = require(process.cwd() + '/sync');
var types = require(process.cwd() + '/types');

function DynamoDB(details) {
  if (!details) {
    details = {};
  }

  var log = function(...args) {
    console.log(...args); // eslint-disable-line no-console
  };

  this.logger = details.logger || {
    fatal: log,
    error: log,
    warn: log,
    info: log,
    debug: log,
    trace: log,
    child: function() { return this; }
  };

  this.env = details.env;
  this.dynamodb = details.dynamodb;
  this.database = details.database;
  this.models = {};

  return this;
}

DynamoDB.types = types;

DynamoDB.prototype.model = function(name, definition, options) {
  var model = Model.compile({
    modelName: name,
    definition: definition,
    options: options,
    connection: this.dynamodb,
    env: this.env,
    database: this.database,
    logger: this.logger
  });

  this.models[name] = model;

  return model;
};

DynamoDB.prototype.sync = sync;

module.exports = DynamoDB;
