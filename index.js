var express = require("express");

var path = require("path");

var bodyParser = require("body-parser");


var obesityAPIv2 =  require("./src/backend/v2/obesityAPI");

var PORT = (process.env.PORT || 10000);
var cors = require("cors");


var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));



obesityAPIv2.register(app);


app.use(cors());


app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});
