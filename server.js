const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();
app.use(serveStatic(__dirname + "/dist"));

app.use((req, res, next) => {
	res.redirect('/')
});
  
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});