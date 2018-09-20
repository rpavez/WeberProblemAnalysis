# Weber problem data analysis based on Google Directions API for driving times

https://en.wikipedia.org/wiki/Weber_problem
https://developers.google.com/maps/documentation/directions/start

## Instructions
- Clone the repo
- `yarn` (if you dont have yarn npm install -g yarn)
- `cp .env.test  .env` and add you Google API Key (Remember enable Google Directions API)
- `cp dataset.test.json dataset.json` (Include your own data set here, current data is completely random)
- `yarn dev` (will limit to two boxes and two destinations not to overuse API)

## Real usage
- `yarn start`

## TODO:
  - Implement atraction-repulsion calculation
  - Rank best locations
  - Load dataSet from external DB
  - Convert into a microservice
  - Parallelize requests
  - Use departure time information
  - Include parking as a variable
