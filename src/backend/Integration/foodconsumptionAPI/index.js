
var BASE_API_PATH = "/api/integration/foodconsumption-stats";

var path = require("path");

var Datastore = require("nedb");

const dbFileName = path.join(__dirname,"foodconsumption.db");

var cors = require("cors");


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
		"caloryperperson": 338,
		"gramperperson": 60,
		"dailygram": 2368,
		"dailycalory": 3073
	},
	{
		"country": "China",
		"year": 2010,
		"caloryperperson": 340,
		"gramperperson": 60,
		"dailygram": 2320,
		"dailycalory": 3041
	},
	{
		"country": "China",
		"year": 2009,
		"caloryperperson": 335,
		"gramperperson": 59,
		"dailygram": 2248,
		"dailycalory": 2992
	},
	{
		"country": "China",
		"year": 2008,
		"caloryperperson": 319,
		"gramperperson": 57,
		"dailygram": 2218,
		"dailycalory": 2974
	},
	{
		"country": "China",
		"year": 2007,
		"caloryperperson": 324,
		"gramperperson": 57,
		"dailygram": 2132,
		"dailycalory": 2917
	},
	{
		"country": "Spain",
		"year": 2011,
		"caloryperperson": 1087,
		"gramperperson": 178,
		"dailygram": 2399,
		"dailycalory": 3187
	},
	{
		"country": "Spain",
		"year": 2010,
		"caloryperperson": 1025,
		"gramperperson": 170,
		"dailygram": 2491,
		"dailycalory": 3189
	},
	{
		"country": "Spain",
		"year": 2009,
		"caloryperperson": 1008,
		"gramperperson": 170,
		"dailygram": 2526,
		"dailycalory": 3221
	},
	{
		"country": "Spain",
		"year": 2008,
		"caloryperperson": 955,
		"gramperperson": 162,
		"dailygram": 2559,
		"dailycalory": 3192
	},
	{
		"country": "Spain",
		"year": 2007,
		"caloryperperson": 931,
		"gramperperson": 160,
		"dailygram": 2609,
		"dailycalory": 3254
	},
	{
		"country": "Germany",
		"year": 2011,
		"caloryperperson": 916,
		"gramperperson": 189,
		"dailygram": 2649,
		"dailycalory": 3539
	},
	{
		"country": "Germany",
		"year": 2010,
		"caloryperperson": 942,
		"gramperperson": 195,
		"dailygram": 2594,
		"dailycalory": 3501
	},
	{
		"country": "Germany",
		"year": 2009,
		"caloryperperson": 936,
		"gramperperson": 191,
		"dailygram": 2656,
		"dailycalory": 3513
	},
	{
		"country": "Germany",
		"year": 2008,
		"caloryperperson": 936,
		"gramperperson": 196,
		"dailygram": 2617,
		"dailycalory": 3510
	},
	{
		"country": "Germany",
		"year": 2007,
		"caloryperperson": 920,
		"gramperperson": 186,
		"dailygram": 2648,
		"dailycalory": 3524
	},
		{
		"country": "India",
		"year": 2011,
		"caloryperperson": 471,
		"gramperperson": 129,
		"dailygram": 1317,
		"dailycalory": 2458
	},
	{
		"country": "India",
		"year": 2010,
		"caloryperperson": 480,
		"gramperperson": 156,
		"dailygram": 1326,
		"dailycalory": 2449
	},
	{
		"country": "India",
		"year": 2009,
		"caloryperperson": 490,
		"gramperperson": 128,
		"dailygram": 1250,
		"dailycalory": 2409
	},
		{
		"country": "India",
		"year": 2008,
		"caloryperperson": 468,
		"gramperperson": 130,
		"dailygram": 1263,
		"dailycalory": 2419
	},
		{
		"country": "India",
		"year": 2007,
		"caloryperperson": 464,
		"gramperperson": 133,
		"dailygram": 1233,
		"dailycalory": 2392
	},
	{
		"country": "United_States",
		"year": 2011,
		"caloryperperson": 1342,
		"gramperperson": 266,
		"dailygram": 2729,
		"dailycalory": 3641
	},
	{
		"country": "United_States",
		"year": 2010,
		"caloryperperson": 1299,
		"gramperperson": 260,
		"dailygram": 2755,
		"dailycalory": 3657
	},
	{
		"country": "United_States",
		"year": 2009,
		"caloryperperson": 1305,
		"gramperperson": 260,
		"dailygram": 2795,
		"dailycalory": 3653
	},
	{
		"country": "United_States",
		"year": 2008,
		"caloryperperson": 1326,
		"gramperperson": 264,
		"dailygram": 2812,
		"dailycalory": 3707
	},
	{
		"country": "United_States",
		"year": 2007,
		"caloryperperson": 1340,
		"gramperperson": 266,
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
	 app.use(cors());

	 
	 app.get(BASE_API_PATH+"/:country/:year",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		dbFood.find({$and:[{ country: countryD}, {year: yearD }]}, (err, foodconsumption)=>{
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
       
        dbFood.find({$and: [{country: newfood_consumption.country}, {year: parseInt(newfood_consumption.year)}]}, (err, food_consumption)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500);
		}
		else{
			
			if(food_consumption.length==0){
			
				if((!newfood_consumption.country|!newfood_consumption.year|!newfood_consumption.caloryperperson|!newfood_consumption.gramperperson|!newfood_consumption.dailygram|!newfood_consumption.dailycalory) || Object.keys(newfood_consumption).length!=6 || hasNumbers(newfood_consumption.country)){
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
         app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
            var countryD = req.params.country;
            var yearD = parseInt(req.params.year);
            dbFood.remove({$and:[{ country: countryD}, {year: yearD }]}, {}, (err, numFoodConsumptionRemoved)=>{
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
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var update = req.body;
		dbFood.find({$and:[{ country: countryD}, {year: yearD }]}, (err, foodconsumption)=>{
			if (err){
				console.error("ERROR accessing 	DB in GET");
					res.sendStatus(500);
			}
			else{
				if((req.body.country!=countryD|req.body.year!=yearD)){
					res.sendStatus(409);
				}else if(!update.country|!update.year|!update.caloryperperson|!update.gramperperson|!update.dailygram|!update.dailycalory |Object.keys(update).length != 6){
					res.sendStatus(400);
				}else{
					dbFood.update({$and:[{ country: countryD}, {year: yearD }]}, {$set: update}, {},function(err, updateFood) {
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