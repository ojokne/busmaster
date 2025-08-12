const { withInfoPlist, withAndroidManifest } = require("@expo/config-plugins");

function ensurePermissions(androidManifest) {
  const { manifest } = androidManifest;

  // Ensure permissions array exists
  if (!manifest["uses-permission"]) {
    manifest["uses-permission"] = [];
  }

  // Define all the required permissions
  const permissions = [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.BLUETOOTH_CONNECT",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.ACCESS_FINE_LOCATION",
  ];

  // Get existing permissions or initialize with empty array
  const existingPermissions = Array.isArray(manifest["uses-permission"])
    ? manifest["uses-permission"]
        .map((perm) => perm.$?.["android:name"])
        .filter(Boolean)
    : [];

  // Add missing permissions
  permissions.forEach((permission) => {
    if (!existingPermissions.includes(permission)) {
      manifest["uses-permission"].push({
        $: {
          "android:name": permission,
        },
      });
    }
  });

  // Add maxSDKVersion for legacy Bluetooth permissions (optional)
  const legacyPermissions = [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
  ];
  manifest["uses-permission"].forEach((perm) => {
    if (legacyPermissions.includes(perm.$["android:name"])) {
      // Android 12 (API 31) introduces new Bluetooth permissions
      perm.$["android:maxSdkVersion"] = "30";
    }
  });

  // Add uses-feature for Bluetooth if it doesn't exist
  if (!manifest["uses-feature"]) {
    manifest["uses-feature"] = [];
  }

  const existingFeatures = Array.isArray(manifest["uses-feature"])
    ? manifest["uses-feature"]
        .map((feature) => feature.$?.["android:name"])
        .filter(Boolean)
    : [];

  if (!existingFeatures.includes("android.hardware.bluetooth")) {
    manifest["uses-feature"].push({
      $: {
        "android:name": "android.hardware.bluetooth",
        "android:required": "true",
      },
    });
  }

  return androidManifest;
}

module.exports = function withBluetoothPermissions(config) {
  // Step 1: Modify iOS Info.plist for Bluetooth permissions
  config = withInfoPlist(config, (config) => {
    config.modResults = {
      ...config.modResults,
      NSBluetoothAlwaysUsageDescription:
        "We need Bluetooth access to connect to your printer.",
      NSBluetoothPeripheralUsageDescription:
        "We need Bluetooth access to communicate with devices.",
    };
    return config;
  });

  // Step 2: Modify AndroidManifest.xml for Bluetooth permissions
  config = withAndroidManifest(config, (config) => {
    config.modResults = ensurePermissions(config.modResults);
    return config;
  });

  // Return the fully modified config
  return config;
};
