require("dotenv").config();

var request = require("request");
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

var OWM_API_KEY = process.env.OWM_API_KEY;
var MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;


// USING MAPBOX API.
function geocode(address, callback) {
    var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_API_KEY}&limit=1`;
    request({ url: url, json: true }, function(error, response, body) {
        if (error) {
            callback("Failed to connect to the server!");
        } else if (body.features.length === 0) {
            callback("Unable to find location! Try another location.");
        } else {
            var longitude = body.features[0].center[0];
            var latitude = body.features[0].center[1];
            var location = body.features[0].place_name;
            var info = { longitude, latitude, location };
            callback(undefined, info);
        }
    })
}


// USING OPEN WEATHER MAP API. 
function forecast(longitude, latitude, callback) {
    var url = `https://api.openweathermap.org/data/2.5/weather?lon=${longitude}&lat=${latitude}&appid=${OWM_API_KEY}&units=metric`;
    request({ url: url, json: true }, function(error, response, body) {
        if (error) {
            callback("Failed to connect to the server!", undefined);
        } else if (body.message) {
            callback("Unable to find location. Try another location.", undefined);
        } else {
            var weather = {
                des: body.weather[0].description,
                temp: body.main.temp,
                tempMin: body.main.temp_min,
                tempMax: body.main.temp_max,
                pressure: body.main.pressure,
                humidity: body.main.humidity,
                windSpeed: body.wind.speed,
                icon: body.weather[0].icon
            }
            callback(undefined, weather)
        }
    })
}



// ROUTES.
app.get("/", function(req, res) {
    res.sendFile("index.html");
});


app.get("/api/weather", function(req, res) {
    if (!req.query.address) {
        return res.send({ error: "Please provide a location." })
    }
    geocode(req.query.address, function(err, data) {
        if (err) {
            res.json({
                error: err
            })
        } else {
            var lon = data.longitude;
            var lat = data.latitude;
            var location = data.location;
            forecast(lon, lat, function(err, forecastData) {
                if (err) {
                    res.json({
                        error: err
                    })
                } else {
                    forecastData.location = location;
                    res.json(forecastData);
                }
            })
        }
    })
})


app.listen(port, function() {
    console.log(`STARTING SERVER AT PORT ${port}...!`)
})