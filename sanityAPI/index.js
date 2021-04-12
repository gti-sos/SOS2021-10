var BASE_API_PATH = "/api/v1/sanity-stats";


var sanity = [];
var sanityInitialData = [
	{
		"country": "China",
		"year": 2011,
		"health-expenditure-in-percentage": 10.61685285,
		"doctor-per-1000-habitant": 1.5,
		"hospital-bed": 3705100
	},
	{
		"country": "United States",
		"year": 2007,
		"health-expenditure-in-percentage": 19.01326713,
		"doctor-per-1000-habitant": 2.41,
		"hospital-bed": 945199
	}
];

 module.exports.register = (app) => {

    app.get(BASE_API_PATH, (req,res)=>{
        res.send(JSON.stringify(sanity,null,2));
    });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        for(var i=0; i<sanityInitialData.length; i++){
            sanity.push(sanityInitialData[i]);
        }
        
        res.send("Datos cargados");
    });
    
    app.get(BASE_API_PATH+"/:country", (req, res)=>{
        var filtrado = []
        for(var i=0; i<sanity.length; i++){
            if(sanity[i].country==req.params.country){
                filtrado.push(sanity[i]);
            }
        }
        res.send(JSON.stringify(filtrado,null,2));
        
    });
    
    app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
        for(var i=0; i<sanity.length; i++){
            if(sanity[i].country==req.params.country&&sanity[i].year==req.params.year){
                res.send(JSON.stringify(sanity[i],null,2));
                
            }
        }
        //res.sendStatus(200);
    });
    
    app.post(BASE_API_PATH, (req,res)=>{
        var newsanity =req.body;
        console.log(`Nuevo objeto en sanity: <${JSON.stringify(newsanity,null,2)}>`);
        sanity.push(newsanity);
        
        res.sendStatus(201);
    });
    
    app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
        for(var i=0; i<sanity.length; i++){
            if(sanity[i].country==req.params.country&&sanity[i].year==req.params.year){
                sanity.splice(i, 1);
                console.log(sanity);
            }
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
        for(var i=0; i<sanity.length; i++){
            if(sanity[i].country==req.params.country&&sanity[i].year==req.params.year){
                sanity[i]=req.body;
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
        while(sanity.length>0){
            sanity.pop();
            
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });



 };