const lineReader = require('./read-first');
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const api = async function (app, constant) {
  let obj = {}
  for (let i = 0; i < constant.length; i++) {
    let lineCounter = 0
    await lineReader.eachLine(constant[i], function (line) {
      lineCounter++
      if (lineCounter == 1) {
        obj[line.replace(/(.*)=/, "").trim().split(' ')[0]] = constant[i]
        myCache.set("controllers", obj);
        return false;
      }
    });
  }

  function controllerFunction(req, res, next) {
    try {
      let cacheObj = myCache.get("controllers")
      let data = Object.keys(cacheObj).filter(key => key == req.params.functionName.split('.')[0])[0];
      let controller = require(cacheObj[data])
      controller[req.params.functionName.split('.')[1]](req, res, next)
    } catch (err) {
      console.error(err)
    }
  };

  async function customMiddleware(req, res, next) {
    try {
      let cacheObj = myCache.get("controllers")
      let reqObj = JSON.parse(req.params.payload)

      for (let i = 0; i < reqObj.middleware.length; i++) {
        let data = Object.keys(cacheObj).filter(key => key == reqObj.middleware[i].split('.')[0])[0];
        let controller = require(cacheObj[data])
        await controller[reqObj.middleware[i].split('.')[1]](req, res, next);
      }
    } catch (err) {
      console.log(err.message)
    }
    next()
  }
  // Routes
  app.get('/:functionName/:payload?',customMiddleware, controllerFunction);
  app.post('/:functionName/:payload?', customMiddleware, controllerFunction);
  app.put('/:functionName/:payload?', customMiddleware, controllerFunction);
  app.delete('/:functionName/:payload?', customMiddleware, controllerFunction);

}

module.exports = {
  api: api,
};