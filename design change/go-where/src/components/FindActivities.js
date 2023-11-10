import React, { useState, useEffect, useRef } from 'react';
import './FindActivities.css'
import { useNavigate } from 'react-router-dom';


function FindActivites(){
    const [Load, setLoad] = useState(false)

    const Navigate = useNavigate()
    const [Radius, setRadius] = useState("1000")
    const [ButtonDisabled, setButtonDisabled] = useState(true)

    const possible_activity = ["Commercial", "Catering", "Entertainment", "Leisure", "Parking", "Pet", "Rental", "Service", "Tourism", "Sport", "Public Transport"]
    const num_activities = possible_activity.length
    let checkbox_array = []
    for (let i = 0; i < num_activities; i++) { checkbox_array.push(false) }
    const [Activities, setActivities] = useState(checkbox_array);


    const findchoices = useRef();
    const handleOnCheckboxChange = (event, activity_num) => {
        const temp_checkbox = [...Activities]
        temp_checkbox[activity_num] = !(Activities[activity_num])
        console.log(temp_checkbox);
        setActivities(temp_checkbox);
        setButtonDisabled(true)
        if ((Radius >= 100) && (Radius <= 5000)) {
            for (let i = 0; i < num_activities; i++)
            {
                if (temp_checkbox[i]) {setButtonDisabled(false); return;}
            }
        }
    };

    function handleRadiusChange(e)
    {
        const new_radius = e.target.value;
        setRadius(new_radius);
        setButtonDisabled(true);
        if ((new_radius >= 100) && (new_radius <= 5000)) {
            for (let i = 0; i < num_activities; i++)
            {
                if (Activities[i]) {setButtonDisabled(false); return;}
            }
        }
    }

    const return_array = []

    for (let i = 0; i < num_activities; i++)
    {
        return_array.push(
            <div key={"checkbox_" + i} className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={(e) => handleOnCheckboxChange(e, i)} />
            <label className="form-check-label" htmlFor="flexCheckDefault">
                {possible_activity[i]}
            </label>
            </div>
        )
    }

    const [ActivitiesCard, setActivitiesCard] = useState([]) 

    const g_id = localStorage.getItem("GroupID");

    async function GetActivities()
    {
        setLoad(true)
        const userPreferences = {
            "GroupID": g_id,
            "Activitites TF list" : Activities,
            "Radius": Radius
        }
        const places_result = await fetch('/GroupHome/Preferences', {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userPreferences)
        })
        Navigate("/GroupPage/Activities")
    }


    return (
        <>
            <label htmlFor="getradius"> Radius of Search(in metres): </label>
            <input type="number" name="getradius" style={{marginBottom:"3%"}} value={Radius} onChange={handleRadiusChange} required></input>
            {return_array}            
            <button ref={findchoices} style={{marginTop:"5%", marginLeft:"35%"}} className='btn btn-danger' disabled={ButtonDisabled} onClick={GetActivities}> For Activities! </button>
            {ActivitiesCard}
            {Load ? <div className='LOAD'/> : null}
        </>
    );
}

export default FindActivites;