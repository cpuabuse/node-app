"use strict";

const app = require("../src/app.js");
const path = require("path");

var example = new app.App("latin_classes", path.resolve(__dirname, "data/latin_classes"));

example.processOperation();