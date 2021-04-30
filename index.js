var express = require("express");

var path = require("path");

var bodyParser = require("body-parser");

var food_consumptionAPI =  require("./src/backend/foodconsumptionAPI");
var sanityAPI =  require("./src/backend/sanityAPI");
var obesityAPI =  require("./src/backend/obesityAPI");

var PORT = (process.env.PORT || 10000);

var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));



food_consumptionAPI.register(app);
sanityAPI.register(app);
obesityAPI.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});
