const geohash = require('ngeohash');
const fetch = require("node-fetch");
const Decimal = require('decimal.js');
require('dotenv').config()

// Icracked key, be careful
const YOUR_API_KEY = process.env.GOOGLE_API_KEY;

/* Start of variables */

const precision = 5;

const left = {
    lat: 39.29817,
    lng: -84.72393
}
const right = {
    lat: 39.08944,
    lng: -84.35283
}

/* End of variables */

if(!YOUR_API_KEY)
{
    console.error("Wont work without an API KEY");
    process.exit(1)
}

try{
    require('./dataset')
}
catch(e){
    console.error("Make sure add dataset.json use https://shancarter.github.io/mr-data-converter/");
    process.exit(1)  
}

//https://developers.google.com/maps/documentation/directions/intro
const getDrivingTimeEstimate = async (origin, destination, departure_time = "now") => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&departure_time=${departure_time}&key=${YOUR_API_KEY}`;
    const getLocation = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            const minutes = json.routes[0].legs.map(leg => leg.duration.value) / 60;
            // console.log(`${minutes} minutes`);
            return minutes;
        } catch (error) {
            console.log(error);
        }
    };
    return getLocation(url);
}

const main = async () => {

    const a = getDrivingTimeEstimate(left, right)

    const boxGeoRange = left.lat - right.lat;
    const adjustedRight = {
        lat: left.lat + boxGeoRange,
        lng: left.lng + boxGeoRange,
    }

    const boxes = geohash.bboxes(
        left.lat,
        left.lng,
        adjustedRight.lat,
        adjustedRight.lng,
        precision)

    console.log("Number of boxes on virtual grid (precision)",boxes.length);

    const dataSet = require('./dataset').map(b=>{
        return { "lat": b.Lat, "lng": b.Long }
    })

    // Hack for async await on Map
    const asyncMap = async (array, callback) => {
        const arr = [];
        for (let index = 0; index < array.length; index++) {
          arr.push(await callback(array[index], index, array));
        }
        return arr;
      }

    const devArrLimits = 2;
    process.env.dev && console.warn("Running on dev, will only use first two elements of arrays for analysis to avoid API overuse on development, for production use use yarn start")
    const reduceCombinationsForDev = arr => {
        if(process.env.dev) return arr.splice(-devArrLimits)
        return arr;
    }

    const computedBoxes = await asyncMap(reduceCombinationsForDev(boxes), async (box) => {
        var b = geohash.decode(box)
        const coords  = { "lat": b.latitude, "lng": b.longitude }
        // Remove .slice(-2) for real usage, -2 is the number of items in array to use
        const times = await asyncMap(reduceCombinationsForDev(dataSet), async (customerLocation) => {
            return getDrivingTimeEstimate(coords,customerLocation)
        })
        const average = times.reduce((a, b) => a + b, 0)/times.length;
        console.log(`\nDriving times between box ${box} and destionation`);
        console.log('average',average,'minutes');
        return {
            boxId: box,
            coordinates: coords,
            drivingTimes: times,
            average
        }
    })

    require('fs').writeFileSync('report.json',JSON.stringify(computedBoxes),'utf8');
    console.log("\n\nProcess finished, check report.json");
}

main()