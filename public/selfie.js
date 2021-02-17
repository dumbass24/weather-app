
let lat, lon, weather, air;

if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async (position) => {

        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById("latitude").textContent = lat.toFixed(2);
            document.getElementById("longitude").textContent = lon.toFixed(2);

            //console.log(lat, lon);

            const api_url = `/weather/${lat},${lon}`;

            const data_response = await fetch(api_url);
            const datainfo = await data_response.json();
            console.log(datainfo);

            weather = datainfo.weather;
            air = datainfo.air_quality;


            document.getElementById("temp").textContent = weather.main.temp;
            document.getElementById("dis").textContent = weather.weather[0].description;
            document.getElementById("place").textContent = weather.name;

            document.getElementById("index").textContent = air.list[0].main.aqi;
            document.getElementById("pm").textContent = air.list[0].components.pm2_5;
            document.getElementById("pm10").textContent = air.list[0].components.pm10;

        }
        catch (error) {
            air = { value: -1 };
            console.log(error);
            document.getElementById("index").textContent = 'no reading for air quality';


        }

        const data = { lat, lon, weather, air };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        const db_response = await fetch("/test", options);
        const db_json = await db_response.json();
        console.log(db_json);

    });
} else {
    console.log("geolocation not available");
}









