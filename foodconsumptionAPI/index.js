var BASE_API_PATH = "/api/v1/foodconsumptionstats";


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
        res.send(JSON.stringify(food_consumption,null,2));
    });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        for(var i=0; i<food_consumptionInitialData.length; i++){
            food_consumption.push(food_consumptionInitialData[i]);
        }
        
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
    
    app.get(BASE_API_PATH+"/:country/:year", (req, res)=>{
        for(var i=0; i<food_consumption.length; i++){
            if(food_consumption[i].country==req.params.country&&food_consumption[i].year==req.params.year){
                res.send(JSON.stringify(food_consumption[i],null,2));
                
            }
        }
        //res.sendStatus(200);
    });
    
    app.post(BASE_API_PATH, (req,res)=>{
        var newfood_consumption =req.body;
        console.log(`Nuevo objeto en food_consumption: <${JSON.stringify(newfood_consumption,null,2)}>`);
        food_consumption.push(newfood_consumption);
        
        res.sendStatus(201);
    });
    
    app.delete(BASE_API_PATH+"/:country/:year", (req,res)=>{
        for(var i=0; i<food_consumption.length; i++){
            if(food_consumption[i].country==req.params.country&&food_consumption[i].year==req.params.year){
                food_consumption.splice(i, 1);
                console.log(food_consumption);
            }
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });
    
    
    
    app.put(BASE_API_PATH+"/:country/:year",(req,res)=>{
        for(var i=0; i<food_consumption.length; i++){
            if(food_consumption[i].country==req.params.country&&food_consumption[i].year==req.params.year){
                food_consumption[i]=req.body;
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
        while(food_consumption.length>0){
            food_consumption.pop();
            
        }
        console.log("Deleted Data");
        res.sendStatus(200);
    });



 };