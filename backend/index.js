const connectToMongo = require("./db");
const express = require('express');
const cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

app.listen(port, () => {
    console.log(`iNotebook backend listening on port ${port}`);
});


