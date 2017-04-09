const http = require('http');

let options = {
    hostname: 'netology.tomilomark.ru',
    path: '/api/v1/hash',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

function checkParam(param) {
    return typeof param !== 'undefined';
}

function response(request) {
    return new Promise((resolve, reject) => {
        request.on('response', response => {
            let data = '';
            
            if (response.statusCode !== 200) {
                return reject({
                    code: response.statusCode,
                    error: response.statusMessage
                });
            }

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(data);
            });
        });
    });
}

module.exports = (data, callback) => {
    const request = http.request(options);
    let   content = '';
    
    if (checkParam(data.lastname)) {
        data.lastname = data.lastname.trim();
        
        content = JSON.stringify({
            lastName:  data.lastname
        });
        
        request.setHeader(
            'Content-Length',
            Buffer.byteLength(content)
        );
    }
    
    if (checkParam(data.firstname)) {
        data.firstname = data.firstname.trim();
        request.setHeader('Firstname',  data.firstname);
    }
    
    request.write(content);
    request.end();
    
    return response(request);
}