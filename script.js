
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCQaaAZDBlSXOEdwt0eWw7IXQsVdMpkEbY",
    authDomain: "assessmentapp-1d809.firebaseapp.com",
    databaseURL: "https://assessmentapp-1d809.firebaseio.com",
    projectId: "assessmentapp-1d809",
    storageBucket: "assessmentapp-1d809.appspot.com",
    messagingSenderId: "611482106673",
    appId: "1:611482106673:web:671ee495368e10114d4e10",
    measurementId: "G-870JKWYNGS"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var studentsDB = firebase.database().ref("students");
  var testsDB = firebase.database().ref("tests");

let currentQuestion = 0;
let currentAnswers = [];
let notes = [];
let currentChild = "";
let currentTab = "Math";
let testDiv, txtQuestion, imgQuestion;
const mathAssessments = ["Identify Numbers 1-10","Identify Numbers 10-20","Identify Numbers 20-30", "Counting","Identify Colors","Greater Than/Less Than","Pattern Recognition","2D Shapes", "3D Shapes","Coins"];
const mathAssessmentsFunctions = [idNums1to10, idNums10to20, idNums20to30, counting, colors, gtandlt, patternRecog, shapes2D, shapes3D, coins];
const readingAssessments = ["Positional Words","Days of the Week","Months","Identify Letters","Identify Letter Sounds","Long Vowel Sounds","Blending Sounds","Blending Nonsense Sounds","Beginning/Middle/Ending Sounds","Color Words","Number Words","Sight Words 1","Sight Words 2"];
const readingAssessmentsFunctions = [positional, days, months, idLetters, idLetterSounds, longVowels, blendingSounds, blendingNonsense, bmeSounds, colorWords, numberWords, sightOne, sightTwo];
const phonicsAssessments = ["Rhyming","Blending","Segmenting","Syllables","Phoneme Substitution","Phoneme Deletion"];
const phonicsAssessmentsFunctions = [rhyming, blending, segmenting, syllables, substitution, deletion];

