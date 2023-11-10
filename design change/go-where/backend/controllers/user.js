const schemas = require('../models/schemas')
const mongoose = require('mongoose')
const express = require('express')
const GroupController = require('./group')

function formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric', day: "2-digit"};
    return new Date(string).toLocaleDateString("en-SG",options);
}
function formatTime(string){
    var options = { hour: "2-digit", minute: "2-digit"};
    return new Date(string).toLocaleTimeString("SG", options)
}
function sortDate(date_array) {date_array.sort((a,b) =>  Date.parse(a) - Date.parse(b))}
function sortTime(time_array) {time_array.sort(function (a, b) {
    return a.localeCompare(b);
})}
function sortISOdt(ISOdt) {ISOdt.sort(function(a, b) {
    return (a < b) ? -1 : ((a > b) ? 1 : 0);
})}


exports.createUser = async(req, res) => {
    let UserId = 0
    const curGroupUsers = await schemas.Users.find({groupID: req.body.UserGroupID});

    const grplen = curGroupUsers.length;
    const curGroupIds = [];
    for (let kk = 0; kk < grplen; kk++){
        curGroupIds.push(curGroupUsers[kk].userID)
    }
    console.log(curGroupIds)
    for (; UserId < grplen; UserId++){
        if (!(curGroupIds.includes(UserId))) {break;}
    }

    const UserTimingInfo = [...req.body.UserDT];
    sortISOdt(UserTimingInfo)
    console.log("HERE")
    console.log(UserTimingInfo)
    console.log(sortISOdt(UserTimingInfo))
    const newUser = new schemas.Users({
        userID: UserId,
        groupID: req.body.UserGroupID,
        name: req.body.UserData.Name,
        leader: req.body.Leader,
        meetDateTime: UserTimingInfo,
        location: {
            LatLon: {
                Lat: req.body.UserData.LatLon.Lat, Lon: req.body.UserData.LatLon.Lon
            },
            AddressName: req.body.UserData.AddressName
        }
    })

    const saveUser = await newUser.save()
    if (saveUser) {
        console.log("saved user!")
        await GroupController.updateGroupDetails(req.body.UserGroupID)
        res.send(newUser)
        res.end()        
        sendNewMemberEventsToAll(req.body.UserGroupID);
        GroupController.sendMemberInfoChangeEventsToAllHome(req.body.UserGroupID);
    }
    

    return;
    if (newUser.leader) {
        await group.updateOne({leader: newUser._id});
    }
    group.members.push(newUser._id);
    await group.save();
    console.log(await schemas.Groups.findOne({_id: req.body.groupID}))
    console.log('user added: ' + newUser)
    res.end()
}

exports.getGroupUsers = async(req, res) => {
    const groupId = req.body.groupId;
    const users = await schemas.Users.find({groupID: groupId});
    res.send(users);
}

let clients = []
exports.getRTGroupUsers = async(req, res) => {
    console.log(req.params)
    console.log(req.params.GroupID)
    if (req.params.GroupID === ":") {console.log(": !!!"); res.status(400).send("Invalid Group ID!!"); return;}
    const groupId = Number(req.params.GroupID.slice(1,));
    console.log(groupId);
    if (isNaN(groupId)) {console.log("NaN !!!"); res.status(400).send("Invalid Group ID!!"); return;}
    else{
        console.log(clients);
        const users = await schemas.Users.find({groupID: groupId});
        if (users.length == 0) {console.log("No Such Group ID !!!!"); res.status(400).send("Invalid Group ID!!"); return;}
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            "Access-Control-Allow-Origin": "*"
        };
        res.writeHead(200, headers);
        const clientId = Date.now() + "_" + groupId
        const newClient = {
            id: clientId,
            res
        }
        console.log(`NEW CLIENT OF CLIENT ID: ${clientId}, GROUP ID: ${groupId}`)
        clients.push(newClient);
        console.log(clients.forEach(c => c.clientId))
        req.on('close', () => {
            console.log(`Client ${clientId} Connection Closed`)
            clients = clients.filter(client => client.id !== clientId);
        });
    }
    
}

async function sendNewMemberEventsToAll(group_id) {
    console.log("sending!")
    console.log("clients are " + clients)
    const group_users = await schemas.Users.find({groupID: group_id});
    clients.forEach((client) => {
        const c_id = client.id;
        console.log(`ITS ${c_id}`)
        const _index = c_id.search("_");
        const GroupID = client.id.slice(_index+1, );
        if (GroupID == group_id) {
            client.res.write('event: message\n');
            client.res.write(`data: ${JSON.stringify(group_users)}`);
            client.res.write("\n\n");
        }
    });
}
    


    


exports.getUserFromID = async(req, res) => {
    const userID = req.body.userID;
    const groupID = req.body.groupID;
    const user = await schemas.Users.findOne({"groupID": groupID, "userID": userID});
    res.send(user);
}

exports.EditUserInfo = async(req, res) => {
    const user = await schemas.Users.findOne({"groupID": req.body.GroupID, "userID": req.body.UserID});

    const UserTimingInfo = [...req.body.UserDT];
    sortISOdt(UserTimingInfo)

    user.meetDateTime = UserTimingInfo;
    user.name = req.body.UserData.Name;
    user.location.LatLon.Lat = req.body.UserData.LatLon.Lat;
    user.location.LatLon.Lon = req.body.UserData.LatLon.Lon;
    user.location.AddressName = req.body.UserData.AddressName;
    await user.save();
    await GroupController.updateGroupDetails(req.body.GroupID)
    res.end();
    sendNewMemberEventsToAll(req.body.GroupID)
    GroupController.sendMemberInfoChangeEventsToAllHome(req.body.GroupID);
}








