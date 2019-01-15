const puppeteer = require('puppeteer');
var fs = require('fs');

var text = fs.readFileSync('terms.txt', 'utf8');
var words = text.split('\n', 10);
var count = 0;
var dords = [];

for(var x = 0; x < words.length; x++){
	var str = words[x];
	for(var i = 0; i < str.length; i++){
		if(str[i] == " "){
			count = i;
			str = str.substr(0, count) + "+" + str.substr(count + 1);
		}


	}
	dords[x] = words[x];
	//console.log(count);
	words[x] = str;
	//console.log(str);
}

//console.log(words);

let wordtouse = "";
var testw = [];

for(var s = 0; s < words.length; s++){
	scraper(s);
}

console.log('\n\n')

function scraper(z){
	wordtouse = words[z];
	let scrape = async() =>  {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		await page.goto(`https://www.google.com/search?q=${words[z]}&oq=${words[z]}&aqs=chrome..69i57j0l5.4903j0j7&sourceid=chrome&ie=UTF-8`);
		await page.waitFor(3000);
		kords = dords[z];


		/*await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(2) > article > div.image_container > a > img');
		const result = await page.evaluate(() => {
			let title = document.querySelector('h1').innerText;
			let price = document.querySelector('.price_color').innerText;
			return {
				title,
				price
			}
		});*/

		const result = await page.evaluate(() => {
			let definition = document.querySelector('.ILfuVd').innerText;
			return definition;
		});
		console.log(kords + ":\n");
		console.log(result + '\n');
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n")
		browser.close();
		return result;
	}

	scrape().then((value) => {
		/*console.log(kords + ":\n");
		console.log(value + '\n');*/
	});
}
