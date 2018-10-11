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

/**
 * Application
 *
 * Requires app.yml and events.yml initialized with init.yml by the system, all residing in the settings folder within the app root.
 * @extends module:system.System
 * @param {string} id Identifier of the app
 * @param {string} rootDir App root directory
 */
class App extends system.System{
	constructor (id, rootDir, appLoadBehavior){

		// Call parents constructor with the default parameters for the App
		let allBehaviors = behaviors;
		appLoadBehavior = (that) => {
			console.log(that);
		}
		allBehaviors.push({"app_load": appLoadBehavior});
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

	processOperation(rcParentContext){
		// Initialize current operation node
		var rcContext = new Object();

		if(rcParentContext){
			// Chain the context
			rcContext.parent = rcParentContext;
			rcContext.depth = rcParentContext.depth + 1;
		} else { // We assume this is the "root" invocation of the resource chain
		// Process "root" resource context
			rcContext.parent = null;
			rcContext.depth = 0;
		}
	}
}

exports.App = App;