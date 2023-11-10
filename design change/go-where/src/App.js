import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import CreateGroup from './components/pages/CreateGroup';
import GroupPage from './components/pages/GroupPage';
import HomeLayout from './components/pages/HomeLayout';
import GroupLayout from './components/pages/GroupLayout';
import GroupHome from './components/pages/GroupHome';
import JoinGroup from './components/pages/JoinGroup';
import GroupLobby from './components/pages/GroupLobby';
import AddUser from './components/pages/AddUser';
import EditUserInfo from './components/pages/EditUserInfo';
import GroupActivities from './components/pages/GroupActivities';
import ActivityPage from './components/pages/ActivityPage';



function App() {
  return (
	
	<Router>
    <Routes>
      <Route path="/" element={< HomeLayout />}>
          <Route index element={ < Home />} />
          <Route path="CreateGroup" element={< CreateGroup />}/>
          <Route path="JoinGroup" element={< JoinGroup />}/>
          <Route path="AddUser" element={< AddUser />} />
          <Route path="/JoinGroup/*" element={< GroupLobby />}/>
       </Route> 
       <Route path="/GroupPage/" element={< GroupLayout />}> {}
          <Route index element={< GroupPage />} />
          <Route path="Home" element={< GroupHome />}/>
          <Route path="EditUserInfo" element={< EditUserInfo />} />
          { <Route path="Activities" element={< GroupActivities />} /> }
       </Route>
       <Route path="/GroupPage/*/" element={< GroupLayout />}> {}
          <Route path="*" element={< GroupPage />}/> {}
       </Route>
    </Routes>
  </Router>
    
    
  );
}

export default App;
