var BASE_API_PATH = "/api/v1/foodconsumption-stats";
var Datastore = require("nedb");

var dbFood = new Datastore();

var food_consumption = [];
var food_consumptionInitialData = [
	{
		"country": "China",
		"year": 2011,
		"foodtype": "Meat",
		"caloryperperson": 539,
		"gramperperson": 265,
		"dailygram": 2334,
		"dailycalory": 3023
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



 module.exports.register = (app) => {

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
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
		dbFood.insert(food_consumptionInitialData);
        
        res.send("Datos cargados");
    });
    

	
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
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var update = req.body;
		dbFood.update({country: countryD, year: yearD}, {$set: {country: update.country, year: update.year, foodtype: update.foodtype, caloryperperson: 			update.caloryperperson, gramperperson: update.gramperperson, dailygram: update.dailygram, dailycalory: update.dailycaly}}, {}, 						function(err, updateFood) {
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