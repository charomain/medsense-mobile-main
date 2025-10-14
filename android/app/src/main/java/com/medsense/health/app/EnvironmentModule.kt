package com.medsense.health.app.mobile

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class EnvironmentModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object { const val NAME = "EnvironmentModule" }

  override fun getName(): String = NAME

  override fun getConstants(): MutableMap<String, Any> {
    val constants = HashMap<String, Any>()
    // These must exist for the active variant (productFlavors/buildTypes)
    constants["apiUrl"] = BuildConfig.API_URL
    constants["appMainFile"] = BuildConfig.APP_MAIN_FILE
    // Static example; change to BuildConfig if you need per-flavor too
    constants["uploadsBaseUrl"] = "https://api.medsense.health"
    return constants
  }
}
