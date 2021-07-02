const HTTPStatus = require('http-status');
const express = require('express');
require('dotenv').config(`${__dirname}/.env`);
const session = require('express-session');
const app = express(),
    cors = require('cors');
const redis = require('redis');
const requestIp = require('request-ip');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const parser = require("body-parser");
const dbConnector = require('./lib/helpers/db.helper')
const redisHelper = require('./lib/helpers/redis.helper');

app.use(cors());


const routeHelper = require('./lib/routes/index');
const path = require('path')

let redisStoreOpts = {};
dbConnector.init(app);
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, { no_ready_check: true });
client.auth(process.env.REDIS_PASSWORD, (err) => {
    if (err) throw err;
});

client.on('ready', () => {
    console.log('Ready to connect to Redis database...');
});

client.on('connect', () => {
    console.log('Connected to Redis database...');
    app.locals.redis_cache_db = client;
});

client.on('error', function (err) {
    console.log('Error ' + err);
});
// redisHelper.init(app);

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.use(session({
    secret: process.env.secretKey,
    resave: true
}));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

routeHelper.init(app);

app.use((req, res, next) => {
    if (app.locals.db) {
        req.db = app.locals.db;
    }
    if (app.locals.redis_cache_db) {
        req.redis_cache_db = app.locals.redis_cache_db;
    }
    req.root_dir = __dirname;
    req.client_ip_address = requestIp.getClientIp(req);
    // req.client_device = req.device.type + ' ' + req.device.name;
    if (req.method === 'GET') {
        return redisHelper.getCachedObjectData(req, res, next);
    }
    next();
});

redisStoreOpts = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: 20 * 60, // TTL of 20 minutes represented in seconds
    db: parseInt(process.env.REDIS_DATABASE),
    pass: process.env.REDIS_PASSWORD
};
// app.use("/", express.static(__dirname + '/public/'));
app.use(
    '/private-uploads',
    express.static(path.join(__dirname, '/private-uploads/'))
);

const sessionOpts = {
    store: new RedisStore(client), // if in production environment, uncomment it
    name: 'id', // <-- a generic name for the session id
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    maxAge: 1200000, // 20 minutes
    cookie: {
        // domain: 'secure.example.com' // limit the cookie exposure
        secure: true, // set the cookie only to be served with HTTPS
        path: '/',
        httpOnly: true, // Mitigate XSS
        maxAge: null
    }
};

app.use(session(sessionOpts));
app.use(async (req, res, next) => {
    try {
        if (req.method === 'GET' && req.done) {
            console.log('GET server response is ');
            redisHelper.setDataToCache(req, req.resData);
            return res.status(200).json({
                status: HTTPStatus.OK,
                message: req.message
            })

        } else if (
            (req.method === 'POST' ||
                req.method === 'PUT' ||
                req.method === 'PATCH' ||
                req.method === 'DELETE') &&
            req.done
        ) {
            console.log(`${req.method} server response`);
            const dataRes = req.saveRes;
            const updatedDataForSave = req.data;
            if (dataRes.result.n > 0) {
                redisHelper.clearDataCache(req);
            }
            if (req.method === 'POST' || req.method === 'PUT') {
                return res.status(200).json({
                    status: HTTPStatus.OK,
                    message: req.message,
                    data: updatedDataForSave,
                })

            }
            return res.status(200).json({
                data: updatedDataForSave,
                message: req.message
            })
        }
        next();
    } catch (err) {
        return next(err);
    }
});

app.get('/', (req, res, next) => {
    next();
}, function (req, res, next) {
    res.send("Hello from Admin Rashmina Shrestha.")
})


module.exports = app;
