"use strict";

/**
 * Series of tests for the app module.
 * @inner
 * @member test
 * @memberof module:app
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

const app = require("../src/app.js");
const path = require("path");
const assert = require("assert");
const expected = require("./expected.js");

/**
 * Tests for the App class.
 * @member Loader
 * @memberof module:app~test
 */
describe("App", function() {
	var apps = [
		// Latin classes
		{
			name: "latin_classes",
			path: "test/latin_classes",
			requests: [
				// Index - testing file directive
				{
					name: "index",
					value: expected.index,
					argument: null
				},
				// Markdown - testing markdown directive
				{
					name: "markdown",
					value: expected.markdown,
					argument: null
				},
				// Secret recipe - testing multiple directives sequence
				{
					name: "secret_recipe",
					value: expected.secretRecipe,
					argument: null
				},
				// Nunjucks - testing nunjucks directive
				{
					name: "nunjucks",
					value: expected.nunjucks,
					argument: null
				},
				// Yaml - testing yaml directive
				{
					name: "yaml",
					value: expected.yaml,
					argument: "salve"
				},
				// Words - testing "out: property" directive
				{
					name: "words",
					value: expected.words["1"],
					argument: "1"
				},
				// CSS - testing scss directive
				{
					name: "css",
					value: expected.css,
					argument: null
				},
				// DB - testing custom directive
				{
					name: "db",
					value: expected.db,
					argument: null
				}
			]
		}
	];
	// Process App class
	apps.forEach(function(element){
		var appTest;
		var appPromise = new Promise(function(resolve){
			appTest = new app.App("latin_classes", path.resolve(__dirname, "latin_classes"), () => resolve());
		});
		// Process resources if requests present
		if(element.hasOwnProperty("requests")){
			if(element.requests.length > 0){
				describe("#resource", function(){
					element.requests.forEach(function(request){
						// Process resource
						describe(request.name, function(){
							it("should produce expected output", function(done){
								appPromise.then(function(){
									appTest.getResource(request.name, request.argument).then(function(out){
										// Assert that output data is equal to expected value
										assert.equal(out.data, request.value);
										done();
									}).catch(function(error){
										done(error);
									});
								});
							});
						});
					});
				});
			}
		}
	});
});