var formatter = require(process.cwd() + '/lib/formatter');

function Model() {}

/*
 * Compile model
 *
 */
Model.compile = function(globals) {
  function model() {}

  model.__proto__ = Model;
  model.prototype.__proto__ = Model.prototype;

  // Apply all global properties/methods
  var dependencies = Object.keys(globals);
  for (var i in dependencies) {
    model[dependencies[i]] = globals[dependencies[i]];
  }

  // Apply all model methods
  for (var method in Model.prototype) {
    model[method] = Model.prototype[method];
  }

  // Generate table name
  this.tableName = [model.env, model.database, model.modelName].join('.');
  this.schema = { definition: model.definition, options: model.options };
  this.table = formatter.table(this.tableName, this.schema);

  return model;
};

Model.prototype.put = function(details, done) {
  this.connection.db.putItem(
    formatter.putItemInput(this.tableName, details, this.schema),
    formatter.putItemOutput(done)
  );
};

Model.prototype.get = function(details, done) {
  this.connection.db.getItem(
    formatter.getItemInput(this.tableName, details, this.schema),
    formatter.getItemOutput(done)
  );
};

Model.prototype._batchWriteItem = function(details, done) {
  this.connection.db.batchWriteItem(details, done);
};

Model.prototype.batchPut = function(details, done) {
  this._batchWriteItem(
    formatter.batchPutItemInput(this.tableName, details, this.schema),
    formatter.batchPutItemOutput(done)
  );
};

module.exports = Model;
