## DynamoDB

A Mongoose-like API for DynamoDB

### new DynamoDB()

Instantiate DynamoDB.

* `env` - The environment
* `database` - The environment
* `connection` - Object with an instance of `new AWS.DynamoDB` for `db` and `new AWS.DynamoDB.DocumentClient` for `client`
* `logger` - Optional interface that implements `info`, `warn`, `error`, `fatal`, `debug`, `trace` and `child`.

__Example:__

```js
var DynamoDB = require('dynamodb');

var dynamodb = new DynamoDB({
  env: 'dev',
  database: 'biem',
  connection: {
    db: new AWS.DynamoDB({
      endpoint: new AWS.Endpoint('http://localhost:4337')
    }),
    client: new AWS.DynamoDB.DocumentClient({
      endpoint: new AWS.Endpoint('http://localhost:4337')
    })
  }
});
```

### Methods

#### dynamodb.model(name, definition, options)

Define your model.

__Example:__

```js
var Movie = dynamodb.model('Movies', {
  year: {
    type: DynamoDB.types.Number,
    index: DynamoDB.types.Hash
  },
  title: {
    type: DynamoDB.types.String,
    index: DynamoDB.types.Range
  }
}, {
  readCapacity: 10,
  writeCapacity: 20
});
```


#### dynamodb.sync(callback)

Sync your defined models.

__Example:__

```js
dynamodb.sync(function(err) {
  console.log(err);
});
```


#### Movie.put(details, callback);

Put an item.

__Example:__

```js
Movie.put({
  title: 'A beautiful mind'
}, done);
```

#### Author

* Contact: [hi@danamajid.com][1]
* Twitter: [http://twitter.com/dnmjd][2] 

  [1]: mailto:hi@danamajid.com
  [2]: http://twitter.com/dnmjd


#### Credits

Shout out to [Nathan Peck](https://github.com/nathanpeck) for sharing his exploration project
