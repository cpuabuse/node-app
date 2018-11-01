"use strict";

const app = require("../src/app.js");
const path = require("path");
var example;

new Promise(function(resolve){
	example = new app.App("latin_classes", path.resolve(__dirname, "data/latin_classes"), () => resolve());
}).then(function(){
	example.getResource("index").then(data => console.log(data));
	example.getResource("css").then(data => console.log(data));
	example.getResource("markdown").then(data => console.log(data));
});