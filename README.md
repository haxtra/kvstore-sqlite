# kvstore-sqlite

Basic key-value store for SQLite databases.


## Install

	npm install @haxtra/kvstore-sqlite


## Fineprint

- requires [`super-sqlite3`](https://github.com/haxtra/super-sqlite3) or [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) instance as the database driver
- everything is passed through JSON on the way in and out, so:
	- NaN, Infinity become nulls
	- no circular references
	- if data is not jsonable, it will throw
- you have to initialize the table yourself, use the `schema.sql` file


## Usage

Create instance

```js
const KVStore = require('@haxtra/kvstore-sqlite')

const kv = new KVStore(<superSqlite3Instance>, {
	table: 'kvstore'  // table to use for the store, default "kvstore"
})
```

## API

> Note: all methods are synchronous

Set/update value

	kv.set(keyName, jsonableData)

Retrieve value from store, falling back to optional default

	kv.get(keyName, defaultValue?)

Remove key from store

	kv.delete(keyName)

Check if key exists, returns timestamp of the last update, or false if key is not set

	kv.has(keyName)

Get count of stored keys

	kv.count()

Get array of stored keys

	kv.keys(page?, perPage?)

Get full store data, as an array

	kv.data(page?, perPage?)

Remove all data from the store

	kv.purge()


## Schema

Get KVStore schema file path

	const schemaPath = require.resolve('@haxtra/kvstore-sqlite/schema.sql')


## License

MIT

