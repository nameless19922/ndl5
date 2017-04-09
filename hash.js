const http = require('http');

let options = {
    hostname: 'netology.tomilomark.ru',
    path: '/api/v1/hash',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

function response(request) {
    return new Promise((resolve, reject) => {
        request.on('response', response => {
            if (response.statusCode !== 200) {
                return reject({
                    code: response.statusCode,
                    error: response.statusMessage
                });
            }
            
            let data = '';

            response.on('data', function (chunk) {
                data += chunk;
            });

            response.on('end', function () {
                resolve(data);
            });
        });
    });
}

module.exports = (data, callback) => {
    const request = http.request(options);
    
    data.firstname = typeof data.firstname !== 'undefined' ? data.firstname : '';
    data.lastname = typeof data.lastname !== 'undefined' ? data.lastname : ''; 
    
    let content = JSON.stringify({
        lastName:  data.lastname
    });
    
    request.setHeader('Firstname',  data.firstname);
    request.setHeader('Content-Length', Buffer.byteLength(content));
    
    request.write(content);
    request.end();
    
    return response(request);
}