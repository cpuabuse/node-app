"use strict";
/** @event module:app.App~app_load */
const nunjucks = require("nunjucks");
const yaml = require("js-yaml");
const path = require("path");

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
			},
			yml: string => new Promise(function(resolve){
				resolve(yaml.load(string));
			})
		};

		// Anonymous async arrow function expression
		(async () => {
			// Local variables
			let rcFolder = that.settings.folders.rc;
			let results = new Array();

			// Retrieve absolute paths
			let rcFiles = await that.system.file.list(rcFolder, that.system.file.filter.isFile);

			// Populate the promises
			rcFiles.forEach(rcFile => {
				results.push(new Promise(function(resolve){
					that.system.file.getYaml(rcFolder, rcFile).then(function(result){
						that.app.rc[path.parse(rcFile).name] = result;
						resolve();
					});
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