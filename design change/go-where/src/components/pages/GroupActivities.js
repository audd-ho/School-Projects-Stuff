import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./GroupHome.css";
import { Tooltip } from '@mui/material';
import { ActivityBoxes } from '../ActivityBoxes';

function GroupActivities(){

    const Navigate = useNavigate();

    function formatDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric', day: "2-digit"};
        return new Date(string).toLocaleDateString("en-SG",options);
    }

    function formatTime(string){
        var options = { hour: "2-digit", minute: "2-digit"};
        return new Date(string).toLocaleTimeString("SG", options)
    }

    const groupId = localStorage.getItem("GroupID");
    const userId = localStorage.getItem("UserID");

    const [IsLeader, setIsLeader] = useState(false)
    const [CanVote, setCanVote] = useState(false)
    const [chosenMDT, setchosenMDT] = useState({})
    const [ActivitiesList, setActivitiesList] = useState([-1])

    useEffect(() => {
        async function initialise(){
            const response = await fetch(`http://localhost:4000/GroupActivities/Initialise`, {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({g_id: groupId, u_id: userId})
            }).then((response) => {return response.json()});
            setIsLeader(response.leader)
            setCanVote(response.partOf)
            setchosenMDT({date: formatDate(response.mdt), time: formatTime(response.mdt)})
            setActivitiesList(response.ActivitiesList)
        }
        initialise();
    },[])

    const [ShowPopUpReturn, setShowPopUpReturn] = useState(false)

    useEffect(() => {
        if (ActivitiesList.length == 0) {
            setShowPopUpReturn(true)
        }
    }, [ActivitiesList])

    const [VotesList, setVotesList] = useState()
    const [VotedIDList, setVotedIDList] = useState()

    useEffect(() =>{
            const events = new EventSource(`http://localhost:4000/GroupActivities/VoteSetUp?gid=${groupId}`);
            console.log("CONNECTION SECURED!")
            events.onmessage = (event) => {
                console.log("RECEIVING")
                console.log(event)
                console.log(event.data)
                const received_data = JSON.parse(event.data)
                console.log(received_data)
                console.log(received_data.votesList)
                setVotesList(received_data.votesList);
                setVotedIDList(received_data.votedIDList)
            }
            return (() => {events.close(); console.log("CLOSED CONNECTION!") })
    },[])

    async function goBack() {
        const response = await fetch(`http://localhost:4000/GroupActivities/Back`, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({g_id: groupId})
        })
        Navigate("/GroupPage/Home")
    }
    const [Activity_Boxes, setActivity_Boxes] = useState()
    useEffect(() =>{
        if (ActivitiesList[0] == -1 || VotesList == undefined || VotedIDList == undefined) {return;}
        console.log([CanVote, ActivitiesList, VotesList, VotedIDList])
        setActivity_Boxes(<ActivityBoxes CanVote={CanVote} ActivitiesList={ActivitiesList} VotesList={VotesList} VotedIDList={VotedIDList} />)
    },[CanVote, ActivitiesList, VotesList, VotedIDList])
    return(
        <>
        <div>
            <div>
            {}
            </div>
            <div className='d-flex justify-content-center'>
                <div className='selectionActivityGroup'>
                {(chosenMDT != {})? (chosenMDT.date, chosenMDT.time): "suckers"}
                </div>
            </div>
            <div>
                {Activity_Boxes}
            </div>
            {(IsLeader)?(<button className='btn btn-warning' onClick={goBack}> Back! </button>): null}
        </div>
        </>
        
    );
}
export default GroupActivities;