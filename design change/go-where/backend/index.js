const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express();

const bodyParser = require('body-parser');


const creategroup = require('./routes/CreateGroup.js')
const createuser = require('./routes/CreateUser.js')
const grouppage = require('./routes/GroupPage.js');
const joingroup = require('./routes/JoinGroup.js');
const grouplobby = require('./routes/GroupLobby.js');
const grouplayout = require('./routes/GroupLayout.js');
const adduser = require('./routes/AddUser.js');
const edituserinfo = require('./routes/EditUserInfo.js');
const grouphome = require('./routes/GroupHome.js');

app.use(cors());
app.use('/CreateGroup', creategroup)
app.use('/CreateUser', createuser)
app.use('/GroupPage', grouppage)
app.use('/JoinGroup', joingroup)
app.use('/GroupLobby', grouplobby)
app.use('/AddUser', adduser)
app.use('/GroupLayout', grouplayout)
app.use('/EditUserInfo', edituserinfo)
app.use('/GroupHome', grouphome)

const groupactivities = require('./routes/GroupActivities.js');
app.use("/GroupActivities", groupactivities);


const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(process.env.DB_URI, dbOptions).then(() =>console.log('database connected!')).catch(err => console.log(err))


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});