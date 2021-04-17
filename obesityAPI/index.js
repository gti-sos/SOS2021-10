var BASE_API_PATH = "/api/v1/obesity-stats";
var Datastore = require("nedb");
var db=new Datastore();

var obesity = [];
var obesityInitialData = [
	{	
		"country": "China",
		"year": 2011,
		"man_percent": 4.2,
		"woman_percent": 5.2,
		"total_population": 1376498048
	},
	{	
		"country": "United States",
		"year": 2007,
		"man_percent": 29.1,
		"woman_percent": 31.5,
		"total_population": 300608000
	}
];

 module.exports.register = (app) => {

    app.get(BASE_API_PATH, (req,res)=>{
	
		db.find({}, (err,obesityInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);//???
		}else{
			var obesityToSend = obesityInDB.map((d)=>{
			return {country: d.country, year: d.year, man_percent: d.man_percent, woman_percent: d.woman_percent, total_population: d.total_population};
			});
			res.send(JSON.stringify(obesityToSend,null,2));
		}
		
	});
    
 });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        db.insert(obesityInitialData);
        
        res.send("Datos cargados");
		res.sendStatus(200);
    });
    
 
    
   app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
	   var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
	   db.find({ country: countryD , year: yearD }, (err,obesityInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);
		}else{
			var obesityToSend = obesityInDB.map((d)=>{
			return {country: d.country, year: d.year, man_percent: d.man_percent, woman_percent: d.woman_percent, total_population: d.total_population};
			});
			res.send(JSON.stringify(obesityToSend,null,2));
		}
		
	});
    });
    
    app.post(BASE_API_PATH, (req,res)=>{
        var newobesity =req.body;
        console.log(`Nuevo objeto en obesity: <${JSON.stringify(newobesity,null,2)}>`);
        db.find({country: newobesity.country, year: newobesity.year, man_percent: newobesity.man_percent, woman_percent: newobesity.woman_percent, 			total_population: newobesity.total_population}, (err, obesityInDB)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500);
		}
		else{
			if(obesityInDB.length==0){
				console.log("Inserting new contact in DB: "+ JSON.stringify(newobesity, null,2));
				db.insert(newobesity);
				res.sendStatus(201); //CREATED
			}
			else{
				console.log();
				res.sendStatus(409); //CONFLICT
			}
		}
        });
       
    });
    
    app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
        var countryD = req.params.country;
		var yearD =  parseInt(req.params.year);
		db.remove({ $and: [{ country: countryD}, {year: yearD }] }, {}, (err, numObesityRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
			res.sendStatus(500);
		}else{
			console.log(yearD);
			console.log(countryD);
			if(numObesityRemoved==0){
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
	});
    });
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
        var countryD = req.params.country;
		var yearD =  parseInt(req.params.year);
		var update = req.body;
		db.update({country: countryD, year: yearD}, {$set: {country: update.country, year: update.year,  man_percent: update.man_percent, woman_percent: update.woman_percent, total_population: update.total_population}}, {},(err, updateObesity) => {
				if (err) {
					console.error("ERROR deleting DB contacts in DELETE: "+err);
				}else{
					res.sendStatus(200);
				}
			
			});
    });
    
    app.post(BASE_API_PATH+"/:country/:year", (req,res)=>{
    
        res.sendStatus(405);
    });
    
    app.put(BASE_API_PATH, (req,res)=>{
    
        res.sendStatus(405);
    });
    app.delete(BASE_API_PATH, (req,res)=>{
        db.remove({}, {multi:true}, (err, numObesityRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
		}else{
			if(numObesityRemoved==0){
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
			
	});
    });



 };