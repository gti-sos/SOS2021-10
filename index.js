
var cool = require("cool-ascii-faces");

var express = require("express");

var path = require("path");

var bodyParser=require("body-parser");

var port = (process.env.PORT || 10000);

var BASE_API_PATH="/api/v1";

var app = express();

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname,"public")));





//foodConsumption-stats
app.get("/info/foodconsumption-stats", (req, res) => {
    res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>food-type</th> <th>calory-per-person</th> <th>gram-per-person</th> <th>daily-gram</th> <th>daily-calory</th></tr> <tr> <td>China</td> <td>2011</td> <td>Meat</td> <td>509</td> <td>254</td> <td>2368</td> <td>3073</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>Grain</td> <td>828</td> <td>303</td> <td>2877</td> <td>3771</td> </tr> <tr> <td>Spain</td> <td>2008</td> <td>Sugar & Fat</td> <td>955</td> <td>162</td> <td>2559</td> <td>3192</td> </tr> <tr> <td>Germany</td> <td>2010</td> <td>Produce</td> <td>279</td> <td>625</td> <td>2594</td> <td>3501</td> </tr> <tr> <td>India</td> <td>2009</td> <td>Meat</td> <td>28</td> <td>28</td> <td>1250</td> <td>2409</td> </tr></table></body></html>");
});

app.post("/info/foodconsumption-stats", (req, res) => {
     res.send("<html><body><table class='default'><tr><th>country</th> <th>year</th> <th>food-type</th> <th>calory-per-person</th> <th>gram-per-person</th> <th>daily-gram</th> <th>daily-calory</th></tr> <tr> <td>China</td> <td>2011</td> <td>Meat</td> <td>509</td> <td>254</td> <td>2368</td> <td>3073</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>Grain</td> <td>828</td> <td>303</td> <td>2877</td> <td>3771</td> </tr> <tr> <td>Spain</td> <td>2008</td> <td>Sugar & Fat</td> <td>955</td> <td>162</td> <td>2559</td> <td>3192</td> </tr> <tr> <td>Germany</td> <td>2010</td> <td>Produce</td> <td>279</td> <td>625</td> <td>2594</td> <td>3501</td> </tr> <tr> <td>India</td> <td>2009</td> <td>Meat</td> <td>28</td> <td>28</td> <td>1250</td> <td>2409</td> </tr></table></body></html>");
});

var foodconsumption = [];
var foodconsumptionInitialData = [
	{
		"country": "China",
		"year": 2011,
		"foodtype": "Meat",
		"caloryperperson": 509,
		"gramperperson": 254,
		"dailygram": 2368,
		"dailycalory": 3070
	},
	{
		"country": "United States",
		"year": 2007,
		"foodtype": "Grain",
		"caloryperperson": 828,
		"gramperperson": 303,
		"dailygram": 2877,
		"dailycalory": 3771
	}
];

app.get(BASE_API_PATH+"/foodconsumption-stats", (req,res)=>{
	res.send(JSON.stringify(foodconsumption,null,2));
	res.sendStatus(200);
});

app.get(BASE_API_PATH+"/foodconsumption-stats/loadInitialData", (req, res)=>{
	for(var i=0; i<foodconsumptionInitialData.length; i++){
		foodconsumption.push(foodconsumptionInitialData[i]);
		
	}
	
	res.send("Loaded Data");
	res.sendStatus(200);
});

app.post(BASE_API_PATH+"/foodconsumption-stats", (req,res)=>{
	var newFoodconsumption =req.body;
	console.log(`Nuevo objeto en Obesity: <${JSON.stringify(newFoodconsumption,null,2)}>`);
	foodconsumption.push(newFoodconsumption);
	
	res.sendStatus(201);
});


app.get(BASE_API_PATH+"/foodconsumption-stats/China", (req, res)=>{
	for(var i=0; i<foodconsumption.length; i++){
		if(foodconsumption[i].country=="China"){
			res.send(JSON.stringify(foodconsumption[i],null,2));
			
		}
	}
	res.sendStatus(200);
});
app.get(BASE_API_PATH+"/foodconsumption-stats/China/2011", (req, res)=>{
	for(var i=0; i<foodconsumption.length; i++){
		if(foodconsumption[i].country=="China"&&foodconsumption[i].year==2011){
			res.send(JSON.stringify(foodconsumption[i],null,2));
			
		}
	}
	res.sendStatus(200);
});

app.delete(BASE_API_PATH+"/foodconsumption-stats/China/2011", (req,res)=>{
	for(var i=0; i<foodconsumption.length; i++){
		if(foodconsumption[i].country=="China"&&foodconsumption[i].year==2011){
			foodconsumption.splice(i, 1);
			console.log(foodconsumption);
		}
	}
	res.send("Deleted Data");
	res.sendStatus(200);
});

app.put(BASE_API_PATH+"/foodconsumption-stats/China/2011",(req,res)=>{
	for(var i=0; i<foodconsumption.length; i++){
		if(foodconsumption[i].country=="China"&&foodconsumption[i].year==2011){
			foodconsumption[i]=req.body;
		}
	}
	res.send("Updated Data");
	res.sendStatus(200);
});

app.post(BASE_API_PATH+"/foodconsumption-stats/China/2011", (req,res)=>{

	res.sendStatus(405);
});

app.put(BASE_API_PATH+"/foodconsumption-stats", (req,res)=>{

	res.sendStatus(405);
});

app.delete(BASE_API_PATH+"/foodconsumption-stats", (req,res)=>{
	for(var i=0; i<foodconsumption.length+1; i++){
		foodconsumption.pop();
		
	}
	res.send("Deleted Data");
	res.sendStatus(200);
});




































































//obesity-stats
app.get("/info/obesity-stats", (req, res) => {
res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>man-percent</th> <th>woman-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> <td>5.2</td> //<td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> //<td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
});

app.post("/info/obesity-stats", (req, res) => {
res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>man-percent</th> <th>woman-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> <td>5.2</td> <td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
});

var obesity = [];
var obesityInitialData = [
	{
		"country": "China",
		"year": 2011,
		"man-percent": 4.2,
		"woman-percent": 5.2,
		"total-population": 1376498048
	},
	{
		"country": "United States",
		"year": 2007,
		"man-percent": 29.1,
		"woman-percent": 31.5,
		"total-population": 300608000
	}
];

app.get(BASE_API_PATH+"/obesity-stats", (req,res)=>{
	res.send(JSON.stringify(obesity,null,2));
});

app.get(BASE_API_PATH+"/obesity-stats/loadInitialData", (req, res)=>{
	for(var i=0; i<obesityInitialData.length; i++){
		obesity.push(obesityInitialData[i]);
	}
	
	res.send("Datos cargados");
});

//app.get(BASE_API_PATH+"/obesity-stats/China", (req, res)=>{
//	if(obesityInitialData.get("country")=="China"){
	//	obesity.push(obesityInitialData[0]);
	//}
	
//	res.send("Datos cargados");
//});

app.post(BASE_API_PATH+"/obesity-stats", (req,res)=>{
	var newObesity =req.body;
	console.log(`Nuevo objeto en Obesity: <${JSON.stringify(newObesity,null,2)}>`);
	obesity.push(newObesity);
	
	res.sendStatus(201);
});



app.get("/cool",(request,response) => {
	
	response.send(cool());
	console.log("New request to /cool has arrived");
});

app.listen(port, () =>{
    console.log(`Server ready listening on port ${port}`);
});
