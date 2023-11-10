import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import  '../../App';
import '../TextField.css';
import './EditUserInfo.css';
import '../FooterButtons.css';
import { ChooseDateTimeBox } from '../ChooseDateTimeBox';
import { Link, useNavigate } from 'react-router-dom';
import { DateObject } from "react-multi-date-picker";
import { ProvideUserInfo } from '../ProvideUserInfo';


function EditUserInfo(){

    const [userName, setuserName] = useOutletContext();

    let navigate = useNavigate();


    const [curUserData, setcurUserData] = useState({
        "Name" : "",
        "AddressName" : "",
        "LatLon" : { ["Lat"]: "" , ["Lon"]: ""},
        "SpecificAddressInfo" : ""
    })


    const dataChange = newData => {
        setcurUserData(newData)
    }

    useEffect (() => {console.log(curUserData)}, [curUserData])

    


    const [SelectTimes, setSelectTimes] = useState();
    const [SelectedTimes, setSelectedTimes] = useState([]);
    console.log(SelectedTimes)


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
    function newMeetdt(meetDT) {
        const formattedDT = []
        meetDT.forEach(DT => {
            let d = new Date(DT);
            d.setSeconds(0,0);
            formattedDT.push(d.toISOString());
        })
        return formattedDT;
    }
    const groupId = localStorage.getItem("GroupID");
    const userId = localStorage.getItem("UserID");
    
    console.log(groupId)

    function removeItemOnce(arr, value) {
        let index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }
    
    function checkoOnce(){
        if (groupId==null){navigate('/'); return true;}
        return false;
    }


    const [DataInitialised, setDataInitialised] = useState(false)

    useEffect(() =>{
        if (checkoOnce()) {return;}

        async function setUserDeets(){
            const UserDeets = await fetch("/GroupLayout/GetUser", {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"userID" : userId, "groupID" : groupId})
                }).then((response) => response.json())
            console.log(UserDeets);

            setSelectedTimes(UserDeets.meetDateTime)

            setcurUserData({
                "Name" : UserDeets.name,
                "AddressName" : UserDeets.location.AddressName,
                "LatLon" : { ["Lat"]: UserDeets.location.LatLon.Lat , ["Lon"]: UserDeets.location.LatLon.Lon},
                "SpecificAddressInfo" : ""
            })

            setDataInitialised(true);


        }
        setUserDeets();
    }, [])

    useEffect(()=>{
        async function getGroupTimes(){
            const response_G = await fetch("/GroupLayout/GetGroup", {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"groupID" : groupId})
            }).then((response) => response.json())
            const timingDetailsList = response_G.meetDateTime
            const dates_choices_set = new Set()
            const sorted_unique_dates_choices = []
            timingDetailsList.forEach(timing => {
                const timingDate = formatDate(timing)
                dates_choices_set.add(timingDate)
            })
            for (let element of dates_choices_set){sorted_unique_dates_choices.push(element);}
            sortDate(sorted_unique_dates_choices)
            const dates_dict = {}
            for (let dateee of sorted_unique_dates_choices) {dates_dict[dateee] = [];}
            timingDetailsList.forEach(timing => {
                const timingDate = formatDate(timing)
                const timingTime = formatTime(timing)
                dates_dict[timingDate].push(timingTime)
            })




            const response_U = await fetch("/GroupLayout/GetUser", {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"userID" : userId, "groupID" : groupId})
            }).then((response) => response.json())

            function ChooseTime(event){
                if (event.target.classList.contains("active")) {event.target.classList.remove("active")}
                else {event.target.classList.add("active")}
                console.log(event.target.value)
                const ChosenTime = event.target.value;
                console.log(SelectedTimes)
                
                if (SelectedTimes.includes(ChosenTime)) {setSelectedTimes(removeItemOnce(SelectedTimes, ChosenTime));}
                else {const tt = SelectedTimes; tt.push(ChosenTime); setSelectedTimes(tt)}
                console.log(SelectedTimes);
            }

            const usertimingDetailsList = response_U.meetDateTime
            const Temp_select = []
            sorted_unique_dates_choices.forEach(day =>{
                const Temp_select_day = []
                const timings_in_day = dates_dict[day];
                sortTime(timings_in_day);
                Temp_select_day.push(
                    <p className='datetexts' key={day} style={{}}><u>{day}</u></p>
                )
                for (let times of timings_in_day) {
                    const dt = (day + " " + times)
                    const ISOdt = new Date(dt).toISOString()
                    Temp_select_day.push(
                        <button type="button" key={ISOdt} className={"btn btn-primary rounded-pill timingsButton" + ((usertimingDetailsList.includes(ISOdt))? "":" active")} value={ISOdt} onClick={(e) => {ChooseTime(e)}}>{times}</button>    
                    )

                }
                Temp_select.push(
                    <>
                    {Temp_select_day}
                    </>
                )
            })

            setSelectTimes(Temp_select);
        }
        getGroupTimes();
    },[DataInitialised])





    const sendUserDetails = async() => {
        const UserDataToSend = {
            "Name" : curUserData.Name,
            "AddressName" : curUserData.AddressName,
            "LatLon" : curUserData.LatLon,
        }
        console.log(SelectedTimes)
        const userData = {
            "UserData" : UserDataToSend,
            "UserDT" : SelectedTimes,
            "GroupID": groupId,
            "UserID": userId
        }
        console.log(userData)
        const response = await fetch('http://localhost:4000/EditUserInfo', {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        })
        setuserName(curUserData.Name)
        navigate("/GroupPage/Home")
    }
    

    return(
        <div className=''>
            <div className='AddcenterI'>
                <div style={{marginRight:"15px"}}>
                <h3 className='border-bottom border-dark' style={{color:"#665544", paddingBottom:"9px"}}>User Info</h3>
                {}
                {}
                {(DataInitialised)? < ProvideUserInfo curUserData={curUserData} dataChange={dataChange} />: null}
                </div>
                <div className='justify-content-center flex-wrap border-start border-dark timingFormat'>
                    <div className='border-bottom border-dark'>
                        <h3 style={{color:"#664433"}}> Vote for Dates & Timings: </h3>
                    </div>
                    <div className='scrolling' style={{textAlign:"left"}}>
                    {(SelectTimes==null)? null: SelectTimes}
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="backDiv">
                    <Link to='/'>
                        <button className="btn btn-warning">Back</button>
                    </Link>
                </div>
                <div className="nextDiv">
                    {}
                        <button className="btn btn-warning" onClick={sendUserDetails}>Confirm!</button>
                    {}
                </div>
            </div>
        </div>
        
        
    );
}
export default EditUserInfo;