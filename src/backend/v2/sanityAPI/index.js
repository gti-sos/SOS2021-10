var BASE_API_PATH = "/api/v2/sanity-stats";

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
		"country": "China","year": 2007,
		"health_expenditure_in_percentage": 11.06281576,"doctor_per_1000_habitant": null,"hospital_bed": 2675100
	},
	{
		"country": "China","year": 2008,
		"health_expenditure_in_percentage": 10.13371551,"doctor_per_1000_habitant": null,"hospital_bed": 882900
	},
	{
		"country": "China","year": 2009,
		"health_expenditure_in_percentage": 10.31396151,"doctor_per_1000_habitant": 1.421,"hospital_bed": 3120800
	},
	{
		"country": "China","year": 2010,
		"health_expenditure_in_percentage": 10.23713459,"doctor_per_1000_habitant": 1.462,"hospital_bed": 3387400
	},
	{
		"country": "China","year": 2011,
		"health_expenditure_in_percentage": 10.61685285,"doctor_per_1000_habitant": 1.5,"hospital_bed": 3705100
	},
	{
		"country": "United_States","year": 2007,
        "health_expenditure_in_percentage": 19.01326713,"doctor_per_1000_habitant": 2.41,"hospital_bed": 945199
	},
	{
		"country": "United_States","year": 2008,
        "health_expenditure_in_percentage": 18.91568919,"doctor_per_1000_habitant": 2.416,"hospital_bed": 951045
	},
	{
		"country": "United_States","year": 2009,
        "health_expenditure_in_percentage": 18.6797477,"doctor_per_1000_habitant": 2.422,"hospital_bed": 944277
	},
	{
		"country": "United_States","year": 2010,
        "health_expenditure_in_percentage": 18.97000904,"doctor_per_1000_habitant": 2.429,"hospital_bed": 941995
	},
	{
		"country": "United_States","year": 2011,
        "health_expenditure_in_percentage": 19.4623674,"doctor_per_1000_habitant": 2.458,"hospital_bed": 924333
	},
	{
		"country": "Spain","year": 2007,
        "health_expenditure_in_percentage": 15.57613924,"doctor_per_1000_habitant": 4.603,"hospital_bed": 146840
	},
	{
		"country": "Spain","year": 2008,
        "health_expenditure_in_percentage": 15.73140496,"doctor_per_1000_habitant": 4.67,"hospital_bed": 146934
	},
	{
		"country": "Spain","year": 2009,
        "health_expenditure_in_percentage": 15.60644541,"doctor_per_1000_habitant": 4.731,"hospital_bed": 146934
	},
	{
		"country": "Spain","year": 2010,
        "health_expenditure_in_percentage": 15.49018176,"doctor_per_1000_habitant": 3.756,"hospital_bed": 145207
	},
	{
		"country": "Spain","year": 2011,
        "health_expenditure_in_percentage": 15.3092174,"doctor_per_1000_habitant": 3.838,"hospital_bed": 142640
	},
	{
		"country": "Germany","year": 2007,
        "health_expenditure_in_percentage": 18.05930495,"doctor_per_1000_habitant": 3.483,"hospital_bed": 677799
	},
	{
		"country": "Germany","year": 2008,
        "health_expenditure_in_percentage": 18.13454838,"doctor_per_1000_habitant": 3.531,"hospital_bed": 674420
	},
	{
		"country": "Germany","year": 2009,
        "health_expenditure_in_percentage": 18.30717945,"doctor_per_1000_habitant": null,"hospital_bed": 674830
	},
	{
		"country": "Germany","year": 2010,
        "health_expenditure_in_percentage": 18.14760105,"doctor_per_1000_habitant": 3.775,"hospital_bed": 674473
	},
	{
		"country": "Germany","year": 2011,
        "health_expenditure_in_percentage": 18.5811272,"doctor_per_1000_habitant": 3.87,"hospital_bed": 672573
	},
	{
		"country": "India","year": 2007,
        "health_expenditure_in_percentage": 4.42518742,"doctor_per_1000_habitant": 0.6,"hospital_bed": 482522
	},
	{
		"country": "India","year": 2008,
        "health_expenditure_in_percentage": 4.34361163,"doctor_per_1000_habitant": 0.615,"hospital_bed": 494510
	},
	{
		"country": "India","year": 2009,
        "health_expenditure_in_percentage": 4.36884071,"doctor_per_1000_habitant": 0.624,"hospital_bed": 540328
	},
	{
		"country": "India","year": 2010,
        "health_expenditure_in_percentage": 4.2912175,"doctor_per_1000_habitant": 0.663,"hospital_bed": 576793
	},
	{
		"country": "India","year": 2011,
        "health_expenditure_in_percentage": 4.42150035,"doctor_per_1000_habitant": 0.739,"hospital_bed": 784940
	}
    

];

 module.exports.register = (app) => {

    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
		for(var i=0;i<sanityInitialData.length;i++){
			db.remove({"country":sanityInitialData[i].country},{multi:true});
		}
        db.insert(sanityInitialData);
        
        console.log("Datos cargados");
        res.sendStatus(200);

    });

    
    app.get(BASE_API_PATH, (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
        var i=0;
		
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
		if(req.query.country){ dbquery["country"]= req.query.country;i++}
		if(req.query.year){ dbquery["year"] = parseInt(req.query.year);i++}
		if(req.query.health_expenditure_in_percentage){ dbquery["health_expenditure_in_percentage"] = parseFloat(req.query.health_expenditure_in_percentage);i++}
		if(req.query.doctor_per_1000_habitant){ dbquery["doctor_per_1000_habitant"] = parseFloat(req.query.doctor_per_1000_habitant);i++}
		if(req.query.hospital_bed){ dbquery["hospital_bed"] = parseFloat(req.query.hospital_bed);i++}
		if(req.query.bedAbove){ dbquery["hospital_bed"] = {$gte: parseFloat(req.query.bedAbove)};i++}
		if(req.query.doctorAbove){ dbquery["doctor_per_1000_habitant"] = {$gte: parseFloat(req.query.doctorAbove)};i++}
		if(req.query.healthAbove){ dbquery["health_expenditure_in_percentage"] = {$gte: parseFloat(req.query.healthAbove)};i++}
		
		if(req.query.from && req.query.to){ dbquery["year"] = $and[ {$gte: parseInt(req.query.from)}, {$lte: parseInt(req.query.to)} ];i++}
		else{
			if(req.query.from){ dbquery["year"] = {$gte: parseInt(req.query.from)};i++}
			if(req.query.to){ dbquery["year"] = {$lte: parseInt(req.query.to)};i++}
		}
		
		db.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error, sanity) =>{

			sanity.forEach((t)=>{
				delete t._id
			});

			
			if(error){
				res.sendStatus(500);
			}else{
				if(sanity.length==0){
					if(i==0){
						res.send(JSON.stringify(sanity,null,2));
					}else{
						console.log();
						res.sendStatus(404);
					}
				}
				else{
					res.send(JSON.stringify(sanity,null,2));
                }		
			}
			
			console.log("Recursos mostrados");
		});
	});
     


	app.get(BASE_API_PATH+"/statistics", (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
        var i=0;
		
		//PAGINACIÓN
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.country=="") {
            delete req.query.limit;
        }
		if (req.query.fromyear==0) {
            delete req.query.fromyear;
        }if (req.query.toyear==0) {
            delete req.query.toyear;
        }
		if (req.query.fromhealth==0) {
            delete req.query.fromhealth;
        }if (req.query.tohealth==0) {
            delete req.query.tohealth;
        }
		if (req.query.fromdoctor==0) {
            delete req.query.fromdoctor;
        }if (req.query.todoctor==0) {
            delete req.query.todoctor;
        }
		if (req.query.frombed==0) {
            delete req.query.frombed;
        }if (req.query.tobed==0) {
            delete req.query.tobed;
        }
		//BUSQUEDA
		console.log(req.query);
		if(req.query.country){ dbquery["country"]= req.query.country;i++}

		if(req.query.fromyear && req.query.toyear){ dbquery["year"]= {$gte: parseInt(req.query.fromyear), $lte: parseInt(req.query.toyear)};i++}
		else if(req.query.fromyear){ dbquery["year"]= {$gte: parseInt(req.query.fromyear)};i++}
		else if(req.query.toyear){ dbquery["year"] = {$lte: parseInt(req.query.toyear)};i++}
		
		if(req.query.fromhealth && req.query.tohealth){ dbquery["health_expenditure_in_percentage"]= {$gte: parseInt(req.query.fromhealth), $lte: parseInt(req.query.tohealth)};i++}
		else if(req.query.fromhealth){ dbquery["health_expenditure_in_percentage"]= {$gte: parseInt(req.query.fromhealth)};i++}
		else if(req.query.tohealth){ dbquery["health_expenditure_in_percentage"] = {$lte: parseInt(req.query.tohealth)};i++}
		
		if(req.query.fromdoctor && req.query.todoctor){ dbquery["doctor_per_1000_habitant"]= {$gte: parseInt(req.query.fromdoctor), $lte: parseInt(req.query.todoctor)};i++}
		else if(req.query.fromdoctor){ dbquery["doctor_per_1000_habitant"]= {$gte: parseInt(req.query.fromdoctor)};i++}
		else if(req.query.todoctor){ dbquery["doctor_per_1000_habitant"] = {$lte: parseInt(req.query.todoctor)};i++}
		
		if(req.query.frombed && req.query.tobed){ dbquery["hospital_bed"]= {$gte: parseInt(req.query.frombed), $lte: parseInt(req.query.tobed)};i++}
		else if(req.query.frombed){ dbquery["hospital_bed"]= {$gte: parseInt(req.query.frombed)};i++}
		else if(req.query.tobed){ dbquery["hospital_bed"] = {$lte: parseInt(req.query.tobed)};i++}
		db.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error, sanity) =>{

			sanity.forEach((t)=>{
				delete t._id
			});

			if(error){
				res.sendStatus(500);
			}else{
				if(sanity.length==0){
					if(i==0){
						res.send(JSON.stringify(sanity,null,2));
					}else{
						console.log();
						res.sendStatus(404);
					}
				}
				else{
					res.send(JSON.stringify(sanity,null,2));
                }		
			}
			
			console.log("Recursos mostrados");
		});
	});



     app.post(BASE_API_PATH, (req,res)=>{
        var newsanity ={
			"country" :req.body.country,
			"year": parseInt(req.body.year),
			"health_expenditure_in_percentage" : parseFloat(req.body.health_expenditure_in_percentage),
			"doctor_per_1000_habitant" : parseFloat(req.body.doctor_per_1000_habitant),
			"hospital_bed" : parseFloat(req.body.hospital_bed)
		}
         console.log(`Nuevo objeto en sanity: <${JSON.stringify(newsanity,null,2)}>`);
         db.find({country: newsanity.country, year: newsanity.year}, (err, sanityInDB)=>{
            if(sanityInDB.length != 0){	
				console.log("409. El objeto ya existe");
				res.sendStatus(409);
			}else if(!newsanity.country || !newsanity.year || !newsanity.health_expenditure_in_percentage || !newsanity.doctor_per_1000_habitant 
					  || !newsanity.hospital_bed || Object.keys(newsanity).length != 5){
				
				console.log("El número de campos no es 5");
				res.sendStatus(400);
			}else{
				console.log("Los datos que se desean insertar son correctos");
				db.insert(newsanity);
				res.sendStatus(201);
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
     
     
     
    app.put(BASE_API_PATH+"/:country/:year", (req, res) =>{

		var countryD = req.params.country;
		var yearD = parseInt(req.params.year);
		var updateSanity = {
			"country" :req.body.country,
			"year": parseInt(req.body.year),
			"health_expenditure_in_percentage" : parseFloat(req.body.health_expenditure_in_percentage),
			"doctor_per_1000_habitant" : parseFloat(req.body.doctor_per_1000_habitant),
			"hospital_bed" : parseFloat(req.body.hospital_bed)
		};
		
		db.find({country:countryD, year: yearD},(error,sanity)=>{
			console.log(sanity);
			if(sanity.length == 0){
				console.log("Error 404, recurso no encontrado.");
				res.sendStatus(404);
			}else if(!updateSanity.country || !updateSanity.year || !updateSanity.health_expenditure_in_percentage || !updateSanity.doctor_per_1000_habitant
		  			 || !updateSanity.hospital_bed || Object.keys(req.body).length != 5){
				
					console.log("PUT recurso encontrado. Se intenta actualizar con campos no validos 400");
					res.sendStatus(400);
			}else if(updateSanity.country != countryD || updateSanity.year != yearD){
					console.log("PUT recurso encontrado. Se intenta actualizar el identificador 409");
					res.sendStatus(409);
			}else{
				db.update({country:countryD, year: yearD},{$set: updateSanity});
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
        db.remove({}, {multi:true}, (err, sanity)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
			res.sendStatus(500);
		}else{
			if(sanity==0){
				console.error("ERROR sanity-stats not found");
				res.sendStatus(404);
			}else{
				res.status(200).send("Successfully removed");
			}
		}
			
	});
    });



 };