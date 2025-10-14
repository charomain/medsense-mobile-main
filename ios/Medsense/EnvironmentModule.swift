import Foundation

@objc(EnvironmentModule)
class EnvironmentModule: NSObject {
  // RN asks this for old-arch modules
  @objc static func requiresMainQueueSetup() -> Bool { false }

  // Expose constants to JS
  @objc func constantsToExport() -> [AnyHashable: Any]! {
    // Read from Info.plist so you can change per configuration/scheme
    let apiUrl = Bundle.main.object(forInfoDictionaryKey: "API_URL") as? String
      ?? "https://api.medsense.health/api"

    return [
      "apiUrl": apiUrl,
      "uploadsBaseUrl": "https://api.medsense.health",
      // keep parity with Android if you use this
      "appMainFile": "medsense"
    ]
  }
}