function getUrlVars() { 
    var vars = {}; 
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { 
       vars[key] = value; 
    });
    return vars; 
}
function createStudent(){
    var name = prompt("Enter a name:");
    const data = {name};
    studentsDB.push().set(data);
    location.reload();
}
function removeStudent(){
    var rname = prompt("Enter a name:");
    console.log("made it here");    
    const children = getStudents().then(function(children){
        var keys = Object.keys(children);
        for(var i = 0; i < keys.length; i++){
            console.log(children[keys[i]].name);
            console.log(rname);
            if (children[keys[i]].name == rname){
                console.log("key found");
                studentsDB.child(keys[i]).remove();
            }
        }
        location.reload();
    });
}
function changeTab(newTab){
    let math = document.getElementById('math');
    let reading = document.getElementById('reading');
    let phonics = document.getElementById('phonics');
    let table = document.getElementById('rosterTable');
    table.innerHTML = "";

    if(currentTab == "Math"){math.classList = "";}
    else if (currentTab == "Reading"){reading.classList = "";}
    else{phonics.classList = "";}
    if(newTab == "Math"){math.classList = "active"; createRosterTable(table, mathAssessments);}
    else if (newTab == "Reading"){reading.classList = "active"; createRosterTable(table, readingAssessments);}
    else{phonics.classList = "active"; createRosterTable(table, phonicsAssessments);}
    currentTab = newTab; 
}
function createRosterTable(table, assessments){
  let thead = table.createTHead();
  let row = thead.insertRow();
  let headers = ["Name"];
  let data = headers.concat(assessments);
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
  const children = getStudents().then(function(children){
    var keys = Object.keys(children);
    for(var i = 0; i < keys.length; i++){
        console.log(children[keys[i]]);
    }
    for(var i = 0; i < keys.length; i++){
        let row = table.insertRow();
        let text = document.createElement('a');
        text.textContent = children[keys[i]].name;
        text.href = "reports.html?name="+encodeURI(children[keys[i]].name);
        let cell = row.insertCell();
        cell.appendChild(text);
        for(var k = 0; k < assessments.length; k++){
            row.insertCell();
        }
    }
    const tests = getTests().then(function(tests){
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var col, row, currentTestTime = " ";
        var keys2 = Object.keys(tests);
        for(var i = 0; i < keys2.length; i++){
            currentTest = tests[keys2[i]];
            currentTestTime = parseInt(tests[keys2[i]].timestamp);
            for(t = 0 ; t < assessments.length; t++){
                if(currentTest.assessment == assessments[t]){
                    col = t+1;
                }
            }
            for(n = 0; n < keys.length; n++){
                if(currentTest.currentChild == children[keys[n]].name){
                    row = n + 1 ;
                }
            }
            if(currentTestTime>0){
                table.rows[row].cells[col].innerHTML = months[new Date(currentTestTime).getMonth()];
            }
        }
    })
  });
}
function report(){
    document.getElementById('name').textContent = decodeURI(getUrlVars()['name']);
    child = decodeURI(getUrlVars()['name']);
    const tests = getTests().then(function(tests){
        var keys = Object.keys(tests);
        for(var j = 0; j < keys.length; j++){
            if(tests[keys[j]].currentChild == child){
                for(var i =0; i < tests[keys[j]].questions.length; i++){
                    let newLi = document.createElement('li');
                    if(tests[keys[j]].currentAnswers[i] == "No"){
                        if(typeof tests[keys[j]].questions[i] == "string" && tests[keys[j]].questions[i].includes(".")){
                            newLi.textContent = tests[keys[j]].questions[i].split(".")[0];
                        }
                        else{
                            newLi.textContent = tests[keys[j]].questions[i];
                        }
                        if(tests[keys[j]].notes[i] !=""){
                            newLi.textContent += " (" + tests[keys[j]].notes[i] + ")";
                        }
                    }
                    document.getElementById(tests[keys[j]].assessment).appendChild(newLi);
                }
            }
        }
    });
}
function createAssessmentPageTable(table, assessment){
    let thead = table.createTHead();
    let row = thead.insertRow();
    let data = ["Name", assessment];
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
    const children = getStudents().then(function(children){
        var keys = Object.keys(children);
        for(var i = 0; i < keys.length; i++){
            let row = table.insertRow();
            let text = document.createElement('a');
            text.textContent = children[keys[i]].name;
            text.id = children[keys[i]].name;
            text.onclick = function(){assessChild(this.id);}
            let cell = row.insertCell();
            cell.appendChild(text);
            //extra cell for assessment
            row.insertCell();
        }
        const tests = getTests().then(function(tests){
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var col, row, currentTestTime = " ";
            var keys2 = Object.keys(tests);
            for(var i = 0; i < keys2.length; i++){
                currentTest = tests[keys2[i]];
                currentTestTime = parseInt(tests[keys2[i]].timestamp);
                for(n = 0; n < keys.length; n++){
                    if(currentTest.currentChild == children[keys[n]].name){
                        row = n + 1 ;
                    }
                }
                if(currentTestTime>0){
                    table.rows[row].cells[1].innerHTML = months[new Date(currentTestTime).getMonth()];
                }
            }
        })
    });
}
async function getStudents(){
    var data;
    let children = await studentsDB.once('value').then(snapshot=>{
        if(snapshot){
            data = snapshot.val();
        }
      });
    return data;
}
async function getTests(){
    var data;
    let children = await testsDB.once('value').then(snapshot=>{
        if(snapshot){
            data = snapshot.val();
        }
      });
    return data;
}
function load(){  
    var title = getUrlVars()["title"];
    document.getElementById("assessTitle").textContent = decodeURI(title);
    createAssessmentPageTable(document.getElementById("childList"), document.getElementById("assessTitle").textContent);
    testDiv = document.getElementById("testDiv");
    txtQuestion = document.getElementById("textQuestion");
    imgQuestion = document.getElementById("imgQuestion");
}
function assessChild(child){
    var childName = document.getElementById("assessingChild");
    childName.textContent = child;
    currentChild = child;
    childName.style.display = "block";
    document.getElementById("childList").style.display = "none";
    testDiv.style.display = "block";
    continueAssessment();
}
function continueAssessment(){
    for(var i = 0; i < mathAssessments.length; i++){
        if(mathAssessments[i] == document.getElementById("assessTitle").textContent){
            mathAssessmentsFunctions[i]();
        }
    }    
    for(var i = 0; i < readingAssessments.length; i++){
        if(readingAssessments[i] == document.getElementById("assessTitle").textContent){
            readingAssessmentsFunctions[i]();
        }
    }
    for(var i = 0; i < phonicsAssessments.length; i++){
        if(phonicsAssessments[i] == document.getElementById("assessTitle").textContent){
            phonicsAssessmentsFunctions[i]();
        }
    }
}
function finishAssessment(assessment, questions){
    //score answers
    var correct = 0;
    for(var i = 0; i < questions.length; i++){
        console.log(questions[i]);
        if(typeof questions[i] == String && questions[i].includes(".")){
            questions[i] = questions[i].split(".")[0];
        }
        if(currentAnswers[i] == "Yes"){correct++;}
    }
    console.log("Overall: " + correct + "/"+ questions.length);
    //send to database
    var timestamp = new Date().getTime();
    const data = {currentChild, assessment, questions, currentAnswers, notes, correct, timestamp};
    testsDB.push().set(data);
    //reset everything
    currentAnswers = [];
    notes = [];
    testDiv.style.display = "none";
    document.getElementById("done").style.display = "block";
    setTimeout(() => { window.history.back(); }, 1500);
}
function recordYes(){
    currentAnswers.push("Yes");
    notes.push(document.getElementById("noteBox").value);
    document.getElementById("noteBox").value = "";
    currentQuestion++;
    continueAssessment();
}
function recordNo(){
    currentAnswers.push("No");
    notes.push(document.getElementById("noteBox").value);
    document.getElementById("noteBox").value = "";
    currentQuestion++;
    continueAssessment();
}
function goBack(){
    temp = notes.pop();
    currentAnswers.pop();
    document.getElementById("noteBox").value = temp;
    currentQuestion--;
    continueAssessment();
}
function viewSettings(txt,img){
    txtQuestion.style.fontSize = "1500%";
    txtQuestion.style.margin = "0 0 .25em 0";
    if(txt){txtQuestion.style.display = "block";}
    else{txtQuestion.style.display = "none";}
    if(img){document.getElementById("imgDiv").style.display = "block";}
    else{document.getElementById("imgDiv").style.display = "none";}
}

