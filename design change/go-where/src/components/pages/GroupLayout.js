import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { CopyToClipboard } from "../CopyClipboard";
import { useEffect, useState } from "react";
import "./GroupLayout.css"

function GroupLayout(){

    const [groupCode, setgroupCode] = useState("CODEY");
    const [groupName, setgroupName] = useState("T34M1");
    const [userName, setuserName] = useState("TOMMY");
    const userId = localStorage.getItem("UserID");
    const groupId = localStorage.getItem("GroupID");

    console.log(userId)
    console.log(groupId)



    let navigate = useNavigate();
    useEffect(()=>{
        async function getDeets(){
            if ((userId == null)||(groupId == null)) {navigate('/');}
            const response = await fetch('http://localhost:4000/GroupLayout', {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"groupID" : groupId, "userID" : userId})
            }).then(async (response) => {
                if (response.status == 200) {
                    const U_G_details = await response.json()
                    console.log(U_G_details)
                    const userInfo = U_G_details.Uinfo;
                    const groupInfo = U_G_details.Ginfo;

                    setuserName(userInfo.name);
                    setgroupCode(groupInfo.groupCode);
                    setgroupName(groupInfo.groupName);

                } else {
                    navigate('/')
                }
            }).catch(error => {
                navigate('/')
            })
        }
        getDeets();
    },[userId])
    function byebye(){
        localStorage.removeItem("UserID");
        localStorage.removeItem("GroupID");
        navigate('/');
    }
    function change(){
        navigate('EditUserInfo')
    }
    return(
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{position: "sticky", top: "0", zIndex: "9999"}}>
            <div className="container-fluid justify-content-between">
                <Link to="/"> <button className="btn btn-dark"> GoWhere </button> </Link>
                <div className="collapse navbar-collapse" idname="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/" className="nav-link active"><button className="btn btn-light">Home</button></Link></li>
                    </ul>
            </div>
                <div className="collapse navbar-collapse justify-content-between" style={{fontWeight:"bold", fontSize:"17px", marginRight:"2%"}}>
                    <div>
                    {groupName+": "+groupCode}
                    < CopyToClipboard link_img_size="20" item_for_copy={groupCode} />
                    </div>
                </div>
                {
}
                <div className="dropdown">
                <button id="dropdownMenuButton" type="button" className="btn btn-dark dropdown-toggle"  data-toggle="dropdown"> {userName} </button> {}
                <ul className={"dropdown-menu dropdown-menu-right"}>
                    <li><a className="dropdown-item" onClick={change} href={""}>Edit Profile</a></li>
                    <li><a className="dropdown-item" onClick={byebye} href={""}>Log Out</a></li>
                    {}
                </ul>
                </div>
            </div>
        </nav>
        <Outlet context={[userName, setuserName]}/>
        </>
    );
}

export default GroupLayout;