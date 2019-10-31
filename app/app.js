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


const triggerNotification = (text) => {
  const x = document.getElementById('snackbar')
  x.classList.add('show')
  x.innerText = text
  setTimeout(() => x.classList.remove('show'), 3000)
}

AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl)
  .then(response => {
    console.log('Fetched service configuration', response)
    configuration = response
    triggerNotification('Completed fetching configuration')
  })
  .catch(error => {
    console.log('Something bad happened', error)
    triggerNotification('Something bad happened')
  })


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
    triggerNotification(
      'Fetch Authorization Service configuration, before you make the authorization request.')
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