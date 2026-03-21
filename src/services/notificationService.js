export const notificationService = {
  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },

  sendNotification(title, body, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo192.png',
        ...options
      });
    }
  },

  checkDailyGoals(dailyIntake, targetMacros) {
    const percentComplete = (dailyIntake.calories / targetMacros.calories) * 100;

    if (percentComplete < 50) {
      this.sendNotification(
        'Diet Reminder',
        `You've only consumed ${Math.round(percentComplete)}% of your daily calories. Don't forget to eat!`
      );
    } else if (percentComplete > 110) {
      this.sendNotification(
        'Calorie Alert',
        `You've exceeded your daily calorie goal by ${Math.round(percentComplete - 100)}%`
      );
    }
  },

  checkTestResults(testResults, userProfile) {
    const abnormalTests = testResults.filter(test => test.status !== 'normal');
    
    if (abnormalTests.length > 0) {
      this.sendNotification(
        'Health Alert',
        `You have ${abnormalTests.length} test result(s) outside normal range. Please review.`
      );
    }
  },

  remindWaterIntake() {
    this.sendNotification(
      'Hydration Reminder',
      'Time to drink some water! Stay hydrated throughout the day.'
    );
  },

  remindMealTime(mealType) {
    this.sendNotification(
      `${mealType} Time`,
      `Don't forget to log your ${mealType.toLowerCase()} and track your nutrition!`
    );
  },

  scheduleReminders(preferences) {
    // Clear existing reminders
    this.clearReminders();

    if (preferences.waterReminder) {
      // Water reminder every 2 hours
      this.waterInterval = setInterval(() => {
        this.remindWaterIntake();
      }, 2 * 60 * 60 * 1000);
    }

    if (preferences.mealReminders) {
      // Meal reminders at specific times
      this.scheduleMealReminder('Breakfast', preferences.breakfastTime || '08:00');
      this.scheduleMealReminder('Lunch', preferences.lunchTime || '13:00');
      this.scheduleMealReminder('Dinner', preferences.dinnerTime || '19:00');
    }
  },

  scheduleMealReminder(mealType, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime - now;

    setTimeout(() => {
      this.remindMealTime(mealType);
      // Repeat daily
      setInterval(() => {
        this.remindMealTime(mealType);
      }, 24 * 60 * 60 * 1000);
    }, timeUntilReminder);
  },

  clearReminders() {
    if (this.waterInterval) {
      clearInterval(this.waterInterval);
    }
  }
};
