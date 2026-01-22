import React from 'react';
import { APP_VERSION } from '../version';
import './About.css';

const About = () => {
  const versionInfo = APP_VERSION.getFullVersionInfo();

  return (
    <div className="about-container">
      <div className="about-header">
        <h2>About Diet-N-Health Tracker</h2>
        <div className="version-display">
          <span className="version-number">Version {versionInfo.version}</span>
          <span className="build-number">Build {versionInfo.buildNumber}</span>
        </div>
      </div>

      <div className="about-section">
        <h3>📱 Application Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Version:</label>
            <span>{versionInfo.version}</span>
          </div>
          <div className="info-item">
            <label>Build Number:</label>
            <span>{versionInfo.buildNumber}</span>
          </div>
          <div className="info-item">
            <label>Release Date:</label>
            <span>{new Date(versionInfo.releaseDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Build Date:</label>
            <span>{new Date(versionInfo.buildDate).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h3>🌐 Platform Versions</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Web:</label>
            <span className="status-badge status-active">{APP_VERSION.platforms.web}</span>
          </div>
          <div className="info-item">
            <label>Android:</label>
            <span className="status-badge status-active">{APP_VERSION.platforms.android}</span>
          </div>
          <div className="info-item">
            <label>iOS:</label>
            <span className="status-badge status-inactive">{APP_VERSION.platforms.ios}</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h3>✨ Features</h3>
        <div className="features-grid">
          {Object.entries(APP_VERSION.features).map(([key, version]) => (
            <div key={key} className="feature-item">
              <span className="feature-name">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="feature-version">v{version}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h3>📚 Documentation</h3>
        <div className="links-list">
          <a href="#" className="doc-link">📖 User Guide</a>
          <a href="#" className="doc-link">🔧 Setup Instructions</a>
          <a href="#" className="doc-link">📱 Mobile App Guide</a>
          <a href="#" className="doc-link">🔔 Notification Settings</a>
        </div>
      </div>

      <div className="about-section">
        <h3>ℹ️ About</h3>
        <p className="about-text">
          Diet-N-Health Tracker is a comprehensive health and diet tracking application 
          designed to help you monitor your nutrition, track health tests, set goals, 
          and achieve your wellness objectives.
        </p>
        <p className="about-text">
          Built with React and Capacitor, this app provides a seamless experience 
          across web and mobile platforms with offline support and smart notifications.
        </p>
      </div>

      <div className="about-section">
        <h3>📞 Support</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Email:</label>
            <span>support@your-domain.com</span>
          </div>
          <div className="info-item">
            <label>Website:</label>
            <span>https://your-domain.com</span>
          </div>
        </div>
      </div>

      <div className="about-footer">
        <p>© 2026 Diet-N-Health Tracker. All rights reserved.</p>
        <p className="license">Licensed under MIT License</p>
      </div>
    </div>
  );
};

export default About;
