export function mergeManifests(rootManifest: any, manifests: any[]) {
  const mergedManifest = rootManifest;

  mergedManifest.contracts = mergedManifest.contracts || []
  mergedManifest.libraries = mergedManifest.libraries || []
  mergedManifest.models = mergedManifest.models || []
  mergedManifest.events = mergedManifest.events || []
  mergedManifest.external_contracts = mergedManifest.external_contracts || []

  for (let manifest of manifests) {
    mergedManifest.contracts.push(...manifest.contracts);
    mergedManifest.libraries.push(...manifest.libraries);
    mergedManifest.models.push(...manifest.models);
    mergedManifest.events.push(...manifest.events);
    mergedManifest.external_contracts.push(...manifest.external_contracts);
  }
  return mergedManifest
}
