import React, { useState, useContext, useRef } from 'react';
import  '../../App';
import '../TextField.css';
import { useNavigate } from 'react-router-dom';
import { GroupContext } from '../../contexts/GroupContext';
import back_button from '../../images/back_button.png';
import '../FooterButtons.css';
import { Link } from 'react-router-dom';
import './JoinGroup.css';
import { Tooltip } from '@mui/material';

function JoinGroup(){
    let navigate = useNavigate();

    const code_input_textbox = useRef();

    const [open, setOpen] = useState(false);

    const [groupCode, setGroupCode] = useState("")

    const checkGroupCode = async() => {
        const response = await fetch('http://localhost:4000/joingroup', {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"groupCode" : groupCode})
        }).then(async (response) => {
            if (response.status == 200) {
                const foundGroup = await response.json()
                console.log(foundGroup)
                navigate('/JoinGroup/' + foundGroup.groupCode)
            } else {
                setOpen(true);
                code_input_textbox.current.style.backgroundColor = "#FF8383";
            }
        }).catch(error => {
            console.log('checkGroupCode error: ' + error)
            setOpen(true);
            code_input_textbox.current.style.backgroundColor = "#FF8383";
        })
        
    }


    return (
        <div className='d-flex justify-content-center' style={{}}>
            {
}
            <div className="centerJoin" style={{marginLeft:"4%"}}>
                <div className="container-left">
                    <h1 style={{paddingTop: '30px', fontWeight:"bold"}}>Join a group!</h1>
                </div>
                <div className='centerExtraJoin' style={{paddingTop: '300px'}}>
                <Tooltip title={<p className='lead' style={{height:"13px"}}> Invalid Group Code! </p>} open={open} arrow><input ref={code_input_textbox} className='form-control form-rounded code-input' type="text"
                        onChange={(e) => setGroupCode(e.target.value)}
                        placeholder="Enter Group Code"/></Tooltip>
                        <div></div>
                    <button className="btn btn-warning join-button" onClick={() => checkGroupCode()}>Join Group</button>
                </div>
            </div>
            {}
            <div className="footer">
                <div className="backDiv">
                    <Link to='/'>
                        <button className="btn btn-warning">Back</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default JoinGroup;