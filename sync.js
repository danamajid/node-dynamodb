var async = require('async');

function Sync(model, connection, logger) {
  this.model = model;
  this.connection = connection;
  this.logger = logger;
}

Sync.prototype.setupTable = function(done) {
  var self = this;

  this.connection.db.createTable(this.model.table.schema, function(err) {
    if (err) {
      if (err.code === 'ResourceInUseException') {
        // Table already exists
        return done();
      }

      self.logger.error(err);
      done(err);
    }

    self._waitForTable(done);
  });
};

// Helper method that polls status of a table until it becomes available.
// Note that this assumes the table name has already been passed through the
// helper method to namespace it, as this should only be used internally
// to this service.
Sync.prototype._waitForTable = function(done, retry) {
  var self = this;

  if (!retry) {
    retry = 0;
  }

  this.connection.db.describeTable(
    { TableName: self.model.tableName },
    function(err, details) {
      if (err) {
        return done(err);
      }

      if (details.Table.TableStatus.toLowerCase() === 'active') {
        // The table is ready to go.
        return done();
      }

      if (retry > 10) {
        self.logger.warn('Waiting for table ' + self.tableName + ' but still in state: ' + details.Table.TableStatus);
      }

      // Table is not ready yet, poll again after a backoff
      setTimeout(function() {
        self._waitForTable(done, retry + 1);
      }, 200 * retry + 1);
    }
  );
};



module.exports = function(done) {
  var models = this.models;
  var connection = this.dynamodb;
  var logger = this.logger;

  async.eachSeries(
    models,
    function(model, next) {
      var sync = new Sync(model, connection, logger);
      sync.setupTable(next);
    },
    done
  );
};
