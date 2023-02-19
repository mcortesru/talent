const axios = require('axios');
const https = require('https');
const cookie = require('cookie');
const querystring = require('querystring');

const agent = new https.Agent({  
    rejectUnauthorized: false
  });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const loginUrl = 'http://summa.upsa.es/j_security_check';
const url = 'https://summa.upsa.es/json/select.vm?query=acceptsComments:yes';
const username = 'talent';
const password = 'talent_2023';

// Authenticate
axios.post(loginUrl, querystring.stringify({ j_username: username, j_password: password }), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  withCredentials: true

})
  .then(response => {

    console.log('Autenticación exitosa');
    console.log(response)

    // The session is automatically maintained with cookies stored in "response.headers['set-cookie']"

    // Make the JSON request
    return axios.get(url, {
      withCredentials: true,
      httpsAgent: agent,
      headers: {
        'Cookie': cookie.serialize('JSESSIONID', response.headers['set-cookie'][0])
      }
    });
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

