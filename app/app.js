import {
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  RedirectRequestHandler
} from '@openid/appauth'

/* an example open id connect provider */
const openIdConnectUrl = 'https://selfid.verify-u.com/oauthconfig'

/* example client configuration */
const clientId = 'DEMO_PUB'
const redirectUri = window.origin

let scope = 'default'
let state = 'random_state'
let configuration = null

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
    extras: {'prompt': 'consent', 'access_type': 'offline'}
  })

  if (configuration) {
    new RedirectRequestHandler().performAuthorizationRequest(configuration, request)
  } else {
    init().then(() => {
      new RedirectRequestHandler().performAuthorizationRequest(configuration, request)
    })
  }
}

const makeAnonAuthorizationRequest = () => {
  scope = 'fasttrack'
  makeAuthorizationRequest()
}

window.app = {}
window.app.authorize = () => {
  console.log('authorize')
  makeAuthorizationRequest()
}

window.app.authorizeAnon = () => {
  console.log('authorizeAnon')
  makeAnonAuthorizationRequest()
}

