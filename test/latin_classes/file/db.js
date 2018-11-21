// db.js
"use strict";
const sqlite3 = require("sqlite3").verbose();

/**
 *
 */
async function main(resource, operation){
	var app = resource.root.parent;
	var workDir = await app.system.file.join(app.settings.folders.file, operation.custom.path);
	var absolutePath = await app.system.file.join(app.system.rootDir, workDir);
	var dbPath = await app.system.file.join(absolutePath, "db.db");

	// Open database
	let db = new sqlite3.Database(dbPath, err => {
		if (err) {
			console.error(err.message);
		}
	});

	return new Promise(function(resolve, reject){
		// Query
		let sql = "SELECT * FROM words";

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
			// Close the database
			db.close();
		});
	});
}

module.exports = main;