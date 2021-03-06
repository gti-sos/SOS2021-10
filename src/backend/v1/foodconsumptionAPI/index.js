
var BASE_API_PATH = "/api/v1/foodconsumption-stats";

var path = require("path");

var Datastore = require("nedb");

const dbFileName = path.join(__dirname,"foodconsumption.db");

const dbFood = new Datastore({
				filename: dbFileName, 
				autoload: true,
					autoload: true,
				autoload: true,
				autoload: true
		});


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
		"foodtype": "SugarAndFat",
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
		"country": "India",
		"year": 2005,
		"foodtype": "Produce",
		"caloryperperson": 141,
		"gramperperson": 338,
		"dailygram": 1122,
		"dailycalory": 2266
	},
	{
		"country": "India",
		"year": 2011,
		"foodtype": "Meat",
		"caloryperperson": 29,
		"gramperperson": 29,
		"dailygram": 1317,
		"dailycalory": 2458
	},
	{
		"country": "Argentina",
		"year": 2007,
		"foodtype": "SugarAndFat",
		"caloryperperson": 827,
		"gramperperson": 174,
		"dailygram": 2084,
		"dailycalory": 3137
	},
	{
		"country": "Spain",
		"year": 2009,
		"foodtype": "SugarAndFat",
		"caloryperperson": 1008,
		"gramperperson": 170,
		"dailygram": 2526,
		"dailycalory": 3221
	},
	{
		"country": "Germany",
		"year": 2011,
		"foodtype": "Grain",
		"caloryperperson": 827,
		"gramperperson": 305,
		"dailygram": 2649,
		"dailycalory": 3539
	},
	{
		"country": "Japan",
		"year": 2010,
		"foodtype": "DairyAndEggs",
		"caloryperperson": 222,
		"gramperperson": 255,
		"dailygram": 1591,
		"dailycalory": 2691
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

function hasNumbers(t)
{
	var regex = /\d/g;
	return regex.test(t);
}  


 module.exports.register = (app) => {
	 
	 app.get(BASE_API_PATH+"/:country/:year/:foodtype",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var foodtypeD = req.params.foodtype;
		dbFood.find({$and:[{ country: countryD}, {year: yearD }, {foodtype: foodtypeD}]}, (err, foodconsumption)=>{
			if (err){
				console.error("ERROR accessing 	DB in GET");
					res.sendStatus(500);
			}else{
				if(foodconsumption.length==0){
					res.sendStatus(404);	
				}else{
					foodconsumption.forEach((f)=>{
                		delete f._id
					});
					res.send(JSON.stringify(foodconsumption[0],null,2));
				}
			}
		});

    });


	//OBTIENE TODO EL ARRAY
    app.get(BASE_API_PATH, (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		var i = 0;
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
        if(req.query.country){
			 dbquery["country"]= req.query.country;
			i++;
		}
        if(req.query.year){
			dbquery["year"] = parseInt(req.query.year);
			i++
		} 
        if(req.query.foodtype){
			dbquery["foodtype"] = req.query.foodtype;
			i++
		} 
        if(req.query.caloryperpersonAbove){
			dbquery["caloryperperson"] = {$gte: parseInt(req.query.caloryperpersonAbove)};
			i++
		} 
		
        if(req.query.gramperpersonAbove){
			dbquery["gramperperson"] = {$gte:parseInt(req.query.gramperpersonAbove)};
			i++
		} 
		if(req.query.dailygramAbove){
			dbquery["dailygram"] = {$gte:parseInt(req.query.dailygramAbove)};
			i++
		} 
        if(req.query.dailycaloryAbove){
			 dbquery["dailycalory"] ={$gte: parseInt(req.query.dailycaloryAbove)};
			i++
		}
	

        dbFood.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((err, foodconsumption) =>{

            
			if(err){
				res.sendStatus(500);
			}else{
				if(foodconsumption.length==0){
					if(i==0){
						res.send(JSON.stringify(foodconsumption,null,2));
					}else{
						
						res.sendStatus(404);
					}
				}
				else{
					foodconsumption.forEach((f)=>{
                delete f._id
            		});
					if(foodconsumption.length==1){
						res.send(JSON.stringify(foodconsumption,null,2));
					}
					else{
						res.send(JSON.stringify(foodconsumption,null,2));
					}
					
				
					
				}
			}
           
        });

    });

	//LOAD INITIAL DATA
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
		dbFood.insert(food_consumptionInitialData);

        res.send("Datos cargados");
    });

	  
	
    //SUBE UN RECURSO
    app.post(BASE_API_PATH, (req,res)=>{
        var newfood_consumption =req.body;
       
        dbFood.find({$and: [{country: newfood_consumption.country}, {year: parseInt(newfood_consumption.year)}, {foodtype: newfood_consumption.foodtype}]}, (err, food_consumption)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500);
		}
		else{
			
			if(food_consumption.length==0){
			
				if((!newfood_consumption.country|!newfood_consumption.year|!newfood_consumption.foodtype|!newfood_consumption.caloryperperson|!newfood_consumption.gramperperson|!newfood_consumption.dailygram|!newfood_consumption.dailycalory) || Object.keys(newfood_consumption).length!=7 || hasNumbers(newfood_consumption.country) || hasNumbers(newfood_consumption.foodtype)){
					res.sendStatus(400);
					
					
				}else{
					console.log("Inserting new food_consumption in DB: "+ JSON.stringify(newfood_consumption, null,2));
					dbFood.insert(newfood_consumption);
					res.sendStatus(201); //CREATED
				}
				
			}
			
			else{
			
				res.sendStatus(409); //CONFLICT
			}
		}
	});

    });

    	 //BORRAR RECURSO
         app.delete(BASE_API_PATH+"/:country/:year/:foodtype", (req,res)=>{
            var countryD = req.params.country;
            var yearD = parseInt(req.params.year);
			 var foodtypeD = req.params.foodtype;
            dbFood.remove({$and:[{ country: countryD}, {year: yearD }, { foodtype: foodtypeD }]}, {}, (err, numFoodConsumptionRemoved)=>{
            if (err){
                console.error("ERROR deleting DB food_consumption in DELETE: "+err);
                res.sendStatus(500);
            }else{
                
                if(numFoodConsumptionRemoved==0){
                    res.sendStatus(404);
					
                }else{
                    res.sendStatus(200);
                }
            }
        });
            
        });
           //ACTUALIZA RECURSO
    app.put(BASE_API_PATH+"/:country/:year/:foodtype",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var foodtypeD = req.params.foodtype;
		var update = req.body;
		dbFood.find({$and:[{ country: countryD}, {year: yearD }, {foodtype: foodtypeD}]}, (err, foodconsumption)=>{
			if (err){
				console.error("ERROR accessing 	DB in GET");
					res.sendStatus(500);
			}
			else{
				if((req.body.country!=countryD|req.body.year!=yearD|req.body.foodtype!=foodtypeD)){
					res.sendStatus(409);
				}else if(!update.country|!update.year|!update.foodtype|!update.caloryperperson|!update.gramperperson|!update.dailygram|!update.dailycalory |Object.keys(update).length != 7){
					res.sendStatus(400);
				}else{
					dbFood.update({$and:[{ country: countryD}, {year: yearD }, {foodtype: foodtypeD}]}, {$set: update}, {},function(err, updateFood) {
						if (err) {
							console.error("ERROR updating DB food_consumption in PUT: "+err);
						}else{
						res.sendStatus(200);
					
						}
					});
				}
			}
		});
	});
		
      //ERROR AL POST EN UN RECURSO
      app.post(BASE_API_PATH+"/:country/:year/:foodtype", (req,res)=>{

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
			console.error("ERROR deleting DB food_consumption in DELETE: "+err);
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