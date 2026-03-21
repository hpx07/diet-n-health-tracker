/**
 * Device Information Utility
 * Collects device and browser information for tracking and security
 */

export const deviceInfoService = {
  /**
   * Get comprehensive device information
   */
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      userAgent,
      platform,
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      device: this.getDeviceType(),
      language,
      screenResolution,
      timezone,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get browser information
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      browser = 'Samsung Internet';
      version = ua.match(/SamsungBrowser\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      browser = 'Opera';
      version = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
      version = ua.match(/rv:(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge (Legacy)';
      version = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge';
      version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }

    return { name: browser, version };
  },

  /**
   * Get operating system information
   */
  getOSInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    let os = 'Unknown';
    let version = 'Unknown';

    if (ua.indexOf('Win') > -1) {
      os = 'Windows';
      if (ua.indexOf('Windows NT 10.0') > -1) version = '10/11';
      else if (ua.indexOf('Windows NT 6.3') > -1) version = '8.1';
      else if (ua.indexOf('Windows NT 6.2') > -1) version = '8';
      else if (ua.indexOf('Windows NT 6.1') > -1) version = '7';
    } else if (ua.indexOf('Mac') > -1) {
      os = 'macOS';
      const match = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
      if (match) {
        version = match[1].replace(/_/g, '.');
      }
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux';
    } else if (ua.indexOf('Android') > -1) {
      os = 'Android';
      const match = ua.match(/Android (\d+\.\d+)/);
      if (match) version = match[1];
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
      os = 'iOS';
      const match = ua.match(/OS (\d+_\d+)/);
      if (match) version = match[1].replace(/_/g, '.');
    }

    return { name: os, version };
  },

  /**
   * Get device type
   */
  getDeviceType() {
    const ua = navigator.userAgent;
    
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  },

  /**
   * Get IP address (requires external API)
   */
  async getIPAddress() {
    try {
      // Try multiple IP detection services for reliability
      const services = [
        'https://api.ipify.org?format=json',
        'https://api.my-ip.io/ip.json',
        'https://ipapi.co/json/'
      ];

      for (const service of services) {
        try {
          const response = await fetch(service, { timeout: 3000 });
          const data = await response.json();
          
          // Different services return IP in different formats
          const ip = data.ip || data.IP || data.query;
          if (ip) {
            return {
              ip,
              service: service.split('/')[2],
              timestamp: new Date().toISOString()
            };
          }
        } catch (err) {
          console.log(`IP service ${service} failed, trying next...`);
          continue;
        }
      }
      
      return {
        ip: 'Unknown',
        error: 'All IP services failed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting IP address:', error);
      return {
        ip: 'Unknown',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Get complete tracking information
   */
  async getTrackingInfo() {
    const deviceInfo = this.getDeviceInfo();
    const ipInfo = await this.getIPAddress();

    return {
      ...deviceInfo,
      ipAddress: ipInfo.ip,
      ipService: ipInfo.service,
      deviceFingerprint: this.generateFingerprint(deviceInfo)
    };
  },

  /**
   * Generate a simple device fingerprint
   */
  generateFingerprint(deviceInfo) {
    const data = `${deviceInfo.userAgent}|${deviceInfo.platform}|${deviceInfo.screenResolution}|${deviceInfo.timezone}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  },

  /**
   * Format device info for display
   */
  formatDeviceInfo(info) {
    if (!info) return 'Unknown Device';
    
    const parts = [];
    
    if (info.device) parts.push(info.device);
    if (info.os?.name) {
      parts.push(info.os.version ? `${info.os.name} ${info.os.version}` : info.os.name);
    }
    if (info.browser?.name) {
      parts.push(info.browser.version ? `${info.browser.name} ${info.browser.version}` : info.browser.name);
    }
    
    return parts.join(' • ') || 'Unknown Device';
  },

  /**
   * Format IP address for display
   */
  formatIPAddress(ip) {
    if (!ip || ip === 'Unknown') return 'IP Not Available';
    return ip;
  }
};
