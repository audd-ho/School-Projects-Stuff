import React, {useEffect, useState} from 'react';
import './TextField.css';
import './Divs.css'
import { ActivityBox } from './ActivityBox';
import { ActivityPopup } from './ActivityPopup.js';

export const ActivityBoxes = ((props) => {
    console.log(props)

    const groupId = localStorage.getItem("GroupID");
    const userId = localStorage.getItem("UserID");

    const [voted, setvoted] = useState(false)

    const [open, setOpen] = useState(false);

    const [imgurl, setImgurl] = useState("");

    const [activities, setactivities] = useState()
    const [votes, setvotes] = useState()
    const [votedIDlist, setvotedIDlist] = useState()
    const [canvote, setcanvote] = useState()
    useEffect(() => {
       setactivities(props.ActivitiesList)
       setvotes(props.VotesList)
       setvotedIDlist(props.VotedIDList)
       setcanvote(props.CanVote)
    },[props])


    const [Boxes, setBoxes] = useState()
    useEffect(()=>{
        if (activities == undefined || votes == undefined || votedIDlist == undefined || canvote == undefined) { return ;}
        console.log(activities)
        console.log(votes)
        console.log(votedIDlist)
        console.log(canvote)
        const temp_boxes = []

        props.ActivitiesList.forEach((activity, i) => {
            console.log(activity);
            console.log(activity.place_id);
            console.log(props.VotesList[activity.place_id]);
            console.log(props.VotedIDList[activity.place_id]);
            console.log(props.CanVote);
            
            temp_boxes.push(
            <ActivityBox key={i} activity={activity} place_id={activity.place_id} Votes={props.VotesList[activity.place_id]} votedIDs={props.VotedIDList[activity.place_id]} canVote={props.CanVote} />
            )
        })
        setBoxes(temp_boxes)
    },[activities, votes, votedIDlist, canvote])
    console.log(props.ActivitiesList)
    
    return (
    <div className="container-horizontal-scroll" style={{marginTop: '250px'}}> {}
        {(activities == undefined || votes == undefined || votedIDlist == undefined || canvote == undefined)? null:Boxes}
    </div>)
})