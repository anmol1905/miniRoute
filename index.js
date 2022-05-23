var api_get= function (app) {
  function respond(req, res, next) {
      console.log(req.params)
  }; //function respond(req, res, next) {

  // Routes
  app.get('/:functionName/:payload?', respond);
} 

var api_post= function (app) {
  function post_handler(req, res, next) {
    console.log(req.params)
  }; 

  app.post('/:functionName/:payload?', post_handler);    
}  

module.exports = {
  api_get: api_get,
  api_post: api_post,
};