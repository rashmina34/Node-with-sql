((redisHelper) => {
    'use strict';

    const redis = require('redis');
    const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, { no_ready_check: true });
    const HTTPStatus = require('http-status');
    const Promise = require('bluebird');

    redisHelper.generateUniqueCacheKey = req => {
        console.log('req.url', req.url)
        console.log('req.baseUrl', req.baseUrl);
        console.log('>>>>>req.query', req.query);
        return `${req.baseUrl}${req.url}`;
    };

    redisHelper.getCachedObjectData = (req, res, next) => {
        const _keyData = redisHelper.generateUniqueCacheKey(req);
        console.log('_keyData', _keyData, typeof _keyData);

        req.redis_cache_db.get(_keyData, (err, data) => {
            if (!err && data !== null) {
                return res.status(200).JSON({
                    status: HTTPStatus.OK,
                    response: JSON.parse(data)
                })
            }
            console.log('null data and error');
            next();
        });
    };

    redisHelper.getCachedStringData = (req, res, next) => {
        const _keyData = redisHelper.generateUniqueCacheKey(req);
        req.redis_cache_db.get(_keyData, (err, data) => {
            if (!err && data !== null) {
                return res.status(200).JSON({
                    status: HTTPStatus.OK,
                    response: data,
                });
            } else {
                next();
            }
        });
    };

    redisHelper.setDataForCatch = (req, key, data) => {
        const storeData = typeof data === 'string' ? data : JSON.stringify(data);
        req.redis_cache_db.setex(key, parseInt(process.env.REDIS_CACHE_EXPIRES) * 60 * 60, storeData);
    };
    redisHelper.getCachedForObjectData = (req, key) => {
        return new Promise((resolve, reject) => {
            req.redis_cache_db.get(key, async (err, data) => {
                if (!err && data !== null) {
                    resolve(JSON.parse(data));
                } else {
                    resolve(null);
                }
            });
        });
    };

    redisHelper.setDataToCache = (req, data) => {
        const _keyData = redisHelper.generateUniqueCacheKey(req);
        const storeData = typeof data === 'string' ? data : JSON.stringify(data);
        req.redis_cache_db.setex(_keyData, parseInt(process.env.REDIS_CACHE_EXPIRES) * 60 * 60, storeData);
    };

    redisHelper.scanRedisKeys = (req, cursor, returnKeys) => {
        console.log(req.base_url, 'baseurl')
        req.redis_cache_db.scan(
            cursor,
            'MATCH',
            `${req.base_url}*`,
            'COUNT',
            '1',
            (err, res) => {
                // console.log('res', res)
                if (!err) {
                    cursor = res[0];
                    const cacheKeys = res[1];
                    cacheKeys.forEach(key => {
                        returnKeys.push(key);
                    });
                    if (cacheKeys.length > 0) {
                        console.log('Array of matching keys', cacheKeys);
                    }
                    if (cursor === '0') {
                        return redisHelper.clearCacheKeys(returnKeys);
                    }
                } else {
                    return Promise.resolve([]);
                }

                return redisHelper.scanRedisKeys(req, cursor, returnKeys);
            });
    };

    redisHelper.clearDataCache = async (req) => {
        try {
            // Delete cached model data
            let cursor = '0';
            let returnKeys = [];
            redisHelper.scanRedisKeys(req, cursor, returnKeys);
        } catch (err) {
            console.log('err');
        }
    };

    redisHelper.clearCacheKeys = (keys) => {
        client.del(keys, (err) => {
            if (!err) {
                console.log('keys cleared from the redis db...');
            }
        });
    };
})(module.exports);
