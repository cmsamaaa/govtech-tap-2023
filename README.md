# govtech-tap-2023

#### METEOR TAP Assessment 2023
For this technical assessment, I chose to attempt the backend (RESTful API) project. This project is written in Node.js 
with TypeScript, using Express.js framework with MongoDB database. 

#### Author: Loh Chun Mun

## Table of Contents
- [Setup Guide (Local)](#setup-guide-local)
  1. [Node.js](#1-nodejs)
  3. [MongoDB](#2-mongodb)
  4. [Process Environment Variables](#3-process-environment-variables-env)
- [npm Commands](#npm-commands)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
   1. [Create household](#1-create-household)
      - [Request Body](#request-body)
      - [Constraints](#constraints)
      - [Responses](#constraints)
   2. [Add a family member to household](#2-add-a-family-member-to-household)
      - [Request Body](#request-body)
      - [Constraints](#constraints)
      - [Responses](#constraints)
   3. [List all households](#3-list-all-households)
      - [Responses](#constraints)
   4. [Search for a specific household](#4-search-for-a-specific-household)
      - [Responses](#constraints)
   5. [List household and family members that qualify for grants](#5-list-household-and-family-members-that-qualify-for-grants)
      - [Responses](#constraints)
- [Status Codes](#status-codes)
- [Unit Test](#unit-test)
- [CI/CD Pipeline](#cicd)
- [Explanations](#explanations)
  - [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors) 
  - [Database](#database)
    - [Household](#household)
    - [Family Members](#family-members)
  - [Architecture Decisions](#architecture-decisions)

## Setup Guide (Local)
Needless to say, please clone the project first before proceeding.
### 1. Node.js
To run this project locally, you must have Node.js installed on your device. A quick way to get started is to directly
install Node.js on your system. You may download the installer [here](https://nodejs.org/en/download/).

However, it is strongly recommended to use a Node version manager such as [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 
to install Node.js and npm. You may read more about it [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
### 2. MongoDB
To run the project locally, you must ensure that you have MongoDB database available. You may host a MongoDB database
[locally](https://www.mongodb.com/docs/manual/installation/) or on the cloud through 
[MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/). I highly recommend you to use MongoDB Atlas as it 
is a cloud-hosted MongoDB service which requires no installation overhead and offers a free tier option without the need
for any of your billing information! 

To set up a MongoDB Atlas cluster, please follow the official documentations: 
1. [Create an Atlas Account](https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/)
2. [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
3. [Add Your Connection IP Address](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/)
4. [Create a User for Your Cluster](https://www.mongodb.com/docs/atlas/tutorial/create-mongodb-user-for-cluster/)
5. [Connect to Your Cluster](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)

To set up a MongoDB cluster locally, please follow the official documentation [here](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-windows/).

Once you have successfully setup your cluster, you should be presented with a **URI** that looks similar to the following:

```
mongodb+srv://<USER_NAME>:<USER_PASSWORD>@<CLUSTER_NAME>.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority
```

> **NOTE:** You do not have to import any database collections as seed data will be inserted when the database is empty.

### 3. Process Environment Variables `.env`
To run the program, you must configure the process environment variables first. 

You may do so by creating an empty file in the root directory and name it `.env`. The file should contain the following:
```
MONGODB_URI="mongodb+srv://<USER_NAME>:<USER_PASSWORD>@<CLUSTER_NAME>.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority"
PORT=3000
```
> **NOTE:** You may specify any name of your choice for `<DATABASE_NAME>`.

| Parameters    | Type     | Description                                                                              |
|:--------------|:---------|:-----------------------------------------------------------------------------------------|
| `MONGODB_URI` | `String` | **Required**. URI that points to your MongoDB cluster and database.                      |
| `PORT`        | `Number` | **Optional**. Specify the port that your app will run on. On default, it is set to 3000. |

## npm Commands
Now that your local files are set up and ready, we can start the server and run the server locally! 
Here, we have a list of CLI commands that may be useful to you. In the project directory, simply open a terminal to run 
the following:

### `npm ci` 
   - This command will install all necessary dependencies based on the `package-lock.json`.
   - You only need to run this command <b>once</b> in the project directory.
### `npm run build`
   - This command compiles all the TypeScript files into JavaScript.
   - The compiled JavaScript files will be located in `./dist`.
   - Alternatively, you may run `npx tsc`.
   - You are required to run this command everytime you made a change to the TypeScript files.
   - Find out more from [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html).
### `npm start`
   - This command starts the node server located in `./dist`.
   - Highly recommended to always run `npm run build` before `npm start` unless you are certain that it is the latest.
   - Alternatively, you may run `node dist/app.js`.
### `npm run dev`
   - This command starts the node server in development mode.
   - It will monitor for any changes to the TypeScript files and compiles whenever necessary, afterwards it will restart the node server.
   - Alternatively, you may run `concurrently "npx tsc --watch" "nodemon -q dist/app.js"`
   - For more info, please refer to [concurrently](https://github.com/open-cli-tools/concurrently#usage) and [Nodemon](https://github.com/remy/nodemon#nodemon)
### `npm run test`
   - This command runs the unit tests and generates a code coverage report.
   - Code coverage report are generated in `./coverage`, in HTML format for ease of readability.
   - Alternatively, you may run `nyc --reporter=html --reporter=text mocha dist/test/household.js --timeout 5000 --exit"`
   - For more info, you may read up on them in their official documentations: [Istanbul / nyc](https://istanbul.js.org/), [Mocha.js](https://mochajs.org/), [Chai.js](https://www.chaijs.com/).

## Dependencies

#### Running on Node v16.13.1
Refer to [package-lock.json](./package-lock.json) for all the nitty-gritty details, or refer to the following for a
summarised list taken from [package.json](./package.json): 

    "dependencies": {
        "body-parser": "^1.20.0",
        "cors": "^2.8.5",
        "dotenv": "^16.0.1",
        "express": "^4.18.1",
        "mongoose": "^6.5.1"
    },
    "devDependencies": {
        "@types/body-parser": "^1.19.2",
        "@types/chai": "^4.3.3",
        "@types/chai-http": "^4.2.0",
        "@types/express": "^4.17.13",
        "@types/mocha": "^9.1.1",
        "@types/mongoose": "^5.11.97",
        "@types/node": "^18.6.4",
        "chai": "^4.3.6",
        "chai-http": "^4.3.0",
        "concurrently": "^7.3.0",
        "mocha": "^10.0.0",
        "nodemon": "^2.0.19",
        "nyc": "^15.1.0",
        "typescript": "^4.7.4"
    }

## API Documentation
This API supports JSON format. Please ensure that `Content-Type: application/json` is set in the request header.

When a request is sent to a non-existing endpoint (a.k.a. ERROR 404), the following JSON response will be thrown:
```javascript
{
    "statusCode": 404,
    "message": "Invalid API endpoint."
}
```

### 1. Create household
```http request
POST /household/create
```
#### Request Body:
```javascript
{
    "housingType": String,
    "address": String,
    "unit": String,
    "postal": String
}
```
| Parameter     | Type     | Description                                       |
|:--------------|:---------|:--------------------------------------------------|
| `housingType` | `string` | **Required**. "HDB" or "Condominium" or "Landed". |
| `address`     | `string` | **Required**. Block and street name.              |
| `unit`        | `string` | **Required**. Unit number of the apartment.       |
| `postal`      | `string` | **Required**. Postal code.                        |
#### Constraints:

- Household Type
  - "HDB" or "Condominium" or "Landed"  ✔️
  - Any other string combinations ❌
- Unit 
  - Two digits, followed by a hyphen, followed by minimum two up to four digits  (e.g "12-99" or "08-4321") ✔️
  - For landed, you must enter unit as "01-01" ✔️
  - Any other string combinations (e.g. "1-321") ❌
- Postal 
  - Six digits (e.g. 123456) ✔️
  - Any other string combinations (e.g. 1a2b3c) ❌

#### Responses:
```javascript
// Valid Request Reponse

{
    "statusCode" : Number,
    "_id"        : ObjectId,
    "message"    : String
}
```
```javascript
// Invalid Request Reponse

{
    "statusCode" : Number,
    "_id"        : null,
    "message"    : String
}
```
<br/>

### 2. Add a family member to household
```http request
PUT /household/add-member/:id
```
| Parameter | Type                   | Description                           |
|:----------|:-----------------------|:--------------------------------------|
| `:id`     | `string` or `ObjectId` | **Required**. Household object `_id`. |
#### Request Body:
```javascript
{
    "name": String,
    "gender": String,
    "maritalStatus": String,
    "spouse"?: String | ObjectId,
    "occupationType": String,
    "annualIncome": Number,
    "DOB_day": String,
    "DOB_month": String,
    "DOB_year": String
}
```
| Parameter        | Type                   | Description                                                     |
|:-----------------|:-----------------------|:----------------------------------------------------------------|
| `name`           | `string`               | **Required**. Full name.                                        |
| `gender`         | `string`               | **Required**. "Male" or "Female" or "Non-binary".               |
| `maritalStatus`  | `string`               | **Required**. "Single" or "Married" or "Divorced" or "Widowed". |
| `spouse`         | `string` or `ObjectId` | **Optional**. Name or `_id` of spouse.                          |
| `occupationType` | `string`               | **Required**. "Unemployed" or "Student" or "Employed".          |
| `annualIncome`   | `decimal`              | **Required**. Annual income of the person.                      |
| `DOB_day`        | `string`               | **Required**. Day segment of the date of birth.                 |
| `DOB_month`      | `string`               | **Required**. Month segment of the date of birth.               |
| `DOB_year`       | `string`               | **Required**. Year segment of the date of birth.                |
#### Constraints:  
- Gender
  - "Male" or "Female" or "Non-binary"  ✔️
  - Any other string combinations ❌
- Marital Status
  - "Single" or "Married" or "Divorced" or "Widowed"  ✔️
  - Any other string combinations ❌
- Spouse (optional) 
  - Must include spouse name or id if "Married"
  - Spouse id must exist within household's family members
  - When a spouse id is provided, a validation is done to ensure that the target family member's spouse shares the same name as the current family member that is being added.
  - Error will be thrown if spouse id cannot be found within the same household's family members ❌
- Occupation Type
  - "Unemployed" or "Student" or "Employed"  ✔️
  - Any other string combinations ❌
- Annual Income
  - Whole numbers and decimals   ✔️
  - Any other string combinations ❌
- DOB (Date of Birth)
  - Day and month must be two digits (e.g. 01 or 12) ✔️
  - Year must be four digits (e.g. 1998 or 2020) ✔️
  - Any other string combinations ❌

#### Responses:
```javascript
// Valid Request Reponse

{
    "statusCode" : Number,
    "message"    : String
}
```
```javascript
// Invalid Request Reponse

{
    "statusCode" : Number,
    "message"    : String
}
```
<br/>

### 3. List all households
```http request
GET /household/all
```
#### Responses:
```javascript
// Valid Request Reponse

{
    "statusCode" : Number,
    "result"     : [Object]
}
```
```javascript
// Invalid Request Reponse

{
    "statusCode" : Number,
    "result"     : null,
    "message"    : String
}
```
<br/>

### 4. Search for a specific household
```http request
GET /household/find/:id
```
| Parameter | Type                   | Description                           |
|:----------|:-----------------------|:--------------------------------------|
| `:id`     | `string` or `ObjectId` | **Required**. Household object `_id`. |
#### Responses:
```javascript
// Valid Request Reponse

{
    "statusCode" : Number,
    "result"     : Object
}
```
```javascript
// Invalid Request Reponse

{
    "statusCode" : Number,
    "result"     : null,
    "message"    : String
}
```
<br/>

### 5. List household and family members that qualify for grants
```http request
GET /household/find-qualifying/:option
```
| Parameter | Type     | Description                                                                               |
|:----------|:---------|:------------------------------------------------------------------------------------------|
| `:option` | `string` | **Required**. Specify a grant option to list the qualifying household and family members. |

| Option | Grant                       |
|:-------|:----------------------------|
| 0      | Student Encouragement Bonus |
| 1      | Multigeneration Scheme      |
| 2      | Elder Bonus                 |
| 3      | Baby Sunshine Grant         |
| 4      | YOLO GST Grant              |
#### Responses:
```javascript
// Valid Request Reponse

{
    "statusCode" : Number,
    "result"     : [Object]
}
```
```javascript
// Invalid Request Reponse

{
    "statusCode" : Number,
    "result"     : null,
    "message"    : String
}
```

## Status Codes

| Status Code | Description   |
|:------------|:--------------|
| 200         | `OK`          |
| 201         | `CREATED`     |
| 400         | `BAD REQUEST` |
| 404         | `NOT FOUND`   |

## Unit Test
Unit tests have been written to test each of the API endpoints, ensuring that the HTTP status codes are returned 
correctly, all responses returns as intended and in proper format, and that exceptions are handled properly. In order to
achieve this, I picked a combination of [Mocha.js](https://mochajs.org/) and [Chai.js](https://www.chaijs.com/)
framework, which are commonly used together for writing Node.js unit testing. On top of these, it was also necessary to 
install [Chai HTTP](https://www.chaijs.com/plugins/chai-http/) to support HTTP integration testing with Chai assertions.

To ensure that the unit tests are covering as many segments of the codes as possible, I have used a code coverage
tester, [Istanbul / nyc](https://istanbul.js.org/), as a means to ensure my codebase are well tested by my unit tests.

During the testing, the application automatically swaps to the test database, such that the production database will be 
left untouched. This is achieved through setting the test database's URI in the GitHub Secrets, and retrieving the URI
as a process environment variable, such that different devices' environment variables would vary, allowing for more
flexibility in swapping databases whenever necessary.

In order to accurately test the endpoints and response results, seed data will be inserted at the start of the test and 
removed at the end of testing.

## CI/CD
This project is supported by a CI/CD pipeline workflow. The entire process starting from the moment the code is pushed 
onto this repository, until the deployment on Heroku are fully automated.

The CI/CD process begins with the workflow process on GitHub Actions. Click [here](./.github/workflows/node.yml) to view
the YAML file.

Upon pushing into the "main" branch, the CI workflow will be automatically triggered, beginning with checking out the 
repository so that the workflow can access it. The CI attempt to install all necessary dependencies, compile the 
TypeScript into JavaScript (build), and run the unit testings (test). When the build and tests are completed, it will 
export both the compiled app and code coverage report as artifacts produced by the workflow, which can be downloaded 
from the "Summary" of each completed workflow process.

When the CI workflow passes, the codes will be deployed to Heroku automatically.

And that encompasses the entire workflow and pipeline of this project!

## Explanations
### Cross-Origin Resource Sharing (CORS)
Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from 
another domain outside the domain from which the first resource was served. 

To ensure that users from different domains 
can call and access the API endpoint, I have allowed CORS for the following HTTP request methods: 
```
GET, POST, PUT, DELETE, OPTIONS
```
### Database
All database records have a `createdAt` and `updatedAt` field, which I think is necessary to keep track of when updates 
are made, especially for sensitive data such as citizen's addresses and personal information.
#### Household
- Asides from `housingType`, I have deemed that `address`, `unit` and `postal` are necessary to describe a household uniquely.
- `housingType` is constrained to only three values 'HDB', 'Condominium', or 'Landed', to ensure that users cannot submit invalid values, hence allowing accurate filtering.
#### Family Members
- `occupationType` is constrained to only the three options as stated in the assessment's instructions: 'Unemployed', 'Student', 'Employed'.
- `gender` is constrained to only standard options of 'Male', 'Female', and 'Non-binary'.
- `maritalStatus` is constrained to standard options of 'Single', 'Married', 'Divorced', 'Widowed'.
- Same as the reason before, these constraints are put in place to ensure that users do not enter invalid values, thus allowing us to accurately filter the information by these fields when necessary.
### Architecture Decisions
When I received the email notifying me of this assessment, I spontaneously decided on Node.js as it is very a rather 
popular JavaScript runtime environment being widely used today. However, I wanted to challenge myself, as I have had 
prior experiences writing in JavaScript. This is when I decided to write this program in an unfamiliar language 
(as an opportunity for me to learn).

This is when I thought of TypeScript, which could allow me to work with Node.js, Express.js framework, and works 
seamlessly with the popular non-relational database, MongoDB.

TypeScript is generally preferred over JavaScript due to its support for static/strong typing, allowing errors to be
spotted during compile time, which is a feature that JavaScript does not offer. Prior to compiling, during the 
development phase, TypeScript often point out compilation errors as we work on the code. Due to this, we will be less 
likely to encounter runtime errors, unlike JavaScript which is an interpreted language.

TypeScript also allows for easier code refactoring, better readability due to specifying strict types, and its support 
of OOP paradigm, makes TypeScript a very good consideration over JavaScript.

On the other hand, the most notable disadvantage about TypeScript over JavaScript would be its compilation time. 

Thus, with these aforementioned reason, I chose to write the API in TypeScript.