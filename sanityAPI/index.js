var BASE_API_PATH = "/api/v1/sanity-stats";

var datastore = require("nedb");
const path = require("path");
const dbFileName = path.join(__dirname,"sanity.db");
const db = new datastore({
				filename: dbFileName, 
				autoload: true,
					autoload: true,
				autoload: true,
				autoload: true
		});

var sanityInitialData = [
	{
		"country": "China","year": 2011,
		"health_expenditure_in_percentage": 10.61685285,"doctor_per_1000_habitant": 1.5,"hospital_bed": 3705100
	},
	{
		"country": "United_States","year": 2007,
        "health_expenditure_in_percentage": 19.01326713,"doctor_per_1000_habitant": 2.41,"hospital_bed": 945199
	},
	{
		"country": "Spain","year": 2008,
        "health_expenditure_in_percentage": 15.73140496,"doctor_per_1000_habitant": 4.67,"hospital_bed": 146934
	},
	{
		"country": "Germany","year": 2010,
        "health_expenditure_in_percentage": 18.14760105,"doctor_per_1000_habitant": 3.775,"hospital_bed": 674473
	},
	{
		"country": "India","year": 2009,
        "health_expenditure_in_percentage": 4.36884071,"doctor_per_1000_habitant": 0.264,"hospital_bed": 540328
	}
    

];

 module.exports.register = (app) => {

    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        db.remove({},{multi:true});
        db.insert(sanityInitialData);
        
        res.send("Datos cargados");
        res.sendStatus(200);

    });

    
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
		if(req.query.health_expenditure_in_percentage) dbquery["health_expenditure_in_percentage"] = parseFloat(req.query.health_expenditure_in_percentage);
		if(req.query.doctor_per_1000_habitant) dbquery["doctor_per_1000_habitant"] = parseFloat(req.query.doctor_per_1000_habitant);
		if(req.query.hospital_bed) dbquery["hospital_bed"] = parseFloat(req.query.hospital_bed);	
		
		db.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error, sanity) =>{

			sanity.forEach((t)=>{
				delete t._id
			});

			res.send(JSON.stringify(sanity,null,2));
			//console.log("Data sent: " + JSON.stringify(tourism,null,2));
			console.log("Recursos mostrados");
		});
	});
     
     app.post(BASE_API_PATH, (req,res)=>{
         var newsanity =req.body;
         console.log(`Nuevo objeto en obesity: <${JSON.stringify(newsanity,null,2)}>`);
         db.find({country: newsanity.country, year: newsanity.year, health_expenditure_in_percentage: newsanity.health_expenditure_in_percentage, doctor_per_1000_habitant: newsanity.doctor_per_1000_habitant,hospital_bed: newsanity.hospital_bed}, (err, sanityInDB)=>{
         if(err){
             console.error("ERROR accessing DB in POST");
             res.sendStatus(500);
         }
         else{
             if(sanityInDB.length==0){
                 console.log("Inserting new contact in DB: "+ JSON.stringify(newsanity, null,2));
                 db.insert(newsanity);
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

		var country = req.params.country;
		var year = parseInt(req.params.year);

		db.find({country:country, year:year},(error, sanity)=>{
			if(sanity.length==0){
				console.log("ERROR 404. Recurso no encontrado");
				res.sendStatus(404);
			}else{
				console.log("DELETE de un recurso concreto");
                res.sendStatus(200);
                db.remove({country:country, year:year});
			}
		})
	});
     
     
     
    app.put(BASE_API_PATH+":country/:year", (req, res) =>{

		var country = req.params.country;
		var year = parseInt(req.params.year);
		var updateSanity = req.body;
		
		db.find({country:country, year: year},(error,sanity)=>{
			console.log(sanity);
			if(sanity.length == 0){
				console.log("Error 404, recurso no encontrado.");
				res.sendStatus(404);
			}else if(!updateSanity.country || !updateSanity.year ||!updateSanity.health_expenditure_in_percentage || !updateSanity.doctor_per_1000_habitant
		  			 || !updateSanity.hospital_bed || Object.keys(updateSanity).length != 5){
				
					console.log("PUT recurso encontrado. Se intenta actualizar con campos no validos 400");
					res.sendStatus(400);
			}else if(updateSanity.country != country || updateSanity.year != year){
					console.log("PUT recurso encontrado. Se intenta actualizar el identificador 409");
					res.sendStatus(409);
			}else{
				db.update({country:country, year: year},{$set: updateSanity});
				console.log("PUT realizado con exito.")
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
        db.remove({},{multi:true});
        console.log("Deleted Data");
        res.sendStatus(200);
    });



 };