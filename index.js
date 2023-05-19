"use strict"

class KVStore {

	constructor(db, opts={}) {
		// db must be `super-sqlite3` or `better-sqlite3` instance
		this.db = db
		this.table = opts.table || 'kvstore'
	}

	get(key, dflt){
		/** Try getting value out of the key **/

		const record = this.db.prepare(`SELECT * FROM ${this.table} WHERE key=?;`).get(key)
		return record !== undefined
					? JSON.parse(record.value)
					: dflt
	}

	set(key, value){
		/** Store value **/

		const timeNow = this.#timeNow()

		const data = [
			key,
			JSON.stringify(value),
			timeNow,
			timeNow,
		]

		// do upsert
		const sql = `INSERT INTO ${this.table} (key, value, updated, created) VALUES (?,?,?,?) ON CONFLICT (key) DO UPDATE SET value=excluded.value, updated=excluded.updated;`
		return this.db.prepare(sql).run(data)
	}

	delete(key){
		/** Removes selected key from the store **/

		const sql = `DELETE FROM ${this.table} WHERE key=? LIMIT 1;`
		const res = this.db.prepare(sql).run(key)
		return res.changes == 1 ? true : false
	}

	has(key){
		/** Returns timestamp when key was updated/set, if key is in use, or false if not **/

		const record = this.db.prepare(`SELECT updated FROM ${this.table} WHERE key=?;`).get(key)
		return record ? record.updated : false
	}

	count(key){
		/** Returns number of stored keys **/

		const res = this.db.prepare(`SELECT count(key) AS count FROM ${this.table};`).get()
		return res.count
	}

	keys(page=1, limit=1000){
		/** Returns unordered list of keys currently in use **/

		const offset = (page - 1) * limit
		const keys = this.db.prepare(`SELECT key FROM ${this.table} LIMIT ? OFFSET ?;`).all(limit, offset)
		return keys.map(row => row.key)
	}

	data(page=1, limit=1000){
		/** Returns full store as an array **/

		const offset = (page - 1) * limit
		const records = this.db.prepare(`SELECT * FROM ${this.table} LIMIT ? OFFSET ?;`).all(limit, offset)
		return records.map(record => record.data = JSON.parse(record.data))
	}

	purge(){
		/** Drop all records from db table  **/

		this.db.prepare(`DELETE FROM ${this.table};`).run()
	}

	/// Schema ////////////////////////////////////////////

	createTable(){
		/** Create store table **/

		// table must not exist
		if(this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?;").get(this.table))
			return false

		const schema = (
			`CREATE TABLE ${this.table} (\n` +
			"key TEXT PRIMARY KEY,\n" +
			"value TEXT,\n" +
			"updated INTEGER NOT NULL DEFAULT 0,\n" +
			"created INTEGER NOT NULL DEFAULT 0\n" +
			");"
		)

		// create table
		this.db.exec(schema)

		return true
	}

	/// Helpers ///////////////////////////////////////////

	#timeNow() {
		return Date.now() / 1000 | 0
	}
}

module.exports = KVStore
