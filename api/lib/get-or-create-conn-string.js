const config = require('../config')
const armServiceBus = require('@azure/arm-servicebus')
const idStringParser = require('./get-resourcenames-from-id')

module.exports = async function getOrCreateConnString (credentials, subscriptionId, namespaceIds) {
  if (!credentials) { throw Error('Parameter credentials was not passed') }
  if (!subscriptionId) { throw Error('Parameter subscriptionId was not passed') }
  if (!namespaceIds) { throw Error('Array of namespaceIds was not passed') }

  namespaceIds = Array.isArray(namespaceIds) ? namespaceIds : [namespaceIds]

  const sbMgmClient = new armServiceBus.ServiceBusManagementClient(
    credentials,
    subscriptionId
  )

  // TODO: Handle invidual errors
  const connStrings = await Promise.all(
    namespaceIds.map(async (namespaceId, i) => {
      let connString

      const queue = idStringParser(namespaceId)

      if (!queue.resGroup) throw Error('ID String did not contain resourceGroup.')
      if (!queue.namespace) throw Error('ID String did not contain namespace.')

      try {
        connString = await sbMgmClient.namespaces.listKeys(queue.resGroup, queue.namespace, config.SAS_KEY_NAME)
      } catch (error) {
        await sbMgmClient.namespaces.createOrUpdateAuthorizationRule(queue.resGroup, queue.namespace, config.SAS_KEY_NAME, { rights: ['Listen', 'Send', 'Manage'] })

        connString = await sbMgmClient.namespaces.listKeys(queue.resGroup, queue.namespace, config.SAS_KEY_NAME)
      } finally {
        return connString.primaryConnectionString
      }
    })
  )

  return connStrings
}
