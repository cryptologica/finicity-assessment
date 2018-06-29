## Summary

This is the back-end portion of an app that will keep track of individual contestant scores for a county pie eating contest. It uses Node.js for the server and MongoDB for data persistence.

## Assumptions

1. The provided `name` will always be unique (i.e. if two people have the same name it's their responsibility to make each unique somehow).
1. A history of a given contestant's scores is unnecessary (i.e. only their highest score will be saved).
1. All requests use `x-www-form-urlencoded` parameters.
1. All responses are JSON compliant.

## Setup

1. Download and install Node.js and NPM if you haven't already.
1. Clone (or download) this repository.
1. Run `npm install` to install all required depencies.
1. Add your MongoDB URL to `db.js`.
1. Run `node server.js` to start the server.
1. Use something like Postman or Curl to test the API.

## API

**Get Scores**

`GET /score`

Returns the top 25 contestants with the highest scores (descending).

**Record Score**

`POST /score?name=John&pies=6`

Save the score (number of pies eaten) for a given contestant.

Returns the contestant object with their current high score (not necessarily the most recently recorded score).

**Delete Score**

`DELETE /score?name=John`

Deletes the given contestant (due to disqualification).

Returns a message that indicates the contestant (with given name) has successfully been deleted.