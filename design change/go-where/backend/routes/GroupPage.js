const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const mongoose = require('mongoose')

const API_KEY = process.env.mapAPIkey

let bodyParser = require('body-parser')

let jsonParser = bodyParser.json()

const possible_categories = ["commercial", "catering", "entertainment", "leisure", "parking", "pet", "rental", "service", "tourism", "sport", "public_transport"]
const num_categories = possible_categories.length


getinfo = async(req, res) => {

    let lat = 1.282302
    let lon = 103.858528

    let categories = "";
    const chosen_activities = req.body["Activitites TF list"]
    let first = true;
    for (let i = 0; i < num_categories; i++)
    {
        if (chosen_activities[i])
        {
            if (first) {categories = possible_categories[i]; first=false;}
            else {categories = categories + "," + possible_categories[i];}
        }
    }
    console.log(categories);

    let radius = req.body.Radius
    let limit = 20
    
    let request_details_url = "https://api.geoapify.com/v2/places?categories="+ categories +"&filter=circle:"+ lon +","+ lat +","+ radius +"&bias=proximity:"+ lon +","+ lat +"&limit=" + limit +"&apiKey="+ API_KEY
    console.log(request_details_url)
    const loc_info = await fetch(request_details_url).then((resp) => resp.json());
    const places = loc_info["features"]
    console.log(places)
    res.send(places)
}

router.post('/*', jsonParser, (req, res) => {


    console.log("hii theree")

    getinfo(req, res)

});    

    


module.exports = router;