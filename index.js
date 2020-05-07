const Datastore = require('nedb');
//use express to host the webpage on the server
const express = require('express');
const app = express();
app.listen(3000, () => console.log("Listening at 3000"));
app.use(express.static('public'));

//creating a database
const testDatabase = new Datastore('testDatabase.db');
testDatabase.loadDatabase();
const studentDatabase = new Datastore('studentDatabase.db');
studentDatabase.loadDatabase();

//set up to recieve data from webpage
app.use(express.json({limit:'1mb'}));

//save and get test
app.get('/tests', (request, response)=>{
    testDatabase.find({},(err,data)=>{
        response.json(data);
    })
})
app.post('/tests',(request, response)=>{
    const timestamp = Date.now();
    const data = request.body;
    data.timestamp = timestamp;
    testDatabase.insert(data);
    response.json({status:"success"});
});

//student database post and get
app.post('/students', (request, response) =>{
    const data = request.body;
    studentDatabase.insert(data);
    response.json({status: "success"});
});
app.get('/students', (request, response) =>{
    studentDatabase.find({},(err, data)=>{
        response.json(data);
    });
});