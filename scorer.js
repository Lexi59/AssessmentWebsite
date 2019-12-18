let input, submit, reset, output;
let paddingValue = "                              ";
let digitalStringsNum = 11;
let nondigitalStringsNum = 9;
let digitalStringsFound = new Array(digitalStringsNum);
let nondigitalStringsFound = new Array(nondigitalStringsNum);
let digitalStringsToLookFor = ["online", "technolog", "project management", "project plan", "digital librar", "digital project", "digital technique", "design process", "automated", "digital project management", "digital"];
let nondigitalStringsToLookFor = ["non-digital", "manual", "paper","bulletin board", "process", "project management", "project plan", "non-digital project management", "project scheduling"];

function setup(){
	createCanvas(windowWidth, windowHeight);
	input = createElement('textarea');
	input.size(windowWidth/2, windowHeight/4);
	input.position(windowWidth/4, 10);
	submit = createButton("Submit");
	submit.size(100, 20);
	submit.position(windowWidth/2-110, windowHeight/4+20);
	submit.mousePressed(submitBtnPressed);
	output = createElement('textarea');
	output.size(windowWidth/2, windowHeight/4);
	output.position(windowWidth/4, windowHeight/4 + 50);
	reset = createButton("Reset");
	reset.size(100, 20);
	reset.position(windowWidth/2+ 10, windowHeight/4+20);
	reset.mousePressed(resetBtnPressed);

	for(var i = 0; i < digitalStringsNum; i++){
		digitalStringsFound[i] = 0;
	}
	for(var i = 0; i < nondigitalStringsNum; i++){
		nondigitalStringsFound[i] = 0;
	}
}
function submitBtnPressed(){
	var text = input.value().toLowerCase();
	console.log(text);
	for(var i = 0; i < nondigitalStringsNum; i++){
		while(text.indexOf(nondigitalStringsToLookFor[i]) != -1){
			nondigitalStringsFound[i]++;
			text = text.replace(nondigitalStringsToLookFor[i],"");
		}
		console.log(nondigitalStringsToLookFor[i] + ": " + nondigitalStringsFound[i]);
	}
	for(var i = 0; i < digitalStringsNum; i++){
		while(text.indexOf(digitalStringsToLookFor[i]) != -1){
			digitalStringsFound[i]++;
			text = text.replace(digitalStringsToLookFor[i],"");
		}
		console.log(digitalStringsToLookFor[i] + ": " + digitalStringsFound[i]);
	}
	outputresults();
}
function outputresults(){
	var string = "";
	var total = 0;
	for(var i = 0; i < digitalStringsNum; i++){
		string += (digitalStringsToLookFor[i]+paddingValue).slice(0,paddingValue.length) + " " + digitalStringsFound[i] + "\n";
		total += digitalStringsFound[i];
	}
	string += ("DIGITAL TOTAL:"+paddingValue).slice(0, paddingValue.length) + " " + total + "\n\n";
	total = 0
	for(var i = 0; i < nondigitalStringsNum; i++){
		string += (nondigitalStringsToLookFor[i]+paddingValue).slice(0,paddingValue.length) + " " + nondigitalStringsFound[i] + "\n";
		total += nondigitalStringsFound[i];
	}
	string += ("NON-DIGITAL TOTAL:"+paddingValue).slice(0, paddingValue.length) + " " + total;
	output.value(string);
}
function resetBtnPressed(){
	input.value();
	output.value();
	for(var i = 0; i < digitalStringsNum; i++){
		digitalStringsFound[i] = 0;
	}
	for(var i = 0; i < nondigitalStringsFound; i++){
		nondigitalStringsFound[i] = 0;
	}
}
