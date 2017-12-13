const subscription = require('subscription');
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  const app = this; // eslint-disable-line no-unused-vars

  app.use(subscription.subscription);
  let self = this;
  subscription.secureService.validate = (route, params, secureRouteInfo) => {
    return new Promise(async(resolve, reject) => {
      resolve(handleSubscription)
        // if (route === '/databases' && secureRouteInfo.value > 1) {
        //   resolve(true);
        // }
        // resolve(false);
    });
  };
};

var handleSubscription = (route, params, secureRouteInfo) => {
  var routes = {
    '/databases': async() => {
      let _count = await getDatabasesCount()
      return secureRouteInfo.value > _count
    }
  }
  return (routes[route]) ? routes[route]() : false
}

var getDatabasesCount = async() => {
  return await app.service('databases').find({
    query: {
      $limit: 0
    }
  }).then(result => result.total)
}
