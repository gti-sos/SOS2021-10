var express = require("express");
var bodyParser = require("body-parser");

var food_consumptionAPI =  require("./food_consumptionAPI");
var sanityAPI =  require("./sanityAPI");
var obesityAPI =  require("./obesityAPI");

var PORT = (process.env.PORT || 1607);

var app = express();
app.use(bodyParser.json());

food_consumptionAPI.register(app);
sanityAPI.register(app);
obesityAPI.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});
