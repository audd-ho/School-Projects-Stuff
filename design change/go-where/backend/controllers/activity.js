const schemas = require('../models/schemas')
const mongoose = require('mongoose')
const express = require('express')
const { Client } = require("@googlemaps/google-maps-services-js");



const API_KEY = process.env.mapAPIkey



exports.InitialisePage = async(req, res) => {
    const group_id = req.body.g_id
    const user_id = req.body.u_id

    const user = await schemas.Users.findOne({groupID: group_id, userID: user_id})
    const group = await schemas.Groups.findOne({groupID: group_id})
    const activities_list = await schemas.Activities.find({group_id: group_id})



    const leader = user.leader
    const chosenMDT = group.chosenMDT
    const ActivitiesList = activities_list

    const ISOchosenMDT = chosenMDT.toISOString()
    const ISOuserMDT = user.meetDateTime.map(mdt => mdt.toISOString())
    const partOf = ISOuserMDT.includes(ISOchosenMDT)

    const to_initialise = {
        leader: leader,
        partOf: partOf,
        mdt: chosenMDT,
        ActivitiesList: ActivitiesList
    }

    res.send(JSON.stringify(to_initialise))  
}

function getCid(GHclients) {
    return GHclients.id;
}
let ActivitiesClients = []
exports.VoteInitialise = async(req, res) => {
    console.log(req.query.gid)
    const group_id = req.query.gid
    const activities_list = await schemas.Activities.find({group_id:group_id})
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        "Access-Control-Allow-Origin": "*"
    };
    res.writeHead(200, headers);
    const vote_info = getVcountVid(activities_list)
    const data = `data:${JSON.stringify(vote_info)}\n\n`;
    res.write(data)
    const clientId = Date.now() + "_" + group_id
    const newclient = {
        id: clientId,
        res
    }
    console.log(`NEW CLIENT OF CLIENT ID: ${clientId}, GROUP ID: ${group_id}`)
    
    ActivitiesClients.push(newclient);
    console.log("clients currently are: "+ActivitiesClients.map(getCid))
        req.on('close', () => {
            console.log(`Client ${clientId} Connection Closed`)
            ActivitiesClients = ActivitiesClients.filter(client => client.id !== clientId);
        });
}
function getVcountVid(activities_list){
    let votesList = {}
    let votedIDList = {}
    activities_list.forEach(activity => {
        const placeID = activity.place_id
        votesList[placeID] = activity.votes
        votedIDList[placeID] = activity.votedUID
    })
    return {"votesList": votesList, "votedIDList":votedIDList}
}
exports.Vote = async(req, res) => {
    const placeID = req.body.placeID
    const group_id = req.body.g_id
    const user_id = req.body.u_id

    const activity = schemas.Activities.findOne({group_id:group_id, place_id:placeID})
    activity.votes += 1
    activity.votedUID.push(user_id)
    await activity.save()
    sendUpdatedVotes(group_id);
    res.end()
}

function sendUpdatedVotes(g_id) {
    console.log("sending vote info!")
    console.log("clients are " + grouphome_clients) 
    const activity_list = schemas.Activities.find({group_id: g_id})
    const to_send = getVcountVid(activity_list)

    console.log("GOING TO SEND: "+to_send)
    console.log("GOING TO SEND: "+to_send.votesList)
    console.log("GOING TO SEND: "+to_send.votedIDList)
    ActivitiesClients.forEach((client) => {
        const c_id = client.id; 
        console.log(`ITS ${c_id}`)
        const _index = c_id.search("_");
        const GroupID = client.id.slice(_index+1, );
        if (GroupID == g_id) {
            client.res.write('event: message\n'); 
            
            client.res.write(`data: ${JSON.stringify(to_send)}`);
            console.log("SENT: "+to_send)
            client.res.write("\n\n");
        }
    });
}

exports.ClearActivityData = async(req, res) => {
    const group_id = req.body.g_id
    await schemas.Activities.deleteMany({group_id: group_id})
    const group = await schemas.Groups.findOne({groupID: group_id})
    group.chosenMDT = undefined
    group.centralLocation.LatLon.Lat = undefined
    group.centralLocation.LatLon.Lon = undefined
    group.activityFound = false
    await group.save()
    res.end()
}


