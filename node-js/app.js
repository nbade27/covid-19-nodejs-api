//to run : node filename.js
const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const apiResponse = require('./external-api-call/ExternalapiCall');
var covidData;

const covidDataInitialization = apiResponse.callApi(function (response){
        
    covidData =  response
});

//sample api for node-js
app.get('/', (req, res) => res.send('Hello World!'));



//API for States
app.get('/covid/states-list',(req,res) => {

     // console.log('states[1] ',states[1]);
    res.send(getStatesList());
    //res.end();
});

//gettign satte wise covid cases
// /covid/{state}/data
app.get('/covid/:state/data',(req,res) => {
    var reqState = req.params['state'];
    var response =  getStateData(reqState);
    res.send(response);
});

app.get('/covid/:state/districts',(req,res) => {
    var reqState = req.params['state'];
    var response =  getDistrictList(reqState);
    res.send(response);
});

app.get('/covid/:state/:district',(req,res) => {
    var reqState = req.params['state'];
    var reqDistrict = req.params['district'];

    var response =  getDistrictDataWithinState(reqState,reqDistrict);
    res.send(response);
});

app.get('/covid/india',(req,res) => {

    let active = 0
    let confirmed = 0
    let deceased = 0
    let recovered = 0

    var statesList = getStatesList();
    for (let map of statesList) {
        let stateName = map.name;
        console.log('stateName',stateName);
        let stateData = getStateData(stateName);
        active += stateData.active;
        confirmed += stateData.confirmed;
        deceased += stateData.deceased;
        recovered += stateData.recovered;
    }
    // var response =  getIndiaTotalData(reqState,reqDistrict);

    let response = {
        "active":active,
        "confirmed":confirmed,
        "deceased":deceased,
        "recovered":recovered,

    };
    res.send(response);
});

const getStatesList = () =>
{
    
    var states = [];
    var mainMap = Object.entries(covidData);
    //var sampleMap;
    //getting states from map
    for (let [key, value] of mainMap) {

        var insideMap = Object(value);
        var sampleMap = {
            'name' :key,
            'statecode': insideMap.statecode
        };

        console.log('key.toString() ',key.toString());
        //locale compare is giving 0 if the the strings are equal
        if("State Unassigned".localeCompare(key))
            states.push(sampleMap);
        //console.log(value)
       // console.log('states ==> ',states[1]);
      }//for loop
      return states;
}

    //getting district data within state
    const getDistrictDataWithinState = (reqState,reqDistrict) => {
        
        let active = 0
        let confirmed = 0
        let deceased = 0
        let recovered = 0

        console.log('state ',reqState)
        var mainMap = Object.entries(covidData);
        
        for (let [key, value] of mainMap) {
        //if the requested state matched
            if(!reqState.localeCompare(String(key)))
            {
               
                var stateMap = Object.entries(value);
                for (let [key, value] of stateMap) {
                    if("districtData" == String(key)){
                        console.log('key1 ',key);
                        var districtMap  = Object.entries(value);
                        for (let [key, value] of districtMap) {
                            if(reqDistrict == String(key))
                            {
                                var districtData = Object.entries(value);

                                for(let [key,value] of districtData)
                            {
                                console.log('districtData.active ',districtData.active);

                            if(key == "active")
                                active = value;
                            if(key == "confirmed")
                                confirmed = value;
                            if(key == "deceased")
                                deceased = value;
                            if(key == "recovered")
                                recovered = value;
                            }
                            }
                            
                            
                            
                        }
                    }
                }
            }//checking state
        }//for loop
        console.log('active ',active);
        console.log('confirmed ',confirmed);
        console.log('deceased ',deceased);
        console.log('recovered ',recovered);

        return {
            "active" : active,
            "confirmed" : confirmed,
            "deceased" : deceased,
            "recovered" : recovered
        };
    };

    //getting districts list
    const getDistrictList = (reqState) => {

        let districts = [];
        console.log('state ',reqState)
        //console.log(covidData);
        var mainMap = Object.entries(covidData);
        
        for (let [key, value] of mainMap) {
        //if the requested state matched
            if(!reqState.localeCompare(String(key)))
            {
               
                var stateMap = Object.entries(value);
                for (let [key, value] of stateMap) {
                    if(!"districtData".localeCompare(String(key))){
                        console.log('key1 ',key);
                        var districtMap  = Object.entries(value);
                        for (let [key, value] of districtMap) {
                            console.log('key ',key);
                            if("Foreign Evacuees" != String(key))
                            districts.push(key);
                            
                        }
                    }
                }
            }//checking state
        }//for loop

        return districts;
    };
    //getting state data
    const  getStateData = (reqState) =>
    {
        let active = 0
        let confirmed = 0
        let deceased = 0
        let recovered = 0

        console.log('state ',reqState)
        var mainMap = Object.entries(covidData);
        
        for (let [key, value] of mainMap) {
        //if the requested state matched
            if(!reqState.localeCompare(String(key)))
            {
               
                var stateMap = Object.entries(value);
                for (let [key, value] of stateMap) {
                    if(!"districtData".localeCompare(String(key))){
                        console.log('key1 ',key);
                        var districtMap  = Object.entries(value);
                        for (let [key, value] of districtMap) {

                            //console.log('key2 ',key);
                            //console.log('value ',value);

                            var districtData = Object.entries(value);
                            for(let [key,value] of districtData)
                            {
                                console.log('districtData.active ',districtData.active);

                            if(key == "active")
                                active += value;
                            if(key == "confirmed")
                                confirmed += value;
                            if(key == "deceased")
                                deceased += value;
                            if(key == "recovered")
                                recovered += value;
                            }
                            
                        }
                    }
                }
            }//checking state
        }//for loop
        console.log('active ',active);
        console.log('confirmed ',confirmed);
        console.log('deceased ',deceased);
        console.log('recovered ',recovered);

        return {
            "active" : active,
            "confirmed" : confirmed,
            "deceased" : deceased,
            "recovered" : recovered
        };
    }



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

//visit localhost:3000
// assuming you have done 1) npm init 2) npm install express


