const subscription = require('flowz-subscription');
const authentication = require('../authentication')

let app = undefined;
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  app = this; // eslint-disable-line no-unused-vars


  // check authentication
  app.use(authentication)

  // Check subscription
  // app.use(subscription.subscription);
  // subscription.secureService.validate = (route, params, secureRouteInfo) => {
  //   return new Promise(async(resolve, reject) => {
  //     var data = await handleSubscription(route, params, secureRouteInfo)
  //     resolve(data)
  //   });
  // };
};

var handleSubscription = (route, params, secureRouteInfo) => {
  var routes = {
    '/databases': async() => {
      let _count = await getDatabasesCount()
      return secureRouteInfo.value > _count
    }
  }
  return (routes[route]) ? routes[route]() : true
}

var getDatabasesCount = async() => {
  return await app.service('databases').find({
    query: {
      $limit: 0
    }
  }).then(result => result.total)
}
