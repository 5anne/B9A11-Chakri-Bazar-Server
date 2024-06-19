const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('All Jobs are here!!!')
})

app.listen(port, () => {
    console.log(`Console is Active on ${port}`)
})