import React, { useState, useEffect, useRef } from 'react';
import './ProvideUserInfo.css'
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';


export const ProvideUserInfo = (props) => {
    const [Name, setName] = useState(props.curUserData.Name);
    const [AddressName, setAddressName] = useState(props.curUserData.AddressName);
    const [LatLon, setLatLon] = useState (props.curUserData.LatLon);
    const [SpecificAddressInfo, setSpecificAddressInfo] = useState(props.curUserData.SpecificAddressInfo);


    const [autocompleteInput, setautocompleteInput] = useState(0)
    const [userData, setuserData] = useState({
        "Name" : Name,
        "AddressName" : AddressName,
        "LatLon" : LatLon,
        "SpecificAddressInfo" : SpecificAddressInfo
    })

    useEffect(()=>{
        setuserData({
            "Name" : Name,
            "AddressName" : AddressName,
            "LatLon" : LatLon,
            "SpecificAddressInfo" : SpecificAddressInfo
        })
    }
    ,[Name,AddressName,LatLon,SpecificAddressInfo])

    useEffect (() => {
        props.dataChange(userData)  
    }, [userData])



    async function geoAddress() {
        const position = await getPostion();
        console.log(position)
        const geo_location = "https://api.geoapify.com/v1/geocode/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&lang=en&apiKey=5e1e08a5904145afbf5860ffcf26a440"
        const add_info = await fetch(geo_location).then((resp) => resp.json());
        console.log(add_info)
        autocompleteInput.setValue(add_info["features"][0]["properties"]["formatted"])
        setLatLon({"Lat" : position.coords.latitude, "Lon" : position.coords.longitude});
        setAddressName(add_info["features"][0]["properties"]["formatted"])
        setSpecificAddressInfo(add_info["features"][0])
        console.log(add_info["features"][0]["properties"]["formatted"])
    }

    function getPostion(){
        return new Promise ((resolve, reject) => {(navigator.geolocation.getCurrentPosition(resolve, reject));});
    }


    const autocomplete_ref = useRef();
    

    useEffect(() => {  
        const autocomplete = new GeocoderAutocomplete(
            autocomplete_ref.current, 
            '5e1e08a5904145afbf5860ffcf26a440', 
            { lang:"en" });
        
        
        autocomplete.addFilterByCountry(['sg']);
        autocomplete.setValue(props.curUserData.AddressName)

        autocomplete.on('select', (location) => {
            console.log(location)
            console.log(autocomplete.getValue())
            setAddressName(autocomplete.getValue())
            setSpecificAddressInfo(location)
            if (location != null) {setLatLon({ ["Lat"]: location["geometry"]["coordinates"][1] , ["Lon"]: location["geometry"]["coordinates"][0] })}
            else {setLatLon({ ["Lat"]: "" , ["Lon"]: "" })}
        });

        autocomplete.on('suggestions', (suggestions) => {
            console.log(suggestions)
        });

        setautocompleteInput(autocomplete)
    }, []);

    return (
        <>
            {}
            <p style={{textAlign:"left", paddingLeft:"32px", fontWeight:"bold", fontSize:"25px"}}>Name</p>
            <input name='username' className='form-control form-rounded' style={{marginLeft:"32px", width:"84%", padding:"4px"}} type='text' placeholder="  Enter a Username" onChange={(e) => {setName(e.target.value)}} value={Name}></input>
            <br/>
            <p style={{textAlign:"left", paddingLeft:"32px", fontWeight:"bold", fontSize:"25px", paddingBottom:"0px"}}>Address</p>
            <div ref={autocomplete_ref} className="autocomplete-container " style={{padding:"3%", width:"400px", paddingTop:"0px"}}></div>
            <div style={{display:"inline-flex", paddingLeft:"0%", paddingRight:"0%"}}>
            <button className='btn btn-light btn-block' onClick={geoAddress}> Get Address via Geolocation Address </button>
            {}
            {}
            </div>
        </>
    )
}
