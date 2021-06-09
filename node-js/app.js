//to run : node filename.js
const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const covidData = require('./external-api-call/ExternalapiCall');

app.get('/', (req, res) => res.send('Hello World!'))

//for testing api response from covid-api
app.get('/covid-sample-data',(req,res) => {
    console.log('covid-data ');
    covidData.callApi(function (response)
    {
        res.write(JSON.stringify(response));
        res.end();
    });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

//visit localhost:3000
// assuming you have done 1) npm init 2) npm install express


