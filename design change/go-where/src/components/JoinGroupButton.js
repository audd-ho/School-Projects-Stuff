import React from 'react';
import {Link} from 'react-router-dom';

export const JoinGroupButton = ()=> {
    return(
        <Link to='/JoinGroup'>
            <button className = "btn btn-warning" style={{paddingLeft:"47px", paddingRight:"47px", paddingTop:"8px", paddingBottom:"8px"}}>Join Group</button>
        </Link>
    );
};