import React, { useState, useEffect } from 'react';
import  '../../App';
import '../TextField.css';
import './UserInfo.css';
import '../FooterButtons.css';
import { ChooseDateTimeBox } from '../ChooseDateTimeBox'; //
import { Link, useNavigate } from 'react-router-dom';
//import ky from 'ky';
import { DateObject } from "react-multi-date-picker"; //
import { ProvideUserInfo } from '../ProvideUserInfo';

// MAYBE ADD PROP SO EDIT AND ALL IS EASIER? COS EDIT THEN PASS VALUE OF USER AND ADDRESS, ELSE DONT NEED FOR ADD FIRST TIME!

function UserInfo(){

    let navigate = useNavigate();

    // THESE VALUES NEED SET AND GET FROM DATABASE
    const [curUserData, setcurUserData] = useState({
        "Name" : "User1",
        "AddressName" : "Address1",
        "LatLon" : "",
        "SpecificAddressInfo" : ""
    }) // info one may need details but here no need

    //curUserData.AddressName = "Singa"

    const dataChange = newData => {
        setcurUserData(newData)
        //console.log(newData)
        //console.log(curUserData)
    }
    useEffect (() => {console.log(curUserData)}, [curUserData])

    const [meetDateTime, setMeetDateTime] = useState(
        [].map((number) =>
            new DateObject().set({
                day: number,
                hour: number,
                minute: number,
                // second: number,
            })
        )
    )


    const sendGroupDetails = async() => {
        const groupData = {
            "meetDateTime": meetDateTime
        }
        const response = await fetch('http://localhost:4000/CreateGroup', {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(groupData)
        }).then((response) => response.json())
        //await response
        //var aa = response.json()
        console.log(response)
        //console.log(aa)
        alert(response["data is"])
        alert(response["Group Code"])
        navigate("/GroupPage/" + response["Group Code"])
        //console.log(result)
    }

    

    return(
        <div>
            <div className='centerI'>
                <div >
                <h2>User Info</h2>
                < ProvideUserInfo curUserData={curUserData} dataChange={dataChange} />
                </div>
                <div >
                <ChooseDateTimeBox className
                    updateTimeBox={dateObj => setMeetDateTime(dateObj)}
                    timeBox={meetDateTime}
                ></ChooseDateTimeBox>
                </div>
            </div>
            <div className="footer">
                <div className="backDiv">
                    <Link to='/'>
                        <button className="btn btn-warning">Back</button>
                    </Link>
                </div>
                <div className="nextDiv">
                    {/* <Link to='/GroupPage'> */}
                        <button id="grabGroupDetails" className="btn btn-warning" onClick={sendGroupDetails}>Confirm!</button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
        
        
    );
}
export default UserInfo;