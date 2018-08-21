const glob = require('glob')
const express = require("express");
const path = require('path');
var app = express()
console.log(__dirname, './service/*-service.js')
glob(path.resolve(__dirname, './service/*-service.js'), (err, filepaths)=> {
    filepaths.forEach(servicePath => {
        require(servicePath)(app)
    });

    app.listen(8081)
})
