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
	return new Promise(function(resolve, reject){
		// Create array of promises containing images
		let imagePromises = images.map(function(element){
			return new Promise(function(resolve, reject){
				Jimp.read(element).then(function(err, image){
					if (err){
						reject(err);
					} else {
						resolve(image);
					}
				});
			});
		});

		// Create and work on array of images
		Promise.all(imagePromises).then(function(imageArray){
			// Calculate maximum width among the images
			let maxWidth = Math.max(imageArray.map(function(image){
				return image.bitmap.width;
			}));

			// Calculate sum of image heights
			let totalHeight = 0;
			for (let image in imageArray){
				totalHeight += image.bitmap.height;
			}

			// Generate new JIMP instance
			let jimpImage = new Jimp(maxWidth, totalHeight, 0, (err, canvas) => {
				if (err){
					reject(err);
				} else {
					let currentOffset = 0;
					for (let image in imageArray){
						canvas.composite(image, 0, currentOffset, {
							mode: Jimp.BLEND_OVERLAY
						});
						currentOffset += image.bitmap.height;
					}
					resolve(jimpImage.getBufferAsync(Jimp.MIME_PNG));
				}
			});
		}, function(err){
			reject(err);
		});
	});
}

module.exports = {
	composeImage
}