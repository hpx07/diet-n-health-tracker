import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

class MobileNotificationService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    if (this.isNative) {
      await this.initializeNativeNotifications();
    } else {
      await this.initializeWebNotifications();
    }

    this.initialized = true;
  }

  async initializeNativeNotifications() {
    try {
      // Request permissions for local notifications
      const localPermission = await LocalNotifications.requestPermissions();
      console.log('Local notification permission:', localPermission.display);

      // Listen for notification actions
      await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
      });

      // Skip push notifications for now - they require Firebase setup
      console.log('Push notifications skipped (requires Firebase configuration)');

    } catch (error) {
      console.error('Error initializing native notifications:', error);
      // Don't throw - allow app to continue
    }
  }

  async initializeWebNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  async sendNotification(title, body, options = {}) {
    try {
      if (this.isNative) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
              sound: 'default',
              smallIcon: 'ic_stat_icon_config_sample',
              iconColor: '#4CAF50',
              ...options
            }
          ]
        });
      } else {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/logo192.png',
            badge: '/logo192.png',
            ...options
          });
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async scheduleNotification(title, body, scheduleTime, id) {
    if (!this.isNative) {
      console.log('Scheduled notifications only work on native platforms');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: id || Date.now(),
            schedule: { at: scheduleTime },
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#4CAF50'
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async checkDailyGoals(dailyIntake, targetMacros) {
    const percentComplete = (dailyIntake.calories / targetMacros.calories) * 100;

    if (percentComplete < 50) {
      await this.sendNotification(
        'Diet Reminder 🍽️',
        `You've only consumed ${Math.round(percentComplete)}% of your daily calories. Don't forget to eat!`
      );
    } else if (percentComplete > 110) {
      await this.sendNotification(
        'Calorie Alert ⚠️',
        `You've exceeded your daily calorie goal by ${Math.round(percentComplete - 100)}%`
      );
    } else if (percentComplete >= 90 && percentComplete <= 110) {
      await this.sendNotification(
        'Great Job! 🎉',
        `You're right on track with your daily calorie goal!`
      );
    }
  }

  async checkTestResults(testResults) {
    const abnormalTests = testResults.filter(test => test.status !== 'normal');
    
    if (abnormalTests.length > 0) {
      await this.sendNotification(
        'Health Alert 🩺',
        `You have ${abnormalTests.length} test result(s) outside normal range. Please review.`,
        { priority: 5 }
      );
    }
  }

  async remindWaterIntake() {
    await this.sendNotification(
      'Hydration Reminder 💧',
      'Time to drink some water! Stay hydrated throughout the day.'
    );
  }

  async remindMealTime(mealType) {
    await this.sendNotification(
      `${mealType} Time 🍴`,
      `Don't forget to log your ${mealType.toLowerCase()} and track your nutrition!`
    );
  }

  async scheduleWaterReminders() {
    if (!this.isNative) return;

    const now = new Date();
    const reminders = [];

    // Schedule water reminders every 2 hours from 8 AM to 10 PM
    for (let hour = 8; hour <= 22; hour += 2) {
      const reminderTime = new Date(now);
      reminderTime.setHours(hour, 0, 0, 0);
      
      if (reminderTime > now) {
        reminders.push({
          title: 'Hydration Reminder 💧',
          body: 'Time to drink some water!',
          id: 1000 + hour,
          schedule: { at: reminderTime, repeats: true, every: 'day' },
          sound: 'default'
        });
      }
    }

    try {
      await LocalNotifications.schedule({ notifications: reminders });
      console.log(`Scheduled ${reminders.length} water reminders`);
    } catch (error) {
      console.error('Error scheduling water reminders:', error);
    }
  }

  async scheduleMealReminders(preferences = {}) {
    if (!this.isNative) return;

    const meals = [
      { type: 'Breakfast', time: preferences.breakfastTime || '08:00', id: 2001 },
      { type: 'Lunch', time: preferences.lunchTime || '13:00', id: 2002 },
      { type: 'Dinner', time: preferences.dinnerTime || '19:00', id: 2003 }
    ];

    const reminders = meals.map(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime < new Date()) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      return {
        title: `${meal.type} Time 🍴`,
        body: `Don't forget to log your ${meal.type.toLowerCase()}!`,
        id: meal.id,
        schedule: { at: reminderTime, repeats: true, every: 'day' },
        sound: 'default'
      };
    });

    try {
      await LocalNotifications.schedule({ notifications: reminders });
      console.log('Meal reminders scheduled');
    } catch (error) {
      console.error('Error scheduling meal reminders:', error);
    }
  }

  async cancelAllNotifications() {
    if (this.isNative) {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
      } catch (error) {
        console.error('Error canceling notifications:', error);
      }
    }
  }

  async scheduleAllReminders(preferences = {}) {
    await this.cancelAllNotifications();
    
    if (preferences.waterReminder !== false) {
      await this.scheduleWaterReminders();
    }
    
    if (preferences.mealReminders !== false) {
      await this.scheduleMealReminders(preferences);
    }
  }
}

export const mobileNotificationService = new MobileNotificationService();
