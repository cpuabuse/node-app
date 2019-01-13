"use strict";
var Jimp = require("jimp");
/**
 * @param {Buffer[]} images An array of image buffers
 */
function composeImage(images){
	// Stack all images into one png
	let imagePromises = images.map(function(element){
		return new Promise(function(resolve, reject){
			Jimp.read(element).then(image => {
				resolve(image);
			});
		});
	});
	Promise.all(imagePromises).then(function(imageArray){
		let maxWidth = Math.max(imageArray.map(function(image){
			return image.bitmap.width;
		}));
		console.log(maxWidth);

		let totalHeight = 0;
		for (let image in imageArray){
			totalHeight += image.bitmap.height;
		}
		console.log(totalHeight);

		// Generate new JIMP instance
		let jimpImage = new Jimp(maxWidth, totalHeight, 0, (err, canvas) => {
			let currentOffset = 0;
			for (image in imageArray){
				canvas.composite(image, 0, currentOffset, {
					mode: Jimp.BLEND_OVERLAY
				});
				currentOffset += image.bitmap.height;
			}
		});
	});
};