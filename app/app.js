import {
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  RedirectRequestHandler
} from '@openid/appauth'

/* an example open id connect provider */
const openIdConnectUrl = 'https://app.verify-u.com/oauthconfig'

/* example client configuration */
let clientId = 'DEMO_PUB'
const redirectUri = window.origin

let scope = 'default'
let state = `random_state_${parseInt(Math.random()* 100000)}`
let configuration = null
let extras = {'prompt': 'consent', 'access_type': 'offline'}

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}


const triggerNotification = (text) => {
  const x = document.getElementById('snackbar')
  x.classList.add('show')
  x.innerText = text
  setTimeout(() => x.classList.remove('show'), 3000)
}

const init = () => {
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

const makeAuthorizationRequest = () => {
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

const makeAutoAuthorizationRequest = () => {
  makeAuthorizationRequest()
}

const makeF2fAuthorizationRequest = () => {
  scope = 'f2f'
  makeAuthorizationRequest()
}

const makeGPAuthorizationRequest = () => {
  scope = 'giropay'
  makeAuthorizationRequest()
}

const makeEsignAuthorizationRequest = () => {
  scope = 'esign'
  makeAuthorizationRequest()
}

const makeGiropayEsignAuthorizationRequest = () => {
  scope = 'giropay_esign'
  makeAuthorizationRequest()
}

const toggleClientDataVisibility = () => {
  var el = document.getElementById("clientdata");
  el.classList.toggle('invisible');
}

const initValues = () => {
  extras['email'] = document.querySelector("#inputEmail").value;
  extras['msisdn'] = document.querySelector("#inputMSISDN").value; 
  extras['iban'] = document.querySelector("#inputIban").value; 
  extras['document_id'] = document.querySelector("#inputDocumentId").value; 
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


