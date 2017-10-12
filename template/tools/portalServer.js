const http = require('http');
const path = require('path');
const express = require('express');
const middleware = require('rocket-portal/middleware/middleware');
const pkgJson = require('../package.json');

module.exports = function () {
    const app = express();

    app.set('views', path.join(__dirname, '../node_modules/rocket-portal/dist'));
    app.use(express.static(path.join(__dirname, '../node_modules/rocket-portal/dist/')));

    app.use(require('express-blank-favicon'));
    middleware(express, app, {
        root: path.join(__dirname, '../node_modules/rocket-portal'),
        projectDescription: path.resolve(__dirname, '../README.md'),
        buildEnvPath: path.resolve(__dirname, '../config/buildEnv.json'),
        packageFile: path.resolve(__dirname, '../package.json')
    });

    const server = http.createServer(app);

    server.listen(pkgJson.rocket.portalPort, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`The portal server is listening at http://localhost:${pkgJson.rocket.portalPort}/`);
    });
}