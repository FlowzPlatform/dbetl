console.log('process.env.NODE_ENV', process.env)
var temp = {
  serverURI: 'http://localhost:3034',
  socketURI: 'http://localhost:3034',
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.flowzcluster.tk/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.flowzcluster.tk/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.flowzcluster.tk/auth/Gplus',
  twitterSuccessCallbackUrl: 'http://localhost:8000',
  loginWithTwitterUrl: 'http://auth.flowzcluster.tk/auth/twitter',
  linkedinSuccessCallbackUrl: 'http://localhost:8000',
  loginWithLinkedinUrl: 'http://auth.flowzcluster.tk/auth/linkedin',
  githubSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGithubUrl: 'http://auth.flowzcluster.tk/auth/github',
  jobQueueUrl: 'http://api.flowzcluster.tk/rjobqueue1/job/create'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.flowzcluster.tk/dbetl', // 'http://api.flowzcluster.tk/dbetl', // ws.flowzcluster.tk:4034
    socketURI: 'ws://ws.flowzcluster.tk:3034',
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.flowzcluster.tk/api',
    facebookSuccessCallbackUrl: 'http://dbetl.flowzcluster.tk/',
    loginWithFacebookUrl: 'http://auth.flowzcluster.tk/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.flowzcluster.tk/',
    loginWithGoogleUrl: 'http://auth.flowzcluster.tk/auth/Gplus',
    linkedinSuccessCallbackUrl: 'http://dbetl.flowzcluster.tk/',
    loginWithLinkedinUrl: 'http://auth.flowzcluster.tk/auth/linkedin',
    githubSuccessCallbackUrl: 'http://dbetl.flowzcluster.tk/',
    loginWithGithubUrl: 'http://auth.flowzcluster.tk/auth/github',
    jobQueueUrl: 'http://api.flowzcluster.tk/rjobqueue1/job/create'
  }
}
export default temp
