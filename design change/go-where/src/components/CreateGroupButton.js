import React from 'react';
import {Link} from 'react-router-dom';

export const CreateGroupButton = ()=> {
        return(
            <Link to='/CreateGroup'>
                <button className ="btn btn-warning" style={{paddingLeft:"35px", paddingRight:"35px", paddingTop:"8px", paddingBottom:"8px"}}>Create Group</button>
            </Link>
        );
    };