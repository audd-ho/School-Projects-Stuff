const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    group_id: {type:Number, required:true},
    place_id: {type: String, required: true},
    name: {type: String, required: true},
    formatted_address: {type: String, required: true},
    photo_reference: {type: String, required: false},
    categories: {type: [String], required: true},
    votes: {type: Number, required:true, default:0},
    votedUID: {type: [Number], required: true, default: []}, // no one voted yet
    LatLon: {
        Lat:{type:Number, required:true},
        Lon:{type:Number, required:true}
    }
})

const groupSchema = new Schema({
    groupID: {type:Number, required:true, unique:true, dropDups:true},
    groupName: {type:String, required:true},
    groupCode: {type:String, required:true},
    meetDateTime: {type:[Date], required:true},
    groupUsers: {type:[Number], required:true},
    datesVote: {type:[Number], required:true},
    chosenMDT: {type:Date, required:false},
    centralLocation: {
        LatLon: {
            Lat:{type:Number, required:false},
            Lon:{type:Number, required:false}
        }
    },
    activityFound : {type: Boolean, required: true, default:false}
    //activityList: {type: [activitySchema], required:false}
    //datesVotedUsers: {type:[Number], required:true} // number of people who voted for a date already, but saved using userId so know who havent voted!
});

const userSchema = new Schema({
    userID: {type:Number, required:true},
    groupID: {type:Number, required:true},
    name: {type:String, required:true},
    leader: {type:Boolean, required:true, default:false},
    meetDateTime: {type:[Date], required:true},
    location: {
        LatLon: {
            Lat:{type:Number, required:true},
            Lon:{type:Number, required:true}
        },
        AddressName: {type:String, required:true}
    }
});

const Groups = mongoose.model('Groups', groupSchema, 'groups');
const Users = mongoose.model('Users', userSchema, 'users');
const Activities = mongoose.model('Activities', activitySchema, 'activities');

const mySchemas = {'Groups':Groups, 'Users':Users, "Activities":Activities};

module.exports = mySchemas;