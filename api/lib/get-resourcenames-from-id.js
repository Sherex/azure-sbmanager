/**
 * Parses an Subscription ID String Azure
 * @param {String} idString ID string of the resource
 * @returns {Object} Contains whatever resources that´s specified in the ID
 */
module.exports = (idString) => {
  const resGroupRegEx = new RegExp(/(?:.*resourceGroups\/(?<resGroup>[^/]*))?(?:.*namespaces\/(?<namespace>[^/]*))?(?:.*queues\/(?<queue>[^/]*))?/)
  const result = resGroupRegEx.exec(idString).groups
  // Cleaner output
  const resources = {}
  for (const group in result) {
    if (result[group]) {
      resources[group] = result[group]
    }
  }

  if (result.resGroup) {
    resources.resGroup = result.resGroup
  }

  return resources
}
