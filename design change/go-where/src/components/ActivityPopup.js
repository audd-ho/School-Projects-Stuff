import React, {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './PopupDivs.css';
import './TextField.css';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY

export const ActivityPopup = ({activity, open, setOpen, imgurl})=> {

    const [details, setDetails] = useState({})
    const getDetails = async (activity) => {
        const response = await fetch('http://localhost:4000/activity/getDetails/' + new URLSearchParams({
                place_id: JSON.stringify(activity.place_id),
            }))
            .then(async response => {
                setDetails(await response.json());
            }).catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getDetails(activity)
    }, [])

    const displayOpeningHours = (openingHours) => {
        if (!openingHours) {
            return (
                <p id="popup">Unavailable</p>
            )
        }
        return openingHours.weekday_text.map((text, i) => 
            <p key={i} id="popup">{text}</p>
        )
    }

    return(
        <Popup contentStyle={{width: '550px'}} open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
            <div className="container-popup">
                <h2 id='popup' className="text-overflow" style={{width: '500px'}}>{activity.name}</h2>
                <div className="container-info">
                    <div className='container-vertical-left'>
                        <img id="popup" src={imgurl}></img>
                        <div className="container-popup-details" style={{width: '200px'}}>
                            <h3 id='popup'>Location: </h3>
                            <p id="popup">{activity.formatted_address}</p>
                            <h3 id='popup'>Number: </h3>
                            <p id="popup">{details.formatted_phone_number}</p>
                        </div>
                    </div>
                    <div className="container-popup-details" style={{width: '300px'}}>
                        <h3 id='popup'>Opening hours:</h3>
                        {displayOpeningHours(details.opening_hours)}
                    </div>
                </div>
                <div className="container-image-links">
                    <a href={details.website}>Website</a>
                    <a href={details.url}>Google Maps</a>
                </div>
            </div>
        </Popup>
    );
}