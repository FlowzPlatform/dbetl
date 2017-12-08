console.log('process.env.NODE_ENV', process.env.NODE_ENV)
var temp = {
  serverURI: 'http://localhost:3034',
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://ec2-54-88-11-110.compute-1.amazonaws.com/api'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.flowz.com/dbetl',
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://ec2-54-88-11-110.compute-1.amazonaws.com/api'
  }
}
export default temp
