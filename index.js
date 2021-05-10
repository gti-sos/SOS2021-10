var express = require("express");

var path = require("path");

var bodyParser = require("body-parser");

var food_consumptionAPIv1 =  require("./src/backend/v1/foodconsumptionAPI");
var sanityAPIv1 =  require("./src/backend/v1/sanityAPI");
var sanityAPIv2 =  require("./src/backend/v2/sanityAPI");
var obesityAPIv1 =  require("./src/backend/v1/obesityAPI");
var obesityAPIv2 =  require("./src/backend/v2/obesityAPI");

var PORT = (process.env.PORT || 10000);

var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));



food_consumptionAPIv1.register(app);
sanityAPIv1.register(app);
sanityAPIv2.register(app);
obesityAPIv1.register(app);
obesityAPIv2.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});
