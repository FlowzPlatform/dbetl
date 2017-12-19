console.log('process.env.NODE_ENV', process.env.NODE_ENV)
var temp = {
  serverURI: 'http://localhost:3034',
  socketURI: 'http://localhost:3034',
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.flowz.com/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.flowz.com/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.flowz.com/auth/Gplus'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.flowz.com/dbetl', // 'http://api.flowz.com/dbetl', // ws.flowz.com:4034
    socketURI: 'http://ws.flowz.com:4034',
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.flowz.com/api',
    facebookSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithFacebookUrl: 'http://auth.flowz.com/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithGoogleUrl: 'http://auth.flowz.com/auth/Gplus'
  }
}
export default temp
