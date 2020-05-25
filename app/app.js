import {
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  RedirectRequestHandler
} from '@openid/appauth'

/* an example open id connect provider */
let openIdConnectUrl = 'https://app.verify-u.com/oauthconfig'
if (window.location.hostname === 'localhost') {
  openIdConnectUrl = 'http://localhost:4000/oauthconfig'
}

/* example client configuration */
let clientId = 'DEMO_PUB'
const redirectUri = window.origin

let scope = 'default'
let state = `demo_client@demo.com:${createUUID()}`
let configuration = null
let extras = {'prompt': 'consent', 'access_type': 'offline'}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function createUUID() {
  let dt = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  })
  return uuid
}

function triggerNotification(text) {
  const x = document.getElementById('snackbar')
  x.classList.add('show')
  x.innerText = text
  setTimeout(() => x.classList.remove('show'), 3000)
}

function init() {
  return AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl)
    .then(response => {
      console.log('Fetched service configuration', response)
      configuration = response
      triggerNotification('Completed fetching configuration')
    })
    .catch(error => {
      console.log('Something bad happened', error)
      triggerNotification('Something bad happened')
    })
}

if (getUrlParameter('code')) {
  triggerNotification("Authorization: " + getUrlParameter('code'))
} else {
  init()
}

function makeAuthorizationRequest() {
  // create a request
  const request = new AuthorizationRequest({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    state: state,
    extras: extras
  })

  if (configuration) {
    new RedirectRequestHandler().performAuthorizationRequest(configuration, request)
  } else {
    init().then(() => {
      new RedirectRequestHandler().performAuthorizationRequest(configuration, request)
    })
  }
}

function makeAutoAuthorizationRequest() {
  makeAuthorizationRequest()
}

function makeF2fAuthorizationRequest() {
  scope = 'f2f'
  makeAuthorizationRequest()
}

function makeGPAuthorizationRequest() {
  scope = 'giropay'
  makeAuthorizationRequest()
}

function makeEsignAuthorizationRequest() {
  clientId = 'ESIGN_PUB'
  scope = 'esign'
  makeAuthorizationRequest()
}

function makeGiropayEsignAuthorizationRequest() {
  clientId = 'ESIGN_PUB'
  scope = 'giropay_esign'
  makeAuthorizationRequest()
}

function toggleClientDataVisibility() {
  var el = document.getElementById("clientdata");
  el.classList.toggle('invisible');
}

window.app = {
  authorizeAuto() {
    console.log('authorizeAuto')
    makeAutoAuthorizationRequest()
  },
  authorizeF2f() {
    console.log('authorizeF2f')
    makeF2fAuthorizationRequest()
  },
  authorizeGP() {
    console.log('authorizeGP')
    initValues()
    makeGPAuthorizationRequest()
  },
  authorizeEsign() {
    console.log('authorizeEsign')
    initValues()
    makeEsignAuthorizationRequest()
  },
  authorizeGiropayEsign() {
    console.log('authorizeGiropayEsign')
    initValues()
    makeGiropayEsignAuthorizationRequest()
  },
  toggleClientData() {
    console.log('toggleClientDataVisibility')
    toggleClientDataVisibility()
  }
}


