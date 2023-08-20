const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = require('./routes/api')

const port = 3001;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/public', express.static('public'));
app.use(cors());

app.use(express.json())
app.use('/api',api)

app.listen(port,()=>{
    console.log(`server started at ${port}`);
})