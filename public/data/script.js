const mymap = L.map("checkinMap").setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors';

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);


getData();

async function getData() {
    const response = await fetch("/test");
    const data = await response.json();

    for (item of data) {

        const marker = L.marker([item.lat, item.lon]).addTo(mymap);

        let txt = `the weather here at ${item.lat}&deg; ,
        ${item.lon}&deg; is mostly ${item.weather.weather[0].description} with
        the temperature ${item.weather.main.temp}&deg; F.<br />
        name of the place is ${item.weather.name}. <br />
        <br />`;

        if (item.air.value < 0) {
            txt += 'no Reading for air quality.';
        } else {
            txt += `the air quality index is ${item.air.list[0].main.aqi}<br />
            particulate matter(PM2.5) is ${item.air.list[0].components.pm2_5} μg/m3 <br />coarse
            particulate matter (PM10) is ${item.air.list[0].components.pm10} μg/m3`;
        }
        marker.bindPopup(txt);

    }

    console.log(data);
}
