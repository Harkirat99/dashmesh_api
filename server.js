const express = require('express');
const app = express();
require("dotenv").config;

const PORT = process.env.PORT;

app.get('/api/get', (req, res) => {
    res.send('Hello, World from dashmesh api!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
