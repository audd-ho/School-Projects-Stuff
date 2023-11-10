import { Link, Outlet, useNavigate, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeLayout(){

    const userId = localStorage.getItem("UserID");
    const groupId = localStorage.getItem("GroupID");

    console.log(userId)
    console.log(groupId)

    let navigate = useNavigate();

    function checkoOnce(){
        if (userId==null || groupId==null){return;}
        navigate('/GroupPage/Home');
    }
    useEffect(()=>{
        checkoOnce();
    },[userId])
    return(
        <>
        <nav className="navbar navbar-expand-lg" style={{position: "sticky", top: "0", zIndex: "9999", backgroundColor:"#FAF9F6"}}>
            <div className="container-fluid">
                <Link to="/"> <button className="btn btn-dark"> GoWhere </button> </Link>
                <div className="collapse navbar-collapse" idname="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/" className="nav-link active"><button className="btn btn-light">Home</button></Link></li>
                        <li className="nav-item"><Link to="joingroup" className="nav-link"><button className="btn btn-light">Join Group</button></Link></li>
                        <li className="nav-item"><Link to="creategroup" className="nav-link"><button className="btn btn-light">Create Group</button></Link></li>
                        {
}
                    </ul>
                </div>
            </div>
        </nav>
        <Outlet/>
        {}
        </>
    );
}

export default HomeLayout;