//assessments
function idNums1to10(){
    viewSettings(true,false);
    var questions = [3,9,5,2,1,7,6,4,0,10,8];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[0], questions);
    }
}
function idNums10to20(){
    viewSettings(true,false);
    var questions = [11,18,12,15,17,14,19,13,16,10,20];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[1], questions);
    }
}
function idNums20to30(){
    viewSettings(true,false);
    var questions = [25,23,28,24,20,27,26,22,21,29,30];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[2], questions);
    }
}
function colors(){
    viewSettings(false,true);
    var questions = ["red.png","black.jpg","blue.jpg","brown.png","green.jpg","grey.png","orange.jpg","pink.jpg","purple.jpg","white.jpg","yellow.jpg"];
    if(currentQuestion<questions.length){
        imgQuestion.src = "resources/"+questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[4], questions);
    }
}
function counting(){
    var questions = ["Count by 1's","Count by 10's","Count by 5's","Count by 2's","Backwards From 5","Backwards from 15","Backwards from 20"];
    var questions2 = ["Count forward from 4","Count forward from 6", "Count forward from 7","Count forward from 10","Count forward from 19","Count forward from 37"];
    var questions3 = ["4.PNG","5.PNG","7.PNG","9.PNG","16.PNG"];
    var questions4 = ["Give me 4 blocks","Give me 6 blocks","Give me 10 blocks","Give me 12 blocks"];
    var allQuestions = [];
    allQuestions = questions.concat(questions2);
    allQuestions = allQuestions.concat(questions3);
    allQuestions = allQuestions.concat(questions4);
    
    if(currentQuestion<questions.length){
        viewSettings(true,false);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.textContent = questions[currentQuestion];
    }
    else if (currentQuestion < questions.length + questions2.length){
        viewSettings(true,false);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.textContent = questions2[currentQuestion-questions.length];
    }
    else if(currentQuestion < questions.length+questions2.length+questions3.length){
        viewSettings(false,true);
        imgQuestion.src = "resources/"+questions3[currentQuestion-questions.length-questions2.length];
    }
    else if(currentQuestion < questions.length + questions2.length+questions3.length + questions4.length){
        viewSettings(true,false);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.textContent = questions4[currentQuestion-questions.length-questions2.length-questions3.length];
    }
    else{
        finishAssessment(mathAssessments[3], allQuestions);
    }
}
function gtandlt(){
    var gtquestions = ["gt35.PNG","gt62.PNG","gt75.PNG","gt47.PNG","gt82.PNG","gt55.PNG","gt24.PNG","gt108.PNG"];
    var ltquestions = ["lt55.PNG","lt169.PNG","lt24.PNG","lt126.PNG","lt20.PNG","lt49.PNG","lt63.PNG","lt81.PNG"];
    var allQuestions = gtquestions.concat(ltquestions);
    viewSettings(true,true);
    txtQuestion.style.fontSize = "300%";
    if(currentQuestion < gtquestions.length){
        txtQuestion.textContent = "Which is greater?";
        imgQuestion.src = "resources/"+gtquestions[currentQuestion];
    }
    else if (currentQuestion<gtquestions.length + ltquestions.length){
        txtQuestion.textContent = "Which is less?";
        imgQuestion.src = "resources/"+ltquestions[currentQuestion-gtquestions.length];
    }
    else{
        finishAssessment(mathAssessments[5], allQuestions);
    }
}
function patternRecog(){
    var questions = ["ababab.PNG","abbabb.PNG","aabaab.PNG","abcabc.PNG"];
    viewSettings(false,true);
    if(currentQuestion< questions.length){
        imgQuestion.src="resources/"+questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[6], questions);
    }
}
function shapes2D(){
    var questions = ["circle.png","rectangle.png","diamond.png","oval.png","triangle.png","square.png","hexagon.png"];
    viewSettings(false,true);
    if(currentQuestion< questions.length){
        imgQuestion.src="resources/"+questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[7], questions);
    }
}
function shapes3D(){
    var questions = ["cone.jpg","sphere.jpg","cube.jpg","cylinder.jpg","pyramid.jpg"];
    viewSettings(false,true);
    if(currentQuestion< questions.length){
        imgQuestion.src="resources/"+questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[8], questions);
    }
}
function coins(){
    var questions = ["penny value.png","dime name.png","quarter value.png","nickel name.png","dime value.png", "penny name.png", "quarter name.png", "nickel value.png"];
    viewSettings(true,true);
    txtQuestion.style.fontSize = "500%";
    if(currentQuestion<questions.length){
        if(questions[currentQuestion].includes('name')){txtQuestion.textContent = "Name";}
        else{txtQuestion.textContent = "Value";}
        imgQuestion.src = "resources/"+questions[currentQuestion];
    }
    else{
        finishAssessment(mathAssessments[9],questions);
    }
}


