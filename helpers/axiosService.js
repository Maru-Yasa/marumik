const axios = require("axios").default
const tunnel = require("tunnel");
const baseUrl = require("../constants/urls");
const HttpsProxyAgent = require('https-proxy-agent');
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
let randomUserAgent = require('random-user-agent')
axiosCookieJarSupport(axios);
const cookiejar = new tough.CookieJar();


axios.defaults.baseURL = baseUrl;
// axios.defaults.httpsAgent = tunnelAgent;
axios.defaults.jar = cookiejar;
// 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2; rv:10.0.1) Gecko/20100101 Firefox/10.0.1';
const AxiosService = async (url) => {
  return new Promise(async (resolve, reject) => {
    const _url = url == null?url:encodeURI(url);
    try {
      const response = await axios.get(_url);
      if (response.status === 200) {
        return resolve(response);
      }
      return reject(response);
    } catch (error) {
      return reject(error.message);
    }
  });
};



module.exports = AxiosService;
