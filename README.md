# govtech-tap-2023

#### METEOR TAP Assessment 2023
For this technical assessment, I chose to attempt the backend (REST API) project.
This project is written in TypeScript for NodeJs, using Express.js framework with MongoDB database.

## Table of contents
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)

## Getting Started
In the project directory, you may run the following commands in the terminal:

### `npm install` 
   - This command will install all necessary dependencies.
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