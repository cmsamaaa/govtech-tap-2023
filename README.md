# govtech-tap-2023

#### METEOR TAP Assessment 2023
For this technical assessment, I chose to attempt the backend (RESTful API) project.
This project is written in NodeJs with TypeScript, using Express.js framework with MongoDB database.

## Table of contents
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [Status Codes](#status-codes)

## Getting Started
In the project directory, you may run the following commands in the terminal:

### `npm ci` 
   - This command will install all necessary dependencies based on the `package-lock.json`.
   - You only need to run this command <b>once</b> in the project directory.
### `npm run build`
   - This command compiles TypeScript into JavaScript.
   - The compiled JavaScript files will be located in `./dist`.
   - Alternatively, you may run `npx tsc`.
   - You need to run this command everytime you made a change to the TypeScript files.
   - Find out more from [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html).
### `npm start`
   - This command starts the node server located in `./dist`.
   - Highly recommended to always run `npm run build` before `npm start` unless you're certain.
   - Alternatively, you may run `node dist/app.js`.
### `npm run dev`
   - This command starts the node server in development environment.
   - It will watch for any changes to the TypeScript files, compiles, and restart the server.
   - Alternatively, you may run `concurrently "npx tsc --watch" "nodemon -q dist/app.js"`
   - For more info, please refer to [concurrently](https://github.com/open-cli-tools/concurrently#usage) and [Nodemon](https://github.com/remy/nodemon#nodemon).

## Dependencies

#### Node v16.x
    "dependencies": {
        "body-parser": "^1.20.0",
        "dotenv": "^16.0.1",
        "express": "^4.18.1",
        "mongoose": "^6.5.1"
    },
    "devDependencies": {
        "@types/body-parser": "^1.19.2",
        "@types/express": "^4.17.13",
        "@types/mongoose": "^5.11.97",
        "@types/node": "^18.6.4",
        "concurrently": "^7.3.0",
        "nodemon": "^2.0.19",
        "typescript": "^4.7.4"
    }

## API Documentation
This API supports JSON format. Please ensure that `Content-Type: application/json` is set in the request header.

### 1. Create Household
```http
POST /household/create
```
#### Request Body:
```javascript
{
    "householdType": String,
    "address": String,
    "unit": String,
    "postal": String
}
```
Constraints:  
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
    "message"    : String
    "_id"        : ObjectId
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

### 2. Add a family member to household
```http
PUT /household/add-member/:id
```
Substitute `:id` with a household record's id retrieved from the database.
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
Constraints:  
- Gender
  - "Male" or "Female" or "Non-binary"  ✔️
  - Any other string combinations ❌
- Marital Status
  - "Single" or "Married" or "Divorced" or "Widowed"  ✔️
  - Any other string combinations ❌
- Spouse (optional) 
  - Must include spouse name or id if "Married"
  - Spouse id must exist within household's family members
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
    "statusCode" : Number
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
```http
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
    "message"    : String
}
```
<br/>

### 4. Search for a specific household
```http
GET /household/find/:id
```
Substitute `:id` with a household record's id retrieved from the database.
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
    "message"    : String
}
```
<br/>

### 5. List household and family members that qualify for grants
```http
GET /household/find-qualifying/:option
```
Substitute `:option` with one of the grant options in the table below.

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