var BASE_API_PATH = "/api/v1/obesity-stats";
var Datastore = require("nedb");

var path = require('path');
var datafile = path.join(__dirname, 'obesity-stats.db');
var db = new Datastore({ filename: datafile, autoload: true});
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
	},
	{	
		"country": "Spain",
		"year": 2008,
		"man_percent": 20.8,
		"woman_percent": 21,
		"total_population": 46069000
	},
	{	
		"country": "Germany",
		"year": 2010,
		"man_percent": 21.1,
		"woman_percent": 18.6,
		"total_population": 80827000
	},
	{	
		"country": "India",
		"year": 2009,
		"man_percent": 1.7,
		"woman_percent": 3.6,
		"total_population": 1217725952
	}
];

 module.exports.register = (app) => {

    app.get(BASE_API_PATH, (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		
		//PAGINACIÓN
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }
		
		//BUSQUEDA
		if(req.query.country) dbquery["country"]= req.query.country;
		if(req.query.year) dbquery["year"] = parseInt(req.query.year);
		if(req.query.man_percent) dbquery["man_percent"] = parseFloat(req.query.man_percent);
		if(req.query.woman_percent) dbquery["woman_percent"] = parseFloat(req.query.woman_percent);
		if(req.query.total_population) dbquery["total_population"] = parseInt(req.query.total_population);	
		
		db.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error, obesity) =>{
			if(error){
				res.sendStatus(500);
			}else{
				if(obesity.length==0){
						
						console.log();
						res.sendStatus(404);
				}
				else{
					obesity.forEach((f)=>{
                delete f._id
            });
				if(obesity.length==1){
						res.status(200).send(JSON.stringify(obesity[0],null,2));
					console.log("Recursos mostrados");
					}
					else{
						res.send(JSON.stringify(obesity,null,2));
					}
					
				}
			}
			
			
		});
    
 });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        db.insert(obesityInitialData);
        
        
		res.status(200).send("Datos cargados");
    });
    
 
    /*
   app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
	   var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
	   db.find({ country: countryD , year: yearD }, (err,obesityInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);
		}else{
			if(obesityInDB.length==0){
				res.sendStatus(404);
			}else{
				var obesityToSend = obesityInDB.map((d)=>{
			return {country: d.country, year: d.year, man_percent: d.man_percent, woman_percent: d.woman_percent, total_population: d.total_population};
			});
			res.send(JSON.stringify(obesityToSend,null,2));
			}
			
		}
		
	});
    });
    */
	 
	 app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
	   var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
	   db.find({ country: countryD , year: yearD }, (err,obesityInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);
		}else{
			if(obesityInDB.length==0){
				res.sendStatus(404);
			}else{
				var obesityToSend = obesityInDB.map((d)=>{
			return {country: d.country, year: d.year, man_percent: d.man_percent, woman_percent: d.woman_percent, total_population: d.total_population};
			});
			res.status(200).send(JSON.stringify(obesityToSend,null,2));
			}
			
		}
		
	});
    });
	
	 
    app.post(BASE_API_PATH, (req,res)=>{
        var newobesity =req.body;
        console.log(`Nuevo objeto en obesity: <${JSON.stringify(newobesity,null,2)}>`);
        db.find({country: newobesity.country, year: newobesity.year, man_percent: newobesity.man_percent, woman_percent: newobesity.woman_percent, 			total_population: newobesity.total_population}, (err, obesityInDB)=>{
		if(err){
			console.error("ERROR accessing 	DB in POST");
			res.sendStatus(500);
		}
		else{
			if(obesityInDB.length==0){
				if (!newobesity.country
                        || !newobesity.year
                        || !newobesity.man_percent
                        || !newobesity.woman_percent
                        || !newobesity.total_population
                        || Object.keys(newobesity).length != 5) {

                        res.sendStatus(400);
                    } else {
                        console.log("Inserting new contact in DB: "+ JSON.stringify(newobesity, null,2));
						db.insert(newobesity);
						res.sendStatus(201); //CREATED
                    }
				
			}else{
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
			
			if(numObesityRemoved==0){
				console.error("No data found");
				res.sendStatus(404);
			}else{
				console.log(`stat with country: <${countryD}> and year: <${yearD}> deleted`);
				res.sendStatus(200);
			}
		}
	});
    });
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
        var countryD = req.params.country;
		var yearD =  parseInt(req.params.year);
		var update = req.body;
		if (!update.country
            || !update.year
            || !update.man_percent
            || !update.woman_percent
            || !update.total_population
            || update.country != countryD
            || update.year != yearD
            || Object.keys(update).length != 5) {

            console.log("Invalid field update")
            res.sendStatus(409);
        } else {
		db.update({country: countryD, year: yearD}, {$set: {country: update.country, year: update.year,  man_percent: update.man_percent, woman_percent: update.woman_percent, total_population: update.total_population}}, {},(err, updateObesity) => {
				if (err) {
					console.error("ERROR accesing DB in PUT");
					res.sendStatus(500);
				}else{
					if (updateObesity == 0) {
                        console.error("No data found");
                        res.sendStatus(404);
                    } else {
                        console.log("Updated fields")
                        res.sendStatus(200);
                    }
				}
			
			});
		}
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
			res.sendStatus(500);
		}else{
			if(numObesityRemoved==0){
				console.error("ERROR obesity-stats not found");
				res.sendStatus(404);
			}else{
				res.status(200).send("Successfully removed");
			}
		}
			
	});
    });



 };