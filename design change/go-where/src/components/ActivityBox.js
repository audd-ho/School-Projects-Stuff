import React, {useEffect, useState} from 'react';
import ky from 'ky';
import { ActivityPopup } from './ActivityPopup.js';
import './TextField.css';
import './Divs.css'
import star_unvoted from '../images/star_unvoted.png'

export const ActivityBox = ({props})=> {
    console.log(props)
    
    

    const groupId = localStorage.getItem("GroupID");
    const userId = localStorage.getItem("UserID");

    const [voted, setvoted] = useState(false)

    const [open, setOpen] = useState(false);

    const [imgurl, setImgurl] = useState("");

    const getPhoto = async () => {
        const lat = props.activity.LatLon.Lat
        const lon = props.activity.LatLon.Lon
        setImgurl(`https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=600&center=lonlat:${lon},${lat}&zoom=14&apiKey=d548c5ed24604be6a9dd0d989631f783`)
    }

    useEffect(() => {
        getPhoto()
    },[props.activity])

    useEffect(() =>{
        setvoted(props.votedIDs.includes(userId))
    }, [props.votedIDs])

    const [voteCount, setvoteCount] = useState(0)
    useEffect(() => {
        setvoteCount(props.Votes)
    },[props.Votes])

    const [votedPlaces, setvotedPlaces] = useState([]) 

    async function Vote(placeID) {
        setvotedPlaces(votedPlaces.push(placeID))
        await fetch(`http://localhost:4000/GroupActivities/Vote`, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({placeID:placeID, g_id: groupId, u_id: userId})
        })
        
    }

    useEffect(()=> {
        
    }, [votedPlaces])

    return(
        <div className="container-activity" onClick={() => setOpen(o => !o)}>
            {}
            <h2 id='activity-box' className="text-overflow">{props.activity.name}</h2>
            <p id='activity-box' className='text-overflow'>{props.activity.categories}</p>
            <img id='activity-box' src={imgurl}></img>
            <p id="activity-box" className="text-overflow">{props.activity.formatted_address}</p>
            <ActivityPopup activity={props.activity} open={open} setOpen={setOpen} imgurl={imgurl}/>
        </div>
    );
}