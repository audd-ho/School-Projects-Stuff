import React from 'react';
import  '../../App';
import  './Home.css';
import { JoinGroupButton } from '../JoinGroupButton';
import { CreateGroupButton } from '../CreateGroupButton';

import { Outlet, Link } from "react-router-dom";

function Home(){
    return(
        <>
        <div className="center">
            <h1 style={{fontWeight:"bolder", fontSize:"50px"}}>GoWhere</h1>
            <br/>
            <br/>
            <JoinGroupButton />
            <br/>
            <br/>
            <p style={{fontSize: "16px"}}><strong>or</strong></p>
            <br/>
            <CreateGroupButton />
            {}
            {}
        </div>
        </>
        
    );
}
export default Home;