# kvstore-sqlite

Basic key-value store for SQLite databases.


## Install
```
npm install @haxtra/kvstore-sqlite
```

## Fineprint

- requires [`super-sqlite3`](https://github.com/haxtra/super-sqlite3) or [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) instance as the database driver
- everything is passed through JSON on the way in and out, so:
    - NaN, Infinity become nulls
    - no circular references
    - if data is not jsonable, it will throw


## Usage

Create instance

```js
const KVStore = require('@haxtra/kvstore-sqlite')

const kv = new KVStore(<superSqlite3Instance>, {
    table: 'kvstore'  // table to use for the store, default "kvstore"
})
// when running for the first time, create the table
kv.createTable()
```

## API

> Note: All methods are synchronous

Set/update value
```js
kv.set(keyName, jsonableData)
```

Retrieve value from the store, falling back to optional default
```js
kv.get(keyName, defaultValue?)
```

Remove key from the store
```js
kv.delete(keyName)
```

Check if key exists, returns timestamp of the last update, or false if key is not set
```js
kv.has(keyName)
```

Get count of stored keys
```js
kv.count()
```

Get array of stored keys
```js
kv.keys(page?, perPage?)
```

Get full store data, as an array of objects
```js
kv.data(page?, perPage?)
```

Remove all data from the store
```js
kv.purge()
```

## Schema

Create store table with preconfigured name, defaults to `kvstore`. Returns `true` on success, `false` if table exists, throws on funky table names.

```js
kv.createTable()
```

## License

MIT

![](https://hello.haxtra.com/gh-kvstore-sqlite)