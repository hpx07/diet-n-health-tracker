import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import './Reports.css';

const Reports = () => {
  const { userProfile, dietEntries, testReports, healthGoals } = useApp();
  const [reportType, setReportType] = useState('nutrition');
  const [dateRange, setDateRange] = useState(7);

  const getDateRangeData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);
    return { startDate, endDate };
  };

  const getNutritionData = () => {
    const { startDate, endDate } = getDateRangeData();
    const dateMap = new Map();

    for (let i = 0; i < dateRange; i++) {
      const date = format(subDays(endDate, i), 'yyyy-MM-dd');
      dateMap.set(date, { date, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    dietEntries.forEach(entry => {
      if (dateMap.has(entry.date)) {
        const data = dateMap.get(entry.date);
        const multiplier = entry.quantity / 100;
        data.calories += entry.nutrition.calories * multiplier;
        data.protein += entry.nutrition.protein * multiplier;
        data.carbs += entry.nutrition.carbs * multiplier;
        data.fat += entry.nutrition.fat * multiplier;
      }
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        ...d,
        date: format(new Date(d.date), 'MMM dd'),
        calories: Math.round(d.calories),
        protein: Math.round(d.protein),
        carbs: Math.round(d.carbs),
        fat: Math.round(d.fat)
      }));
  };

  const getMacroDistribution = () => {
    const totals = dietEntries.reduce((acc, entry) => {
      const multiplier = entry.quantity / 100;
      acc.protein += entry.nutrition.protein * multiplier;
      acc.carbs += entry.nutrition.carbs * multiplier;
      acc.fat += entry.nutrition.fat * multiplier;
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    return [
      { name: 'Protein', value: Math.round(totals.protein), color: '#f093fb' },
      { name: 'Carbs', value: Math.round(totals.carbs), color: '#4facfe' },
      { name: 'Fat', value: Math.round(totals.fat), color: '#43e97b' }
    ];
  };

  const getTestTrends = () => {
    const testMap = new Map();

    testReports.forEach(report => {
      if (!testMap.has(report.testName)) {
        testMap.set(report.testName, []);
      }
      testMap.get(report.testName).push({
        date: format(new Date(report.date), 'MMM dd'),
        value: report.value,
        status: report.status
      });
    });

    return testMap;
  };

  const getGoalsProgress = () => {
    return healthGoals.map(goal => ({
      name: goal.title,
      progress: ((goal.currentValue / goal.targetValue) * 100).toFixed(1),
      current: goal.currentValue,
      target: goal.targetValue
    }));
  };

  const generateCustomReport = () => {
    const nutritionData = getNutritionData();
    const macroData = getMacroDistribution();
    const goalsData = getGoalsProgress();

    let report = `Health & Diet Report\n`;
    report += `Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}\n`;
    report += `Period: Last ${dateRange} days\n\n`;

    if (userProfile) {
      report += `=== User Profile ===\n`;
      report += `Name: ${userProfile.name}\n`;
      report += `Age: ${userProfile.age} | Gender: ${userProfile.gender}\n`;
      report += `Height: ${userProfile.height}cm | Weight: ${userProfile.weight}kg\n`;
      report += `Goal: ${userProfile.goal}\n\n`;
    }

    report += `=== Nutrition Summary ===\n`;
    const avgCalories = nutritionData.reduce((sum, d) => sum + d.calories, 0) / dateRange;
    const avgProtein = nutritionData.reduce((sum, d) => sum + d.protein, 0) / dateRange;
    const avgCarbs = nutritionData.reduce((sum, d) => sum + d.carbs, 0) / dateRange;
    const avgFat = nutritionData.reduce((sum, d) => sum + d.fat, 0) / dateRange;
    
    report += `Average Daily Calories: ${Math.round(avgCalories)}\n`;
    report += `Average Daily Protein: ${Math.round(avgProtein)}g\n`;
    report += `Average Daily Carbs: ${Math.round(avgCarbs)}g\n`;
    report += `Average Daily Fat: ${Math.round(avgFat)}g\n\n`;

    report += `=== Macro Distribution ===\n`;
    macroData.forEach(macro => {
      report += `${macro.name}: ${macro.value}g\n`;
    });
    report += '\n';

    if (testReports.length > 0) {
      report += `=== Recent Test Results ===\n`;
      testReports.slice(0, 5).forEach(test => {
        report += `${test.testName}: ${test.value} ${test.unit} [${test.status.toUpperCase()}]\n`;
        report += `  Date: ${format(new Date(test.date), 'MMM dd, yyyy')}\n`;
        report += `  ${test.message}\n\n`;
      });
    }

    if (healthGoals.length > 0) {
      report += `=== Health Goals Progress ===\n`;
      healthGoals.forEach(goal => {
        const progress = ((goal.currentValue / goal.targetValue) * 100).toFixed(1);
        report += `${goal.title}: ${progress}%\n`;
        report += `  Current: ${goal.currentValue} ${goal.unit} | Target: ${goal.targetValue} ${goal.unit}\n`;
        report += `  Due: ${format(new Date(goal.targetDate), 'MMM dd, yyyy')}\n\n`;
      });
    }

    return report;
  };

  const handleDownloadReport = () => {
    const report = generateCustomReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nutritionData = getNutritionData();
  const macroData = getMacroDistribution();
  const testTrends = getTestTrends();
  const goalsData = getGoalsProgress();

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <button onClick={handleDownloadReport} className="download-btn">
          📥 Download Report
        </button>
      </div>

      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="nutrition">Nutrition Trends</option>
            <option value="tests">Test Results</option>
            <option value="goals">Goals Progress</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {reportType === 'nutrition' && (
        <div className="report-section">
          <h3>Calorie Intake Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <h3>Macronutrients Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="protein" stroke="#f093fb" strokeWidth={2} />
              <Line type="monotone" dataKey="carbs" stroke="#4facfe" strokeWidth={2} />
              <Line type="monotone" dataKey="fat" stroke="#43e97b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <h3>Macro Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}g`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportType === 'tests' && (
        <div className="report-section">
          {testTrends.size === 0 ? (
            <p className="no-data">No test data available</p>
          ) : (
            Array.from(testTrends.entries()).map(([testName, data]) => (
              <div key={testName} className="test-chart">
                <h3>{testName}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))
          )}
        </div>
      )}

      {reportType === 'goals' && (
        <div className="report-section">
          <h3>Goals Progress</h3>
          {goalsData.length === 0 ? (
            <p className="no-data">No goals set</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={goalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#667eea" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
