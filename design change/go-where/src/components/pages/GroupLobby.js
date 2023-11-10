import React, { useEffect } from 'react';
import  '../../App';
import { GroupContext } from '../../contexts/GroupContext';
import { UserContext } from '../../contexts/UserContext';
import { useContext, useState, useRef } from 'react';
import '../TextField.css';
import { useNavigate } from 'react-router-dom';
import link_icon from '../../images/link_icon.png';
import back_button from '../../images/back_button.png';
import "./GroupLobby.css"
import { Hidden } from '@mui/material';

function GroupLobby(){
    let navigate = useNavigate();

    const [groupDetails, setgroupDetails] = useState();
    const [membersDetails, setmembersDetails] = useState();

    const [membersSelect, setmembersSelect] = useState([]);
    const [userChosen, setuserChosen] = useState();
    const [userChosenName, setuserChosenName] = useState("");

    const [group_id, setgroup_id] = useState();

    useEffect(() =>{
        async function CheckNGetG(){
            const cur_url = window.location.href;
            const group_code = cur_url.slice(-5,);
            const response = await fetch('http://localhost:4000/joingroup', {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"groupCode" : group_code})
            }).then(async (response) => {
                if (response.status == 200) {
                    const foundGroup = await response.json()
                    setgroupDetails(foundGroup);
                    localStorage.setItem("GroupID", foundGroup.groupID);
                    setgroup_id(foundGroup.groupID)
                } else {
                    navigate('/')
                }
            }).catch(error => {
                navigate('/')
            })
        }
        CheckNGetG();
    }, [])
    console.log(groupDetails);
    useEffect(()=>{
        async function CheckNGetM(){
            if (ONCE) {return;}
            if(groupDetails == null) {return;}
            const group_id = groupDetails.groupID;
            const response = await fetch('http://localhost:4000/GroupLobby', {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"groupId" : group_id})
            }).then((response) => response.json())
            setmembersDetails(response);
        }
        CheckNGetM();        
    },[groupDetails])
    console.log(membersDetails);


    const [ONCE, setONCE] = useState(false)
    useEffect(() =>{
        if (membersDetails == null) {return;}
        const temp_select = []
        membersDetails.forEach(member => {
            temp_select.push(
                <button type="button" className="btn btn-success rounded-pill membersButton" key={member.userID} onClick={() => renderConfirmButton(member.userID, member.name)}>{member.name}</button>    
                
            )
        });
        setmembersSelect(temp_select);
        setONCE(true)
    },[membersDetails])

    useEffect(() =>{
        console.log("1")
        if (ONCE) {
            const events = new EventSource(`http://localhost:4000/GroupLobby/RT:${group_id}`);
            console.log("CONNECTION SECURED!")
            events.onmessage = (event) => {
                console.log("RECEIVING")
                console.log(event)
                console.log(event.data)
                const groupUsersInfo = JSON.parse(event.data);
                setmembersDetails(groupUsersInfo);
            }
            return (() => {events.close(); console.log("CLOSED CONNECTION!") })
        }
    },[ONCE])


    const confirmButton = useRef()
    const renderConfirmButton = (userid, user_name) => {
        confirmButton.current.style.visibility = "visible";
        setuserChosen(userid);
        console.log(userid);
        setuserChosenName(user_name);
        console.log(user_name);
    }
    
    const ConfirmUser = async () => {
        localStorage.setItem("UserID", userChosen);

        navigate("/GroupPage/Home");
    }

    function AddMemberButton() {
        navigate("/AddUser");
    }
    




    const user = "0"

    const [showEdit, setShowEdit] = useState(false)

    const AddOrEdit = () => {
        if (showEdit) {
            return "Edit Details"
        }
        return "Add Member"
    }

    const loadUserFromName = async (name) => {
        const response = await fetch('http://localhost:4000/' + new URLSearchParams({
                gID: "teamy",
                userName: name
            }))
    }

    const userLogin = async () => {
        await loadUserFromName(userChosen)
        navigate("/Lobby")
    }

    const clickOnAddOrEditMember = async () => {
        if (showEdit) {
            await loadUserFromName(userChosen)
        } else {
        }
        navigate("/AddMember")
    }

    return (
        <div className="">
            <div className='centerLobbyStuff'>
                <div className="d-flex justify-content-center centerLobby">
                    <h1 className='border border-dark rounded' style={{padding:"1%"}}>{ (groupDetails == null) ? "" : "Group Name: " + groupDetails.groupName }</h1>
                </div>
                <div className='d-flex justify-content-center' style={{marginTop:"1%"}}>
                    <h3 className='display-8'>{"Selected: " + userChosenName }</h3>
                </div>
                <div className='d-flex justify-content-center' style={{marginTop:"0%"}}>
                    <div className='d-flex justify-content-center flex-wrap centerUsers' style={{}}>
                        {}
                        {membersSelect}
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='d-flex justify-content-end foots' style={{}}>
                    <div className="">
                        <button className="btn btn-warning" ref={confirmButton} style={{visibility:"hidden"}} onClick={ConfirmUser}>Confirm</button>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-end add-members-location'>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-light rounded-circle border border-dark border-5 addmembersButton" onClick={AddMemberButton}></button>
                    </div>
                </div>
                <span className='d-flex justify-content-center'>
                    <p className='lead'><strong> Add Member </strong></p>
                    </span>
            </div>
        </div>
    )
}
export default GroupLobby;