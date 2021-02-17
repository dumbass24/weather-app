const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`starting at server ${port}`));
app.use(express.static("public"));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/test', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});


app.post('/test', (req, res) => {
    console.log("test running...")
    //console.log(req.body);
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);

});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(latlon);

    const api_key = process.env.API_KEY;
    const weather_api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const weater_res = await fetch(weather_api);
    const weather_data = await weater_res.json();
    console.log(weather_data.weather[0].description);

    // const aq_api = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_api = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const aq_res = await fetch(aq_api);
    const aq_data = await aq_res.json();
    console.log(aq_data);
    const data = {
        weather: weather_data,
        air_quality: aq_data
    }

    response.json(data);
    console.log(data);


});