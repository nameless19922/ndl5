const 
    http        = require('http'),
    querystring = require('querystring'),
    
    hash        = require('./hash');

function parse(data, type) {
    switch (type) {
        case 'application/json':
            data = JSON.parse(data);
            break;
            
        case 'application/x-www-form-urlencoded':
            data = querystring.parse(data);
            break;
            
        default:
            throw new Error('Bad content type');
            break;
    }
    
    return data;
}

function handleError(res, code, message) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.write(
        JSON.stringify({
            'error': message
        })
    );
}

function end(data, req, res) {
    try {
        data = parse(data, req.headers['content-type']);
                
        res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });

        hash(data).then(result => {
            result = JSON.parse(result);

            res.write(
                JSON.stringify({
                    firstName: data.firstname,
                    lastName: data.lastname,
                    secretKey: result.hash
                })
            );
            res.end();
        }).catch(error => {
            res.write(
                JSON.stringify(error)
            );
            res.end();
        });
    } catch (error) {
        handleError(res, 200, error.message);
        res.end();
    }
}

function handler(req, res) {
    let data = '';
    
    if (req.url === '/') {
        if (req.method === 'POST') {
            req.on('data', chunk => data += chunk);
            
            req.on('end', () => {
                end(data, req, res);
            });
        } else {
            handleError(res, 405, 'Method not allowed');
            res.end();
        }
    } else {
        handleError(res, 404, `${req.url} not found`);
        res.end();
    }
}

function server(port) {
    const server = http.createServer();

    server.on('error', err => console.error(err));
    server.on('request', handler);
    server.on('listening', () => {
        console.log(`Start http server at ${port}`);
    });

    server.listen(port);
}

module.exports = server;