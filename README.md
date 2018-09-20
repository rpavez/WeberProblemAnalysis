# Weber problem data analysis based on Google Directions API for driving times

https://en.wikipedia.org/wiki/Weber_problem

## Instructions
- Clone the repo
- yarn (if you dont have yarn npm install -g yarn)
- cp .env.test  .env and add you Google API Key (Remember enable Google Directions API)
- cp dataset.test.json dataset.json (Include your own data set here, current data is completely random)
- yarn dev (will limit to two boxes and two destinations not to overuse API)

## Real usage
- yarn start

## TODO: Implement \sum _{{i=1}}^{n}w_{i}\,\|x_{i}-y\|,