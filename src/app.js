// app.js
/**
 * Creates an app based on System instance.
 * @module app
 */
"use strict";
const system = require("cpuabuse-system");
const fs = require("fs");
const path = require("path");
var md = require("markdown-it")(); // Presumabely constructs new instance, thus var

/**
 * Resource management
 * @class
 * @extends module:system.System
 * @param {string} id
 * @param {string} rootDir
 */
class App extends system.System{
	constructor(id, rootDir){
		/** @event module:app.App~app_load */
		let behaviors = [
			// Initialize resources
			{"system_load": () => {
				// Declare structures
				this.app = {
					rc: {}
				};

				// Anonymous async arrow function expression
				(async () => {
					// Local variables
					let rcFolder = this.folders.rc;
					let results = new Array();

					// Retrieve absolute paths
					let rcFolders = await this.system.file.list(rcFolder, this.system.file.filter.isDir);
					let rcAmount = rcFolders.length; // Amount of resources

					// Populate the promises
					rcFolders.forEach(folder => {
						results.push(Promise.all([
							this.system.file.toRelative(rcFolder, folder),
							this.system.file.toAbsolute(folder, "main.yml")
						]).then(result => {
							this.system.file.getFile(result[1]).then(file => {
								return new Promise(() => {
									this.app.rc[result[0]] = {
										main: system.System.yamlToObject(file)
									};
								})
							})
						}));
					});
					await Promise.all(results);
					console.log(this.app.rc.index);
					return true;
				})().then(() => this.fire("app_load")); // <== (async () => {...})();;
			}},
			// App post-load routines
			{"app_load" : () => {
				// this.initThings();
			}}
		];
		// Some constants to use in functionsm centralized here
		let initDir = "settings"; // The default directory relative to app root directory for init file
		let initFilename = "init"; // The default name for an init file

		// Call parents constructor with the default parameters for the App
		super(id, rootDir, initDir, initFilename, behaviors);
	}

	// Returns the resource object according to user input path
	getResourceByPath(url, resourceArray, appRequest){
		// Checks user input
		if (!resourceArray.hasOwnProperty(url)) {
			// TODO: switch to error
			throw 404;
		}
		
		// Checks internal application integrity
		// TODO: check that exists and what not, during app addition
		var resourceKey = resourceArray[url].rc;
		// TODO: switch to app context
		// if (!resources.hasOwnProperty(resourceKey)){
		// 	// TODO: switch to error
		// 	throw 500;
		// }
		
		return resourceKey;
	}

	/**
	 * Retrieves a resource
	 * @instance
	 * @param {string} [rc_name=index] [Optional], resource identifier
	 */
	rc(rc_name){
		// TODO: verify resource exists
		var rc = {};
		rc.appContext = this;
		// rc.resource
		rc.folder = path.resolve(this.system.rootDir, )

		App.resourceProcessor(this/* As a context */, this.resources[rc]);
	}

	// Return statusCode by the statusName
	getStatusCode (statusName) {
		// Verifies that the property exists
		if (!this.statusCodes.hasOwnProperty(statusName)){
			console.error("Status: '" + statusName + "' does not exist.");
			return (this.statusCodes.internal_server_error.code);
		}
		return this.statusCodes[statusName].code;
	}

	// Return statusText by the statusName
	getStatusText (statusName) {
		// Verifies that the property exists
		if (!this.statusCodes.hasOwnProperty(statusName)){
			console.error("Status: '" + statusName + "' does not exist.");
			return (this.statusCodes.internal_server_error.text);
		}
		return this.statusCodes[statusName].text;
	}

	// TODO: A function to retrieve the path by the name
	get_paths () {
		
	}

	// TODO: A function to retrieve the path by the url

	// TODO: A function to synchronize the current paths array to reverse paths array

	// A function to match the key of HTTP status code with relevant object
	getHTTPStatusCode (key){
		return 200;
	}

