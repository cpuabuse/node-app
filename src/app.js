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
 * @class
 * @extends module:system.System
 * @param {string} id Identifier of the app
 * @param {string} rootDir App root directory
 */
class App extends system.System{
	constructor (id, rootDir){

		// Call parents constructor with the default parameters for the App
		super(
			{
				id,
				rootDir,
				relativeInitDir: app_initDir,
				initFilename: app_initFilename,
				notMute: true
			},
			behaviors
		);
	}
}

exports.App = App;