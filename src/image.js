// image.js
/*
 * Image manipulation.
 */
"use strict";

const Jimp = require("jimp");

/**
 * Composes multiple images one offset by another into a single PNG image.
 * Transparency is preserved.
 * @param {Buffer[]} images An array of image buffers.
 * @returns	{external:Promise} A promise with a buffer containing an image output.
 */
function composeImage(images){
	if (Array.isArray(images)){
		return new Promise(function(resolve, reject){
			// Create array of promises containing images
			let imagePromises = images.map(function(element){
				return Jimp.read(element);
			});

			// Create and work on array of images
			Promise.all(imagePromises).then(function(imageArray){
				// Calculate maximum width among the images
				let maxWidth = Math.max(...imageArray.map(function(image){
					return image.bitmap.width;
				}));

				// Calculate sum of image heights
				let totalHeight = 0;
				for (let image of imageArray){
					totalHeight += image.bitmap.height;
				}

				// Generate new JIMP instance
				let jimpImage = new Jimp(maxWidth, totalHeight, 0, (err, canvas) => {
					if (err){
						reject(err);
					} else {
						let currentOffset = 0;
						for (let image of imageArray){
							canvas.composite(image, 0, currentOffset, {
								mode: Jimp.BLEND_OVERLAY
							});
							currentOffset += image.bitmap.height;
						}
						jimpImage.getBuffer(Jimp.MIME_PNG, function(err, result){
							if (err){
								reject(err);
							} else {
								resolve(result);
							}
						});
					}
				});
			}, function(err){
				reject(err);
			});
		});
	} else { // <== if (Array.isArray(images))
		return Promise.reject(new Error("Arguments inconsistent."));
	}
}

module.exports = {
	composeImage
}