	/** 
	 * Returns one of the expected behaviors for the server to act
	 * @readonly
	 * @memberof App
	 * @returns {string} - Behavior
	 */
	get behavior(){
		return("ok");
	}

	// Process markdown
	static md(data){
		// Test process extra MD
		return md.render('### parsed from MD');
	}

	// Processes a specific resource command
	static async directiveProcessor(appContext, rcFolder, rc, rcContext){
		for(let directive in rc){
			// Switch on incoming command
			switch(directive){
				// Yaml
				case "yaml":
				case "yml":
				let yamlWithOperations = rc[directive].with;
				let yamlSrcWith = await App.operationProcessor(appContext, rcFolder, yamlWithOperations); // "With" clause

				return await system.System.yamlToObject(yamlSrcWith);				

				// IN
				case "in":
				return;

				// OUT
				case "out":
				return;

				// Get contents from the file
				case "file":
				return appContext.system.file.getFile(await appContext.system.file.toAbsolute(rcFolder, rc[directive]));

				case "nunjucks":
				case "njk":
				let withOperations = rc[directive].with;
				let argsOperations = rc[directive].with_args;
				let srcWith = await App.operationProcessor(appContext, rcFolder, withOperations); // "With" clause
				let srcArgs = await App.operationProcessor(appContext, rcFolder, argsOperations); // "Args" clause

				// Start njk shennanigans
				var nunjucks = require("nunjucks");
				nunjucks.configure(rcFolder);
				return await nunjucks.renderString(srcWith[0],srcArgs[0]);
				break;

				case "scss":
				let scssWithOperations = rc[directive].with;
				let scssSrcWith = await App.operationProcessor(appContext, rcFolder, scssWithOperations, rcContext);

				// Deal with SASS
				var sass = require("node-sass");
				let text = sass.renderSync({
					data: scssSrcWith[0]
				});
				
				return text.css.toString('ascii');
				break;

				case "md":
				let mdSrcWith = await App.operationProcessor(appContext, rcFolder, rc[directive].with, rcCOntext);

				var MarkdownIt = require('markdown-it'),
		    md = new MarkdownIt();
				return md.render(mdSrcWith[0]);


				// TODO: Default behavior, let us make it something noninterruptive
				default:
				throw defaultErr;
				break;
			}
		}
	}

	/**
	 * Processes an operation within resource
	 * @param {module:app~App} appContext Application to work on
	 * @param {string} rcFolder Current resource folder // TODO: move rc folder to rc context
	 * @param {object} rc Application resource object
	 * @param {object} [rcParentContext=null] Resource context of parent operation; If not specified, initial invocation is assumed
	 */
	static async operationProcessor(appContext, rcFolder, rc, rcParentContext){
		// Initialize the current operation rc context node
		let rcContext = new Object();
		rcContext.return = null; // "null" will be kept as nothing to "return"
		rcContext.operations = new Array();
		if(rcParentContext){
			// Chain the context
			rcContext.parent = rcParentContext;
			rcContext.depth = rcParentContext.depth + 1;
		} else { // We assume this is the "root" invocation of the resource chain
		// Process "root" resource context
			rcContext.parent, rcContext.depth = null;
		}

		// Invoke directives
		rc.forEach(function (operation) {
			rcContext.operations.push(App.directiveProcessor(appContext, rcFolder, operation, rcContext));
		});

		let results = await Promise.all(rcContext.operations);

		// FIXME: this is garbage
		if (results.length > 1) results[0] = results[1];
		return results;
	}

	/** Solely retrieves the resource by the key, we love strings */
	async getResource(rcKey){
		let rc = this.app.rc[rcKey].main;
		let rcFolder = await this.system.file.toAbsolute(this.folders.rc, rcKey);

		return await App.operationProcessor(this, rcFolder, rc);
	}
};

var fileProcessor = function(rc){
	fs.fileReadSync(rc);
}

exports.App = App;