function positional(){
    var questions = ["bottom","top","over","under","beside","behind"];
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    if(currentQuestion< questions.length){
        txtQuestion.textContent = questions[currentQuestion]
    }
    else{
        finishAssessment(readingAssessments[0], questions);
    }
}
function days(){
    var questions = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    if(currentQuestion< questions.length){
        txtQuestion.textContent = questions[currentQuestion]
    }
    else{
        finishAssessment(readingAssessments[1], questions);
    }
}
function months(){
    var questions = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    if(currentQuestion< questions.length){
        txtQuestion.textContent = questions[currentQuestion]
    }
    else{
        finishAssessment(readingAssessments[2], questions);
    }
}

function idLetters(){
    viewSettings(true,false);
    var questions = ['M','O','E','P','S','X','U','B','K','Z','N','G','A','J','R','D','I','Q','W','F','C','Y','L','H','V','T',
                    'm','o','e','p','s','x','u','b','k','z','n','g','a','j','r','d','i','q','w','f','c','y','l','h','v','t'];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[3], questions);
    }
}
function idLetterSounds(){
    viewSettings(true,false);
    var questions = ['m','o','e','p','s','x','u','b','k','z','n','g','a','j','r','d','i','q','w','f','c','y','l','h','v','t'];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[4], questions);
    }
}
function longVowels(){
    viewSettings(true,false);
    var questions = ['a','e','i','o','u'];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[5], questions);
    }  
}
function blendingSounds(){
    viewSettings(true,false);
    var questions = ["mom","dad","dog","rat","cut","pet","fin","hem","sad","vet","win","nod","cub","job"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[6], questions);
    }  
}
function blendingNonsense(){
    viewSettings(true,false);
    var questions = ["fub","dod","fic","sep","vod","jap","wib","hep","nax","mun","lom","fak","tef","bep"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[7], questions);
    }  
}
function bmeSounds(){
    var questions = ["pig.png","jar.png","apple.png","hat.png","net.png","dog.png","moon.png","net.png","gum.png","cup.png","sun.png","bus.png","log.png","top.png","octopus.png","mop.png"];
    viewSettings(false,true);
    document.getElementById("imgDiv").style.height = "350px";
    if(currentQuestion< questions.length){
        imgQuestion.src="resources/"+questions[currentQuestion];
    }
    else{
        document.getElementById("imgDiv").style.height = "250px";
        finishAssessment(readingAssessments[8], questions);
    }
}
function colorWords(){
    viewSettings(true,false);
    var questions = ["red","purple","green","blue","brown","pink","orange","yellow","black","white"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[9], questions);
    }  
}
function numberWords(){
    viewSettings(true,false);
    var questions = ["two","four","six","eight","ten","three","one","five","seven","nine"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[10], questions);
    }  
}
function sightOne(){
    viewSettings(true,false);
    var questions = ["I","am","the","little","a","to","have","is","we","like","my","he","for","me","with","she",
                    "see","look","they","you","of","are","that","do","here","go","from","what","said","where",
                    "was","come"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[11], questions);
    }  
}
function sightTwo(){
    viewSettings(true,false);
    var questions = [];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(readingAssessments[12], questions);
    }  
}
function rhyming(){
    var questions = ["sit/hit","run/red","hair/care","fast/last","king/hard"];
    var questions2 = ["sat","may","red","lake","fan"];
    var questions3 = ["beeBat.png","hatBat.png","moonSpoon.png","moonTree.png","beeTree.png","starHat.png","starCar.png"];
    var allQuestions = questions.concat(questions2);
    if(currentQuestion < questions.length){
        viewSettings(true,false);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.style.margin = "0 0 1.5em 0";
        txtQuestion.textContent = "Do these words rhyme? "+questions[currentQuestion];
    }
    else if (currentQuestion<questions.length + questions2.length){
        viewSettings(true,false);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.style.margin = "0 0 1.5em 0";
        txtQuestion.textContent = "What rhymes with "+ questions2[currentQuestion-questions.length] + "?";
    }
    else if(currentQuestion<questions.length+questions2.length+questions3.length){
        viewSettings(true,true);
        txtQuestion.style.fontSize = "300%";
        txtQuestion.textContent = "Do these words rhyme?";
        imgQuestion.src = "resources/"+questions3[currentQuestion-questions.length-questions2.length];
    }
    else{
        finishAssessment(phonicsAssessments[0], allQuestions);
    }
}
function blending(){
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    var questions = ["n-o","r-u-n","t-e-n","f-a-t","s-i-t","w-e-n-t","m-o-p","m-e","c-u-t"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(phonicsAssessments[1], questions);
    }  
}
function segmenting(){
    viewSettings(true,false,true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    var questions = ["man","me","top","hat","skip","book","play","dip","not"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(phonicsAssessments[2], questions);
    }  
}
function syllables(){
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%";
    txtQuestion.style.margin = "0 0 1.5em 0";
    var questions = ["hospital","information","fun","children","beat","cooking","book","elephant","monkey"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = questions[currentQuestion];
    }
    else{
        finishAssessment(phonicsAssessments[3], questions);
    }  
}
function substitution(){
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%" ;
    txtQuestion.style.margin = "0 0 1.5em 0";
    var questions = ["man with /k/","pig with /d/","sack with /t/","well with /f/","bed with /r/","shop with /ch/"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = "Replace the first sound in "+ questions[currentQuestion];
    }
    else{
        finishAssessment(phonicsAssessments[4], questions);
    }  
}
function deletion(){
    viewSettings(true,false);
    txtQuestion.style.fontSize = "300%" ;
    txtQuestion.style.margin = "0 0 1.5em 0";
    var questions = ["clap without /k/", "stop without /s/","trust without /t/","black without /b/","drip without /d/","smile without /s/"];
    if(currentQuestion<questions.length){
        txtQuestion.textContent = "Say "+ questions[currentQuestion];
    }
    else{
        finishAssessment(phonicsAssessments[5], questions);
    }  
}