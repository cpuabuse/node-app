// resource.js
/* Contains class helper for resource operation processing */
/* eslint no-underscore-dangle: ["error", { "allow": ["_with"] }] */// Allowing for the ouput of the directives
"use strict";
const system = require("cpuabuse-system");
const sass = require("node-sass");
const MarkdownIt = require("markdown-it");
const directives = {
	primary: ["file", "scss", "md", "njk", "raw"],
	secondary: ["with", "as"],
	in: ["in"],
	out: ["out"],
	aux: ["data","primaryCounter", "_with"] // Properties added to the object over which iteration is occurring may either be visited or omitted from iteration. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
};
const methods = {
	/**
	 * Primary operation
	 * @param {*} operation 
	 */
	async file(resource, operation){
		let path = await resource.root.parent.system.file.join(resource.root.parent.settings.folders.rc, resource.name);
		operation.data = resource.root.parent.system.file.getFile(path, operation.file);
	},
	async in(resource, operation){
	},
	async md(resource, operation){ /* eslint-disable-line require-await */// Preserving async throught directives
		var markdown = new MarkdownIt();
		operation.data = markdown.render(operation._with);
	},
	async scss(resource, operation){ /* eslint-disable-line require-await */// Preserving async throught directives
		let text = sass.renderSync({
			data: operation._with
		});

		operation.data = text.css.toString("utf-8");
	},
	async njk(resource, operation){
		let path = await resource.root.parent.system.file.join(resource.root.parent.settings.folders.rc, resource.name);
		operation.data = await resource.root.parent.app.njk(path, operation.njk, operation.hasOwnProperty("_with") ? operation._with : null);
	},
	async raw(resource, operation){ /* eslint-disable-line require-await */// Preserving async throught directives
		operation.data = operation.raw;
	},
	async with(resource, operation){
		var resourceContext = new ResourceContext(resource, resource.name);
		resourceContext.data = operation.with;
		operation._with = await resourceContext.process();
	},
	out(resource, operation){
		return new Promise(function(resolve){
			Promise.all(resource.data.filter(function(operation){
				return operation.hasOwnProperty("data");
			}).map(function(operation){
				return operation.data;
			})).then(function(data){
				switch(operation.out){
					case "raw":
					case "string":
					case "":
					case null:
					resource.out = data.join("");
					break;

					case "object":
					resource.out = JSON.parse(data.join(""));
					break;

					default:
					throw "error 4";
				}
				resolve();
			})
		});
	}
}

class ResourceContext extends system.AtomicLock{
	constructor(appOrParent, name){
		// Call superclass constructor
		super();

		if(appOrParent instanceof ResourceContext){
			this.depth = appOrParent.depth + 1;
			this.root = appOrParent.root;
			this.data = null;
		} else { // NOTE: Instance of App; since this file is to be called from App only, we assume there is no other instanceof possibility
			this.depth = 0;
			this.root = this;
			this.parent = appOrParent;
			this.data = JSON.parse(JSON.stringify(appOrParent.app.rc[name].main));
		}
		this.name = name;
		this.directives = {
			in: [],
			secondary: [],
			primary: [],
			out: []
		};
	}

	// FIXME: add description that we split into primary in out secondary for code maintainability
	async process(){
		// For each entry in the data array
		this.data.forEach(operation => {
			// Initialize primary directive counter
			this.primary = false;
			// Preprocess preparation
			for (let directive in operation){ // For each directive in the data array element
				if(directives.primary.includes(directive)){ // Primary directives
					this.directives.primary.push(() => { // Arrow, since this used for directives
						this.lock();
						if(operation.hasOwnProperty("primaryCounter")){
							throw "some error";
						}
						operation.primaryCounter = null;
						this.release();

						return methods[directive](this, operation);
					});
				} else if(directives.out.includes(directive)){
					this.directives.out.push(() => methods[directive](this, operation));
				} else if(directives.in.includes(directive)){
					this.directives.in.push(() => methods[directive](this, operation));
				} else if(directives.secondary.includes(directive)){
					this.directives.secondary.push(() => methods[directive](this, operation));
				} else if(!directives.aux.includes(directive)){
					throw "some error2";
				}
			} // <== for directive in operation
		})

		// Populate for default out: raw
		if(this.directives.out.length == 0){
			let len = this.data.push({out: "raw"});
			this.directives.out.push(() => methods.out(this, this.data[len - 1]))
			console.log(this.data);
		}

		// Populate for default in: raw
		if(this.directives.in.length == 0){
			let len = this.data.push({in: "raw"});
			this.directives.in.push(() => methods.in(this, this.data[len - 1]))
		}

		// Call directives
		await Promise.all(this.directives.in.map(f => f())); // "in"
		await Promise.all(this.directives.secondary.map(f => f())); // Secondary
		await Promise.all(this.directives.primary.map(f => f())); // Primary
		await Promise.all(this.directives.out.map(f => f())); // "out"

		// Return
		return this.out;
	} // <== process()
}

exports.ResourceContext = ResourceContext;