const putActivitiesInDB = async (group, radius) => {
    
    const centralCoordinatesArr = JSON.stringify(group.centralLocation).replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '').split(',');
    const centralCoordinates = centralCoordinatesArr[1] + ',' + centralCoordinatesArr[0];
    console.log('controllers/activity.js central coordinates: ' + centralCoordinates)

    
    let placesList = [];

    
    const activityTypes = [
        'aquarium',
        'amusement_park',
        'art_gallery',
        'bowling_alley',
        'casino',
        'library',
        'movie_rental',
        'movie_theater',
        'museum',
        'night_club',
        'shopping_mall',
        'spa',
        'tourist_attraction',
        'zoo',
    ]

    
    for (let i = 0; i < activityTypes.length; i++) {
        console.log('controllers/activity.js:');
        console.log('activityType: ' + activityTypes[i]);
        console.log('api key: ' + API_KEY);
        console.log('radius: ' + radius);
        console.log('centralCoordinates: ' + centralCoordinates);
        console.log('=====')
        const client = new Client({});
        await client.placesNearby({
            params: {
                location: centralCoordinates,
                key: API_KEY,
                radius: radius,
                type: activityTypes[i],
            },
            timeout: 5000, 
        }).then(async (r) => {

            
            let filteredPlaces = [];
            for (let j = 0; j < r.data.results.length; j++) {
                let place = r.data.results[j];
                console.log(activityTypes[i])
                if ((place.permanently_closed == undefined || place.business_status == 'OPERATIONAL' )) {
                    filteredPlaces.push({
                        place: place,
                        type: activityTypes[i]
                    });
                }
            }

            
            for (let j = 0; j < filteredPlaces.length; j++) {
                if (!placesList.find(e => e.place == filteredPlaces[j].place)) {
                    placesList.push({
                        place: filteredPlaces[j].place,
                        type: filteredPlaces[j].type
                    })
                }
            }
        }).catch((e) => {
            console.log('controllers/activity.js placesNearby error ' + e.message);
        });
    }

    return await Promise.all(placesList.map(async (placeItem) => {
        return await getActivityDoc(placeItem.place, placeItem.type);
    }));
}

const getActivityDoc = async (place, type) => {
    const existingPlace = await schemas.Activities.findOne({place_id: place.place_id})
    if (!existingPlace) {
        const formattedAddress = await reverseGeocode(place.place_id, place.geometry.location)
       
        const newActivity = new schemas.Activities({
            place_id: place.place_id,
            name: place.name,
            photo_reference: place.photos && place.photos[0] ? place.photos[0].photo_reference : "",
            formatted_address: formattedAddress,
            place_type: type.replace('_', ' '),
        })
        const saveActivity = await newActivity.save()
        if (!saveActivity) {
            console.log('activity.js line 91: error saving activity')
        }
        return newActivity
    } else {
        return existingPlace
    }
}


const reverseGeocode = async (place_id, location) => {
    const client = new Client({})
    return await client.reverseGeocode({
        params: {
            key: API_KEY,
            location: location,
            place_id: place_id
        },
        timeout: 1000, 
    }).then((r) => {
        return r.data.results[0].formatted_address
    }).catch((e) => {
        console.log(e.message);
    });
}

const calculateCentralLocation = async (group) => {
    let lng = 0, lat = 0
    let length = group.members.length
    for (let i = 0; i < length; i++) {
        let user = await schemas.Users.findOne({_id: group.members[i]})
        lng += user.location.coordinates[0] 
        lat += user.location.coordinates[1]
    }
    lng = lng / length
    lat = lat / length
    console.log('controllers/activity.js calculateCentralLocation: lng: ' + lng + '; lat: ' + lat);
    return [lng, lat]
}


exports.start = async(req, res) => {
    const group = await schemas.Groups.findOne({_id: req.body.groupID})

    
    let sum = 0
    group.votes.forEach(vote => sum += vote)
    if (sum != group.members.length) {
        console.log('controllers/activity.js not all group members have voted')
        res.status(400).send('Not all group members have voted!')
    } else {
        
        const votes = group.votes
        const chosenDateTimeIndex = votes.indexOf(Math.max(...votes))
        await group.updateOne({chosenDateTimeIndex: chosenDateTimeIndex}) 
        console.log('controllers/activity.js start: chosenDateTimeIndex: ' + chosenDateTimeIndex)

        
        await group.updateOne({centralLocation: await calculateCentralLocation(group)})
        console.log('controllers/activity.js start: centralLocation: ' + group.centralLocation)
        if (!group.centralLocation) console.log('oopsies')


        
        let radius = 2000 
        let activityList = await putActivitiesInDB(group, radius)
        while (activityList.length < 10) {
            radius+= 1000
            activityList = await putActivitiesInDB(group, radius)
        }
        await group.updateOne({activityList: activityList});
        console.log('controllers/activity.js start: activityList: ' + group.activityList)
        
        const startedGroup = await schemas.Groups.findOne({_id: req.body.groupID})
        console.log(startedGroup)
        res.send(startedGroup)
    }
}

exports.getPhoto = async(req, res) => {
    const photoRef = req.params.photoRef
    
    const client = new Client({})
    return await client.placePhoto({
        params: {
            key: API_KEY,
            photoreference: photoRef.substring(1, photoRef.length - 1),
            maxwidth: 300,
            maxheight: 200,
        },
        timeout: 2000, 
    }).then((r) => {
        
        res.send(r.data)
    }).catch((e) => {
        console.log('controllers/activity getPhoto error ' + e.message);
    });
}


exports.getDetails = async(req, res) => {
    const place_id = req.params.place_id
    const client = new Client({})
    return await client.placeDetails({
        params: {
            key: API_KEY,
            place_id: place_id.substring(1, place_id.length - 1)
        },
        timeout: 2000,
    }).then((r) => {
        
        res.send(JSON.stringify({
            'formatted_phone_number' : r.data.result.formatted_phone_number ? r.data.result.formatted_phone_number : 'No phone number available',
            'opening_hours' : r.data.result.opening_hours,
            'url' : r.data.result.url,
            'rating' : r.data.result.rating,
            'website' : r.data.result.website
        }))
    }).catch (err => {
        console.log('controllers/activity.js getDetails error: ' + err)
    })
}