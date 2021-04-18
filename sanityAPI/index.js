var BASE_API_PATH = "/api/v1/sanity-stats";
var Datastore = require("nedb");
var db=new Datastore();
const url= require('url');

var sanity = [];
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

    /*app.get(BASE_API_PATH, (req,res)=>{
	
		db.find({}, (err,sanityInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);//???
		}else{
			var sanityToSend = sanityInDB.map((d)=>{
			return {country: d.country, year: d.year, health_expenditure_in_percentage: d.health_expenditure_in_percentage, doctor_per_1000_habitant: d.doctor_per_1000_habitant, hospital_bed: d.hospital_bed};
			});
			res.send(JSON.stringify(sanityToSend,null,2));
		}});
		
	});*/
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        
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
         var countryD = req.params.country;
         var yearD =  parseInt(req.params.year);
         db.remove({ $and: [{ country: countryD}, {year: yearD }] }, {}, (err, numSanityRemoved)=>{
         if (err){
             console.error("ERROR deleting DB contacts in DELETE: "+err);
             res.sendStatus(500);
         }else{
             console.log(yearD);
             console.log(countryD);
             if(numSanityRemoved==0){
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
         db.update({country: countryD, year: yearD}, {$set: {country: update.country, year: update.year, health_expenditure_in_percentage: update.health_expenditure_in_percentage, doctor_per_1000_habitant: update.doctor_per_1000_habitant,hospital_bed: update.hospital_bed}}, {},(err, updateSanity) => {
                 if (err) {
                     console.error("ERROR deleting DB contacts in PUT: "+err);
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
        while(sanity.length>0){
            db.pop();
            
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });



 };