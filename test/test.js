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
const image = require("../src/image.js");
const path = require("path");
const assert = require("assert");
const expected = require("./expected.js");

describe("image", function(){
	it("should be same as pre-composed image", function(done){
		let res = image.composeImage(["test/latin_classes/file/img/OpenGL_170px_June16.png", "test/latin_classes/file/img/Vulkan_170px_Dec16.png"]);
		res.then(function(value){
			assert.deepEqual(value, require("fs").readFileSync("test/latin_classes/file/img/opengl_vulkan.png"));
			done();
		})
	});
});

/**
 * Tests for the App class.
 * @member App
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
					argument: null,
					mime: "text/html"
				},
				// Markdown - testing markdown directive
				{
					name: "markdown",
					value: expected.markdown,
					argument: null,
					mime: "text/html"
				},
				// Secret recipe - testing multiple directives sequence
				{
					name: "secret_recipe",
					value: expected.secretRecipe,
					argument: null,
					mime: "text/html"
				},
				// Nunjucks - testing nunjucks directive
				{
					name: "nunjucks",
					value: expected.nunjucks,
					argument: null,
					mime: "text/plain"
				},
				// Yaml - testing yaml directive
				{
					name: "yaml",
					value: JSON.stringify(expected.yaml),
					argument: "salve",
					mime: "application/json"
				},
				// Words - testing "out: property" directive
				{
					name: "words",
					value: JSON.stringify(expected.words["1"]),
					argument: "1",
					mime: "application/json"
				},
				// CSS - testing scss directive
				{
					name: "css",
					value: expected.css,
					argument: null,
					mime: "text/css"
				},
				// DB - testing custom directive
				{
					name: "db",
					value: JSON.stringify(expected.db),
					argument: null,
					mime: "application/json"
				},
				// Image - testing image composing
				{
					name: "image",
					value: require("fs").readFileSync("test/latin_classes/file/img/opengl_vulkan.png"),
					argument: null,
					mime: "image/png"
				}
			]
		}
	];
	// Process App class
	apps.forEach(function(element){
		var appTest;
		var appPromise = new Promise(function(resolve){
			appTest = new app.App("latin_classes", path.resolve(__dirname, "latin_classes"), "off", () => resolve());
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
										if (request.name == "words") {
											//console.log(out);
										}
										assert.strictEqual(out.data, request.value);
										assert.strictEqual(out.lType, request.mime);
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