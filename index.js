const express = require('express');

var app = express()

app.get('/helloworld', (req, res) => {
    res.send({msg: "Hello World!"})
} )

app.listen(3000, () => console.log('Example app listening on port 3000!'))
