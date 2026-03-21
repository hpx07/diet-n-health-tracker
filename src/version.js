// Application Version Information
export const APP_VERSION = {
  version: '1.0.0',
  buildNumber: 1,
  releaseDate: '2026-01-22',
  versionName: '1.0.0 (Initial Release)',
  buildDate: '2026-01-22T16:30:45+05:30',
  
  // Platform versions
  platforms: {
    web: '1.0.0',
    android: '1.0.0',
    ios: 'Not Available'
  },
  
  // Feature versions
  features: {
    dietTracking: '1.0.0',
    healthTests: '1.0.0',
    goals: '1.0.0',
    reports: '1.0.0',
    notifications: '1.0.0',
    offlineSupport: '1.0.0',
    authentication: '1.0.0',
    userProfile: '1.0.0'
  },
  
  // Get formatted version string
  getVersionString() {
    return `v${this.version} (Build ${this.buildNumber})`;
  },
  
  // Get full version info
  getFullVersionInfo() {
    return {
      version: this.version,
      buildNumber: this.buildNumber,
      releaseDate: this.releaseDate,
      versionName: this.versionName,
      buildDate: this.buildDate
    };
  },
  
  // Check if feature is available
  hasFeature(featureName) {
    return this.features.hasOwnProperty(featureName);
  },
  
  // Get feature version
  getFeatureVersion(featureName) {
    return this.features[featureName] || 'Unknown';
  }
};

export default APP_VERSION;
