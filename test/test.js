"use strict";

const app = require("../src/app.js");
const path = require("path");
var example;

new Promise(function(resolve){
	example = new app.App("latin_classes", path.resolve(__dirname, "data/latin_classes"), () => resolve());
}).then(function(){
	example.getResource("db", "2").then(data => console.log(data));
});