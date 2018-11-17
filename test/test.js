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

/**
 * Tests for the App class.
 * @member Loader
 * @memberof module:app~test
 */
describe("App", function() {
	var apps = [
		{
			name: "latin_classes",
			path: "test/latin_classes",
			requests: [
				"1"
			]
		}
	];
	apps.forEach(function(element){
		var appTest;
		var appPromise = new Promise(function(resolve){
			appTest = new app.App("latin_classes", path.resolve(__dirname, "latin_classes"), () => resolve());
		});
		if(element.hasOwnProperty("requests")){
			if(element.requests.length > 0){
				element.requests.forEach(function(request){
					appPromise.then(function(){
						appTest.getResource("db", "2").then(data => console.log(data));
					});
				});
			}
		}
	});
});