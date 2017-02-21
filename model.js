var formatter = require(process.cwd() + '/formatter');

function Model() {}

/*
 * Compile model
 *
 */
Model.compile = function(globals) {
  function model() {}

  model.__proto__ = Model;
  model.prototype.__proto__ = Model.prototype;
  model.model = Model.prototype.model;

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
  this.tableSchema = formatter.schema(this.tableName, model.definition, model.options);

  return model;
};

Model.prototype.put = function(details, done) {
  this.logger.trace('Create model');
  //this.connection.
  done();
};

Model.prototype.get = function(details, done) {
  this.logger.trace('Create model');
  done();
};

module.exports = Model;
