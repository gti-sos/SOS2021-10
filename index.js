
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


//sanity-stats
app.get("/info/sanity-stats", (req, res) => {
    res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>health-expenditure-in-percentage</th> <th>doctor-per-1000-habitant</th> <th>hospital-bed</th></tr> <tr><td>China</td> <td>2011</td> <td>10'61685285</td> <td>1'5</td> <td>3705100</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>19'01326713</td> <td>2'41</td> <td>945199</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>15'73140496</td> <td>4'67</td> <td>146934</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>18'14760105</td> <td>3'775</td> <td>674473</td> </tr> <tr> <td>India</td> <td>2009</td> <td>4'36884071</td> <td>0'264</td> <td>540328</td> </tr></table></body></html>");
});

app.post("/info/sanity-stats", (req, res) => {
    res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>health-expenditure-in-percentage</th> <th>doctor-per-1000-habitant</th> <th>hospital-bed</th></tr> <tr><td>China</td> <td>2011</td> <td>10'61685285</td> <td>1'5</td> <td>3705100</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>19'01326713</td> <td>2'41</td> <td>945199</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>15'73140496</td> <td>4'67</td> <td>146934</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>18'14760105</td> <td>3'775</td> <td>674473</td> </tr> <tr> <td>India</td> <td>2009</td> <td>4'36884071</td> <td>0'264</td> <td>540328</td> </tr></table></body></html>");
});
//obesity-stats
//app.get("/info/obesity-stats", (req, res) => {
 //   res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>man-percent</th> <th>woman-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> <td>5.2</td> //<td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> //<td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
//});

//app.post("/info/obesity-stats", (req, res) => {
//     res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>man-percent</th> <th>woman-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> //<td>5.2</td> <td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
//});
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

app.post(BASE_API_PATH+"/obesity-stats", (req,res)=>{
	var newObesity =req.body;
	console.log(`Nuevo objeto en Obesity: <${JSON.stringify(newObesity,null,2)}>`);
	obesity.push(newObesity);
	
	res.sendStatus(201);
});

var china= [{
		"country": "China",
		"year": 2011,
		"man-percent": 4.2,
		"woman-percent": 5.2,
		"total-population": 1376498048
	}];

app.get(BASE_API_PATH+"/obesity-stats/china", (req,res)=>{
	res.send(JSON.stringify(china,null,2));
});

app.delete(BASE_API_PATH+"/obesity-stats/china", (req,res)=>{
	res.send(JSON.stringify(china,null,2));
});


app.get("/cool",(request,response) => {
	
	response.send(cool());
	console.log("New request to /cool has arrived");
});

app.listen(port, () =>{
    console.log(`Server ready listening on port ${port}`);
});
