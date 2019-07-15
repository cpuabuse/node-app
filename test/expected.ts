// expected.js
/*
	Contains rather large expected assertion constants for testing.
*/

const index = `<!doctype html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="/style.css">
	<title>Raw resource</title>
</head>
<html>
	<body>
		<main>
			<h1>Lorem ipsum</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</main>
	</body>
</html>`;

const markdown = `<h1>Latin</h1>
<h2>About</h2>
<p>Latin was originally spoken in the area surrounding Rome, known as Latium.</p>
<h2>How</h2>
<p>Through the power of the Roman Republic, it became the dominant language, initially in Italy and subsequently throughout the western Roman Empire.</p>
<h2>What</h2>
<p>Vulgar Latin developed into the Romance languages, such as Italian, Portuguese, Spanish, French, and Romanian.</p>
`;

const secretRecipe = `<p>Cake is made of:</p>
<ul>
<li>Flour</li>
<li>Sugar</li>
<li>Butter</li>
<li>Milk</li>
<li>Egg</li>
<li>Cocoa</li>
<li>Sesame seeds</li>
</ul>
<p>Very delicious!</p>`;

const nunjucks = "Salve, Mundi!";

const yaml = "mundi";

const words = {
	1: {
		q: "luna",
		a: "moon"
	},
	2: {
		q: "meus",
		a: "my"
	},
	3: {
		q: "ordo",
		a: "rank"
	},
	4: {
		q: "perculsus",
		a: "shock"
	}
};

const css = `body {
  font: 100% Helvetica, sans-serif;
  color: #333; }
`;

const db = [
	{
		q: "luna",
		a: "moon"
	},
	{
		q: "meus",
		a: "my"
	},
	{
		q: "ordo",
		a: "rank"
	},
	{
		q: "perculsus",
		a: "shock"
	}
];

module.exports = {
	index,
	markdown,
	secretRecipe,
	nunjucks,
	yaml,
	words,
	css,
	db
};
