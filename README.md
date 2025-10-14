# Medsense Mobile (React Native)

Multi-tenant React Native app (RN **0.81.1**, Hermes) with Android flavors and Firebase (App, Crashlytics, Messaging). Tenants: **medsense** and **toothcase**. Environments: **production** and **staging**.

## Requirements

* **Node**: 20.19.4
* **Xcode**: 16.x (tested 16.2). macOS with command line tools.
* **CocoaPods**: ≥ 1.12
* **Android**: Android Studio (latest), Android SDK 34+, NDK side-loaded by RN as needed.

**Tip (Xcode uses your Node):** create `ios/.xcode.env.local`:

---

## Quick start

```bash
# 0) Node deps
nvm use 20.19.4
npm i

# 1) iOS
cd ios
pod install
cd ..

# 2) Android: pick a variant (see Flavors)
npm run android   # defaults to debug of the current variant in Android Studio

# 3) iOS run
open ios/Medsense.xcworkspace  # choose a simulator and Run
```

---

## Flavors & App IDs

Android has **two flavor dimensions**: `tenant` and `environment`.

**Gradle (summary):**

```gradle
flavorDimensions "tenant", "environment"

productFlavors {
  // tenant
  medsense {
    dimension "tenant"
    resValue "string", "app_name", "Medsense"
    buildConfigField "String", "APP_MAIN_FILE", "\"medsense\""
    // applicationId inherits from defaultConfig: com.medsense.health.app
  }

  // environment
  production {
    dimension "environment"
    buildConfigField "String", "API_URL", "\"https://api.medsense.health/api\""
  }
  staging {
    dimension "environment"
    applicationIdSuffix ".staging"
    buildConfigField "String", "API_URL", "\"https://api.staging.medsense.health/api\""
  }
}
```

> iOS currently uses a single target/bundle id: `com.medsense.health.app`. You can introduce schemes/xcconfigs later if you need distinct iOS bundle IDs.

---

## Firebase setup

We use `@react-native-firebase/app`, `crashlytics`, `messaging`.

### 1) Config files

* **iOS**: Add `ios/Medsense/GoogleService-Info.plist` to the **Medsense target** (File Inspector → Target Membership checked; Build Phases → Copy Bundle Resources lists it). Bundle ID must match.
* **Android**: Add `android/app/src/medsenseProduction/google-services.json` file

### 2) iOS initialization (Swift AppDelegate)

```swift
import FirebaseCore
...
if FirebaseApp.app() == nil { FirebaseApp.configure() }
```

### 3) Pods (Firebase + Swift + static)

If using static frameworks, ensure module maps for Google/Firebase transitive pods. In `Podfile` inside target, add modular headers for these pods **or** `use_modular_headers!` globally.

```ruby
%w[FirebaseCore FirebaseCoreInternal FirebaseCoreExtension FirebaseInstallations GoogleUtilities GoogleDataTransport PromisesObjC nanopb].each do |name|
  pod name, :modular_headers => true
end
```

---

## iOS project notes

* **Capabilities**: Push Notifications + Background Modes (Remote). For Wi‑Fi: Access WiFi Information, Hotspot Configuration.

---

## Android project notes

* **Application IDs** as above per flavor. `namespace` stays `com.medsense.health.app`.
* **Permissions** (AndroidManifest): camera, record audio, notifications, wifi/location for scans, etc.

---

## Running & builds

### Android – development (scripts or Gradle)

If your repo includes helper scripts (see old README), you can use:

```bash
npm run generate-keystore     # one-time debug keystore (if missing)
npm run clean                 # project clean
npm run clear-watchman        # clear watchman caches
npm run build-android-apk     # assemble & install a dev APK
```

Equivalent Gradle commands:

```bash
cd android
./gradlew assembleMedsenseStagingDebug  # or any variant
./gradlew installMedsenseStagingDebug
```

### Android – release (Play Store)

1. **Create release keystore** (once; store securely, not in repo):

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. **Reference keystore** in `android/app/build.gradle` `signingConfigs.release`:

```gradle
signingConfigs {
  release {
    storeFile file('path/to/my-release-key.keystore')
    storePassword '***'
    keyAlias 'my-key-alias'
    keyPassword '***'
  }
}
```

3. **Build AAB (recommended)**:

```bash
cd android
./gradlew bundleMedsenseProductionRelease
```

Output: `android/app/build/outputs/bundle/medsenseProductionRelease/app-medsenseProduction-release.aab`

Or **APK**:

```bash
./gradlew assembleMedsenseProductionRelease
```

Output: `android/app/build/outputs/apk/medsenseProduction/release/app-medsenseProduction-release.apk`

4. **Upload** AAB/APK to Google Play Console. Use **Play App Signing**.

### iOS

Open `ios/Medsense.xcworkspace` and Run. For push, enable **Push Notifications** & **Background Modes (Remote)** and ensure `FirebaseApp.configure()` is called.

### Fastlane (optional)

Read [Fastlane’s iOS setup](https://docs.fastlane.tools/getting-started/ios/setup/). If you need to ship from local:

```bash
cd ios
bundle install   # or bundle update
# then configure lanes in Fastfile for build, sign, and upload
```

### Metro

```bash
# start fresh
watchman watch-del-all 2>/dev/null || true
npx react-native start --reset-cache
```

### Android (CLI)

```bash
# example
cd android
./gradlew assembleMedsenseStagingDebug
./gradlew installMedsenseStagingDebug
```

Pick variant in Android Studio: **Build Variants** panel.

### iOS

Open `ios/Medsense.xcworkspace` and Run. Ensure `GoogleService-Info.plist` is in target & `FirebaseApp.configure()` is called.

---

## Testing & lint

* **Jest** with `babel-jest` and React Native preset.
* **ESLint**: `@react-native-community/eslint-config` (TS-ready). Scripts:

```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "jest"
  }
}
```

---

### Quick cleans

```bash
# Metro / Watchman
watchman watch-del-all 2>/dev/null || true
rm -rf $TMPDIR/metro-* $TMPDIR/haste-map-*

# NPM
npm cache clean --force
rm -rf node_modules package-lock.json
npm i

# Android
cd android && ./gradlew --stop && rm -rf .gradle build app/build .cxx && cd ..

# iOS
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ios && pod deintegrate && rm -rf Pods Podfile.lock && pod install && cd ..
```

---

## Libraries in use (high level)

* Navigation: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-reanimated@^3.18.0`
* UI/UX: `react-native-svg`, `react-native-keyboard-aware-scroll-view`, `react-native-keyboard-controller`
* Camera: `react-native-vision-camera` (+ `react-native-worklets-core` if frame processors)
* Media: `react-native-image-crop-picker`
* Dates: `react-native-date-picker@5.0.12`, `date-fns`
* Storage/Net: `@react-native-async-storage/async-storage`, `react-native-encrypted-storage`, `axios`, `react-native-tcp-socket`, `react-native-wifi-reborn`
* Utils: `url-search-params-polyfill`, `use-latest-callback`, `stacktrace-parser`
* Firebase: `@react-native-firebase/app`, `crashlytics`, `messaging`

---
