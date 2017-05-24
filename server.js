// ================= DEPENDENCIES ==================
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

// ================= MIDDLEWARE ====================
app.use(express.static('public'));

// ================= LISTENER ======================
app.listen(port, function() {
  console.log('listening on port: ' + port);
});
