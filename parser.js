const puppeteer = require('puppeteer');
var fs = require('fs');

var max_iterations = 104;

var text = fs.readFileSync('terms.txt', 'utf8');
var stream = fs.createWriteStream('parserdata');
var words = text.split('\n', max_iterations);
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
	words[x] = str;
}

var testw = [];
let data = "";

let p = 0;

var iterations = 0;
var interval = setInterval(function() {scraper(iterations);}, 4000);

console.log('\n\n')

function scraper(z){

	let scrape = async() =>  {

		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		await page.goto(`https://www.google.com/search?q=${words[z]}&oq=${words[z]}&aqs=chrome..69i57j0l5.4903j0j7&sourceid=chrome&ie=UTF-8`);	
		await page.waitFor(1000);

		const test = await page.evaluate(() => {
			let test = document.querySelector('.ILfuVd').innerText;
			return test;
		});

		kords = dords[z];

		const result = await page.evaluate(() => {
			let definition = document.querySelector('.ILfuVd').innerText;
			return definition;
		});

		console.log(kords + ":\n");
		iterations++;

		if(result){
			console.log(result + '\n');
		}
		else{
			console.log('-Definiton not found!-');
		}

		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n");
		
		browser.close();
		
		return (kords + ":\n\n" + result + "\n\n\n"); 
	}

	scrape().then((value) => {

		stream.write(value);
		
		if(iterations == max_iterations){
			clearInterval(interval);
		}
		
		p == max_iterations ? stream.end() : p++;
	});
}
