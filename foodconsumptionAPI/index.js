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
    
    app.get(BASE_API_PATH+"/:country", (req, res)=>{
        var filtrado = []
        for(var i=0; i<food_consumption.length; i++){
            if(food_consumption[i].country==req.params.country){
                filtrado.push(food_consumption[i]);
            }
        }
        res.send(JSON.stringify(filtrado,null,2));
        
    });
	app.get(BASE_API_PATH+"/:country/:year/:foodtype/:caloryperperson/:gramperperson/:dailygram/:dailycalory", (req, res)=>{
	 	var country = req.params.country;
		var year = req.params.year;
		var foodtype = req.params.foodtype;
		var caloryperperson = req.params.caloryperperson;
		var gramperperson = req.params.gramperperson;
		var dailygram = req.params.dailygram;
		var dailycalory = req.params.dailycalory;
		var filtros = [];
		for(var i=0; i<req.params.size; i++){
			if(req.params[i]==null){
				var newfilter = req.params[i]
				filtros.push(newfilter);
			}
		}
		console.log(filtros);
		 /*food_consumption = food_consumption.filter( (c)=>{
            return (c.country == country || c.year == year || c.foodtype == foodtype || c.caloryperperson == caloryperperson || c.gramperperson == gramperperson || c.dailygram == dailygram || c.dailycalory == dailycalory);
        });*/
	 res.send(JSON.stringify(food_consumption,null,2));
	 res.send("Intentando cosas");
	
	
	});
    
    /*app.get(BASE_API_PATH+"/:country/:year/:foodtype/:caloryperperson/:gramperperson/:dailygram/:dailycalory", (req, res)=>{
        for(var i=0; i<food_consumption.length; i++){
            if(food_consumption[i].country==req.params.country){
				if(food_consumption[i].year==req.params.year){
					res.send(JSON.stringify(food_consumption[i],null,2));
				}
				else{
					 res.send(JSON.stringify(food_consumption[i],null,2));
				}
               
                
            }
        }
        //res.sendStatus(200);
    });*/
    
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
		dbFood.remove({$and: [{ country: countryD }, { year: yearD }] }, {}, (err, numFoodConsumptionRemoved)=>{
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
		var yearD = req.params.year;
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
        dbFood.remove({}, {}, (err, numFoodConsumptionRemoved)=>{
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