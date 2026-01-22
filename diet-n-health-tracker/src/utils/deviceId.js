import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = () => {
  try {
    let deviceId = localStorage.getItem('deviceId');
    
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error accessing localStorage for deviceId:', error);
    // Return a temporary ID if localStorage fails
    return 'temp-' + Date.now();
  }
};

export const getUserIdentifier = () => {
  try {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail || getDeviceId();
  } catch (error) {
    console.error('Error getting user identifier:', error);
    return 'temp-user-' + Date.now();
  }
};
