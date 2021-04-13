var BASE_API_PATH = "/api/v1/obesity-stats";


var obesity = [];
var obesityInitialData = [
	{	
		"country": "China",
		"year": 2011,
		"man-percent": 4.2,
		"woman-percent": 5.2,
		"total-population": 1376498048
	},
	{	
		"country": "United States",
		"year": 2007,
		"man-percent": 29.1,
		"woman-percent": 31.5,
		"total-population": 300608000
	}
];

 module.exports.register = (app) => {

    app.get(BASE_API_PATH, (req,res)=>{
        res.send(JSON.stringify(obesity,null,2));
    });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        for(var i=0; i<obesityInitialData.length; i++){
            obesity.push(obesityInitialData[i]);
        }
        
        res.send("Datos cargados");
    });
    
    app.get(BASE_API_PATH+"/:country", (req, res)=>{
		var filtrado =[]
        for(var i=0; i<obesity.length; i++){
            if(obesity[i].country==req.params.country){
                filtrado.push(obesity[i]);
            }

        }
		if(filtrado.length>0){
		res.send(JSON.stringify(filtrado, null,2));
		}

		else{
            console.log("Not Found");
              res.sendStatus(404);
        }

    });
	 
    
   app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
	   var filtrado =[]
        for(var i=0; i<obesity.length; i++){
            if(obesity[i].country==req.params.country&&obesity[i].year==req.params.year){
                filtrado.push(obesity[i]);
            }
        }
        if(filtrado.length>0){
		res.send(JSON.stringify(filtrado, null,2));
		}

		else{
            console.log("Not Found");
              res.sendStatus(404);
        }
    });
    
    app.post(BASE_API_PATH, (req,res)=>{
        var newobesity =req.body;
        console.log(`Nuevo objeto en obesity: <${JSON.stringify(newobesity,null,2)}>`);
        obesity.push(newobesity);
        
        res.sendStatus(201);
    });
    
    app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
        for(var i=0; i<obesity.length; i++){
            if(obesity[i].country==req.params.country&&obesity[i].year==req.params.year){
                obesity.splice(i, 1);
                console.log(obesity);
            }
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
        for(var i=0; i<obesity.length; i++){
            if(obesity[i].country==req.params.country&&obesity[i].year==req.params.year){
                obesity[i]=req.body;
            }
        }
        console.log("Updated Data");
        res.sendStatus(200);
    });
    
    app.post(BASE_API_PATH+"/:country/:year", (req,res)=>{
    
        res.sendStatus(405);
    });
    
    app.put(BASE_API_PATH, (req,res)=>{
    
        res.sendStatus(405);
    });
    app.delete(BASE_API_PATH, (req,res)=>{
        while(obesity.length>0){
            obesity.pop();
            
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });



 };