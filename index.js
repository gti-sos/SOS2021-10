
var cool = require("cool-ascii-faces");
var express = require("express");
var path = require("path");

var app = express();

var port = (process.env.PORT || 10000);

app.use("/", express.static(path.join(__dirname,"public")));

//foodConsumption-stats
app.get("/info/foodConsumption-stats", (req, res) => {
    res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>food-type</th> <th>calories-per-person</th> <th>grams-per-person</th> <th>daily-grams</th> <th>daily-calories</th></tr> <tr> <td>China</td> <td>2011</td> <td>Meat</td> <td>509</td> <td>254</td> <td>2368</td> <td>3073</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>Grain</td> <td>828</td> <td>303</td> <td>2877</td> <td>3771</td> </tr> <tr> <td>Spain</td> <td>2008</td> <td>Sugar & Fat</td> <td>955</td> <td>162</td> <td>2559</td> <td>3192</td> </tr> <tr> <td>Germany</td> <td>2010</td> <td>Produce</td> <td>279</td> <td>625</td> <td>2594</td> <td>3501</td> </tr> <tr> <td>India</td> <td>2009</td> <td>Meat</td> <td>28</td> <td>28</td> <td>1250</td> <td>2409</td> </tr></table></body></html>");
});

app.post("/info/foodConsumption-stats", (req, res) => {
     res.send("<html><body><table class='default'><tr><th>country</th> <th>year</th> <th>food-type</th> <th>calories-per-person</th> <th>grams-per-person</th> <th>daily-grams</th> <th>daily-calories</th></tr> <tr> <td>China</td> <td>2011</td> <td>Meat</td> <td>509</td> <td>254</td> <td>2368</td> <td>3073</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>Grain</td> <td>828</td> <td>303</td> <td>2877</td> <td>3771</td> </tr> <tr> <td>Spain</td> <td>2008</td> <td>Sugar & Fat</td> <td>955</td> <td>162</td> <td>2559</td> <td>3192</td> </tr> <tr> <td>Germany</td> <td>2010</td> <td>Produce</td> <td>279</td> <td>625</td> <td>2594</td> <td>3501</td> </tr> <tr> <td>India</td> <td>2009</td> <td>Meat</td> <td>28</td> <td>28</td> <td>1250</td> <td>2409</td> </tr></table></body></html>");
});


//sanity-stats

//obesity-stats
app.get("/info/obesity-stats", (req, res) => {
    res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>men-percent</th> <th>women-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> <td>5.2</td> <td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
});

app.post("/info/obesity-stats", (req, res) => {
     res.send("<html><body><table border='1'><tr><th>country</th> <th>year</th> <th>men-percent</th> <th>women-percent</th> <th>total-population</th></tr> <tr><td>China</td> <td>2011</td> <td>4.2</td> <td>5.2</td> <td>1376498048</td> </tr> <tr> <td>United States</td> <td>2007</td> <td>29.1</td> <td>31.5</td> <td>300608000</td>  </tr> <tr> <td>Spain</td> <td>2008</td> <td>20.8</td> <td>21</td> <td>46069000</td></tr> <tr> <td>Germany</td> <td>2010</td> <td>21.1</td> <td>18.6</td> <td>80827000</td> </tr> <tr> <td>India</td> <td>2009</td> <td>1.7</td> <td>3.6</td> <td>1217725952</td> </tr></table></body></html>");
});





app.get("/cool",(request,response) => {
	
	response.send(cool());
	console.log("New request to /cool has arrived");
});

app.listen(port, () =>{
    console.log(`Server ready listening on port ${port}`);
});