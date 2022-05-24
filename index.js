var api_get = function (app, constant) {
  function respond(req, res, next) {
    constant[req.params.functionName](req, res, next)
    res.json({"message": "success"})
  }; //function respond(req, res, next) {

  function customMiddleware(req, res, next) {
    let reqObj = JSON.parse(JSON.stringify(req.params.payload))
    for (let i = 0; i < reqObj.middleware.length; i++) {
      await constant[reqObj.middleware[i]](req, res, next);
    }
    res.json({"message": "success"})
  }

  // Routes
  app.get('/:functionName/:payload?', customMiddleware, respond);
}

var api_post = function (app) {
  function post_handler(req, res, next) {
    console.log(req.params)
  };

  app.post('/:functionName/:payload?', post_handler);
}

module.exports = {
  api_get: api_get,
  api_post: api_post,
};