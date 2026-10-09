require("dotenv").config();
const connectDB = require("../config/db");
const Bus = require("../models/Bus");
(async()=>{
 await connectDB();
 if(await Bus.countDocuments()) { console.log("Buses already exist"); process.exit(0); }
 await Bus.insertMany([
  {name:"Purple Express",operator:"BusNova Partner",from:"Chennai",to:"Bangalore",departure:"21:30",arrival:"06:00",duration:"8h 30m",price:899,offerPercent:8,type:"AC",seatType:"Sleeper",totalSeats:40,amenities:["WiFi","Charging","Blanket","Water"],imageUrl:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"},
  {name:"Violet Rider",operator:"Southern Travels",from:"Chennai",to:"Coimbatore",departure:"22:15",arrival:"05:30",duration:"7h 15m",price:749,offerPercent:5,type:"AC",seatType:"Seater/Sleeper",totalSeats:40,amenities:["Charging","Water","TV"],imageUrl:"https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=1200&q=80"},
  {name:"City Link",operator:"TN Roadways Partner",from:"Madurai",to:"Chennai",departure:"20:00",arrival:"05:30",duration:"9h 30m",price:599,offerPercent:0,type:"Non-AC",seatType:"Seater",totalSeats:40,amenities:["Charging"],imageUrl:"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80"}
 ]);
 console.log("Demo buses seeded");process.exit(0);
})();
