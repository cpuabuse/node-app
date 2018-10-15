// app.js
/**
 * Creates an app based on System instance.
 * @module app
 */
"use strict";
const system = require("cpuabuse-system");
const app_initDir = "settings";
const app_initFilename = "init";
const behaviors = require("./appBehaviors.js");
const resource = require("./resource.js");

/**
 * Application
 *
 * Requires app.yml and events.yml initialized with init.yml by the system, all residing in the settings folder within the app root.
 * @extends module:system.System
 * @param {string} id Identifier of the app
 * @param {string} rootDir App root directory
 */
class App extends system.System{
	constructor (id, rootDir, appLoadCallback){

		// Call parents constructor with the default parameters for the App
		let allBehaviors = behaviors;
		allBehaviors.push({"app_load": appLoadCallback});

		super(
			{
				id,
				rootDir,
				relativeInitDir: app_initDir,
				initFilename: app_initFilename,
				notMute: true
			},
			allBehaviors
		);
	}

	getResource(resourceName){
		var resourceContext = new resource.ResourceContext(this, resourceName);
		return resourceContext.process();
	}
}

exports.App = App;