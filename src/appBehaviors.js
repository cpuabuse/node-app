"use strict";
/** @event module:app.App~app_load */
const resource = require("./resource.js");
const nunjucks = require("nunjucks");

var behaviors = [
	// Initialize resources
	{"system_load": that => {
		// Declare structures
		that.app = {
			rc: {},
			// FIXME: Add if njk exists error
			njk: async(dir, file, args) => {
				let path = await that.system.file.join(that.system.rootDir, dir);
				var env = nunjucks.configure(path);

				// Return promise hsould not be wrapped into promise
				return new Promise(function(resolve){
					env.render(file, args, function(err, res){
						if(err){
							throw "someerror3";
						} else {
							resolve(res);
						}
					});
				})
			}
		};

		// Anonymous async arrow function expression
		(async () => {
			// Local variables
			let rcFolder = that.settings.folders.rc;
			let results = new Array();

			// Retrieve absolute paths
			let rcFolders = await that.system.file.list(rcFolder, that.system.file.filter.isDir);

			// Populate the promises
			rcFolders.forEach(folder => {
				results.push(new Promise(function(resolve){
					let item = that.system.file.toRelative(rcFolder, folder);
					that.system.file.getFile(folder, "main.yml").then(function(file){
						item.then(function(item){
							that.app.rc[item] = {
								main: that.constructor.yamlToObject(file)
							};
							resolve();
						})
					})
				}));
			});
			await Promise.all(results);
			return true;
		})().then(() => that.fire("app_load")); // <== (async () => {...})();;
	}},
	// App post-load routines
	{"app_load": that => {
	}}
];

module.exports = behaviors;