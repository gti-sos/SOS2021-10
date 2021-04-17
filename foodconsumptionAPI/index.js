var BASE_API_PATH = "/api/v1/foodconsumption-stats";
var Datastore = require("nedb");

var dbFood = new Datastore();


var food_consumptionInitialData = [
	{
		"country": "China",
		"year": 2011,
		"foodtype": "Meat",
		"caloryperperson": 539,
		"gramperperson": 265,
		"dailygram": 2368,
		"dailycalory": 3073
	},
	{
		"country": "Spain",
		"year": 2011,
		"foodtype": "Sugar&Fat",
		"caloryperperson": 955,
		"gramperperson": 132,
		"dailygram": 2559,
		"dailycalory": 3192
	},
	{
		"country": "Germany",
		"year": 2010,
		"foodtype": "Produce",
		"caloryperperson": 279,
		"gramperperson": 625,
		"dailygram": 2594,
		"dailycalory": 3501
	},
	{
		"country": "China",
		"year": 2011,
		"foodtype": "Grain",
		"caloryperperson": 1451,
		"gramperperson": 418,
		"dailygram": 2368,
		"dailycalory": 3073
	},

	{
		"country": "United_States",
		"year": 2007,
		"foodtype": "Grain",
		"caloryperperson": 828,
		"gramperperson": 303,
		"dailygram": 2877,
		"dailycalory": 3771
	}
];



 module.exports.register = (app) => {
	
	//OBTIENE TODO EL ARRAY
    app.get(BASE_API_PATH, (req,res)=>{
		dbFood.find({}, (err, foodConsumption)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500); //Internal Server Error
		}
		else{
			var foodConsumptionToSend = foodConsumption.map((d)=> {
				return {country: d.country, year: d.year, foodtype: d.foodtype, caloryperperson: d.caloryperperson, gramperperson: d.gramperperson, 				dailygram: d.dailygram, dailycalory: d.dailycaly};
			});
			//We skip the "_id" field
			res.send(JSON.stringify(foodConsumptionToSend, null, 2));
		}
	} );
        
    });
    
	//LOAD INITIAL DATA
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
		dbFood.insert(food_consumptionInitialData);
        
        res.send("Datos cargados");
    });
	 
	 app.get(BASE_API_PATH+"?caloryperpersonAbove=1000", (req, res)=>{
		
	    db.find({caloryperperson: {$gte: 1000} }, (err,foodConsumption)=>{
			if(err){
				console.error("ERROR accessing DB in GET");
				res.sendStatus(500);
			}else{
				if(foodConsumption.length==0){
					res.sendStatus(404);
				}
				else{
					var foodConsumptionToSend = foodConsumption.map((d)=>{
				return {country: d.country, year: d.year, foodtype: d.foodtype, caloryperperson: d.caloryperperson, gramperperson: d.gramperperson, 				dailygram: d.dailygram, dailycalory: d.dailycaly};
				});
				res.send(JSON.stringify(obesityToSend,null,2));
				}
			}
		
		});
    });

    

	//OBTIENE UN RECURSO
	app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
	    db.find({ country: countryD , year: yearD }, (err,foodConsumption)=>{
			if(err){
				console.error("ERROR accessing DB in GET");
				res.sendStatus(500);
			}else{
				if(foodConsumption.length==0){
					res.sendStatus(404);
				}
				else{
					var foodConsumptionToSend = foodConsumption.map((d)=>{
				return {country: d.country, year: d.year, foodtype: d.foodtype, caloryperperson: d.caloryperperson, gramperperson: d.gramperperson, 				dailygram: d.dailygram, dailycalory: d.dailycaly};
				});
				res.send(JSON.stringify(obesityToSend,null,2));
				}
			}
		
		});
    });

	//SUBE UN RECURSO
    app.post(BASE_API_PATH, (req,res)=>{
        var newfood_consumption =req.body;
        console.log(`Nuevo objeto en food_consumption: <${JSON.stringify(newfood_consumption,null,2)}>`);
        dbFood.find({country: newfood_consumption.country, year: newfood_consumption.year}, (err, food_consumption)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500);
		}
		else{
			if(food_consumption.length==0){
				console.log("Inserting new contact in DB: "+ JSON.stringify(newfood_consumption, null,2));
				dbFood.insert(newfood_consumption);
				res.sendStatus(201); //CREATED
			}
			else{
				console.log();
				res.sendStatus(409); //CONFLICT
			}
		}
	});
        
    });
    
	 //BORRAR RECURSO
    app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		dbFood.remove({$and:[{ country: countryD}, {year: yearD }]}, {}, (err, numFoodConsumptionRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
			res.sendStatus(500);
		}else{
			console.log(yearD);
			console.log(countryD);
			if(numFoodConsumptionRemoved==0){
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
	});
        
    });
    
    
    //ACTUALIZA RECURSO
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var update = req.body;
		dbFood.update({country: countryD, year: yearD}, {$set: {country: update.country, year: update.year, foodtype: update.foodtype, caloryperperson: 			update.caloryperperson, gramperperson: update.gramperperson, dailygram: update.dailygram, dailycalory: update.dailycaly}}, {}, 						function(err, updateFood) {
				if (err) {
					console.error("ERROR updating DB contacts in DELETE: "+err);
				}else{
					res.sendStatus(200);
				}
			
			});	
	});
		
    //ERROR AL POST EN UN RECURSO
    app.post(BASE_API_PATH+"/:country/:year", (req,res)=>{
    
        res.sendStatus(405);
    });
	 
    //ERROR AL ACTUALIZAR UN ARRAY
    app.put(BASE_API_PATH, (req,res)=>{
    
        res.sendStatus(405);
    });
	 
	//BORRAR TODO
    app.delete(BASE_API_PATH, (req,res)=>{
        dbFood.remove({}, {multi:true}, (err, numFoodConsumptionRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
		}else{
			if(numFoodConsumptionRemoved==0){
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
	});
    });



 };