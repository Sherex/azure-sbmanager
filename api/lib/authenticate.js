const msRestNodeAuth = require('@azure/ms-rest-nodeauth')
const msJsAuth = require('@azure/ms-rest-js')

// TODO: This will later be done in the webapp
// https://github.com/azure/azure-sdk-for-node/blob/HEAD/Documentation/Authentication.md#for-azure-graph-sdk

/**
 * Copy the code in console and navigate to the link, then log in.
 */
module.exports.cli = async () => {
  return msRestNodeAuth.interactiveLoginWithAuthResponse()
}

module.exports.web = async (token) => {
  const auth = new msJsAuth.TokenCredentials(token)
  return auth.signRequest()
}
