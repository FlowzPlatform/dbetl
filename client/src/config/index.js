console.log('process.env.NODE_ENV', process.env.NODE_ENV)
var temp = {
  serverURI: 'http://localhost:3034',
  socketURI: 'http://localhost:3034',
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.' + process.env.domainkey + '/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.' + process.env.domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.' + process.env.domainkey + '/auth/Gplus',
  twitterSuccessCallbackUrl: 'http://localhost:8000',
  loginWithTwitterUrl: 'http://auth.' + process.env.domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: 'http://localhost:8000',
  loginWithLinkedinUrl: 'http://auth.' + process.env.domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGithubUrl: 'http://auth.' + process.env.domainkey + '/auth/github'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.' + process.env.domainkey + '/dbetl', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'ws://ws.' + process.env.domainkey + ':3034',
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.' + process.env.domainkey + '/api',
    facebookSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithFacebookUrl: 'http://auth.' + process.env.domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithGoogleUrl: 'http://auth.' + process.env.domainkey + '/auth/Gplus',
    linkedinSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithLinkedinUrl: 'http://auth.' + process.env.domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithGithubUrl: 'http://auth.' + process.env.domainkey + '/auth/github'
  }
}
export default temp
