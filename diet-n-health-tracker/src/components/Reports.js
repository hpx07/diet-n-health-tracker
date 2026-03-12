import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
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
    const { endDate } = getDateRangeData();
    const dateMap = new Map();

    for (let i = 0; i < dateRange; i++) {
      const date = format(subDays(endDate, i), 'yyyy-MM-dd');
      dateMap.set(date, { date, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    if (dietEntries && dietEntries.length > 0) {
      dietEntries.forEach(entry => {
        if (entry.date && dateMap.has(entry.date)) {
          const data = dateMap.get(entry.date);
          const multiplier = (entry.quantity || 100) / 100;

          if (entry.nutrition) {
            data.calories += (entry.nutrition.calories || 0) * multiplier;
            data.protein += (entry.nutrition.protein || 0) * multiplier;
            data.carbs += (entry.nutrition.carbs || 0) * multiplier;
            data.fat += (entry.nutrition.fat || 0) * multiplier;
          }
        }
      });
    }

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
    let totals = { protein: 0, carbs: 0, fat: 0 };

    if (dietEntries && dietEntries.length > 0) {
      totals = dietEntries.reduce((acc, entry) => {
        if (entry.nutrition) {
          const multiplier = (entry.quantity || 100) / 100;
          acc.protein += (entry.nutrition.protein || 0) * multiplier;
          acc.carbs += (entry.nutrition.carbs || 0) * multiplier;
          acc.fat += (entry.nutrition.fat || 0) * multiplier;
        }
        return acc;
      }, { protein: 0, carbs: 0, fat: 0 });
    }

    return [
      { name: 'Protein', value: Math.round(totals.protein), color: '#0D9488' },
      { name: 'Carbs', value: Math.round(totals.carbs), color: '#10B981' },
      { name: 'Fat', value: Math.round(totals.fat), color: '#F59E0B' }
    ];
  };

  const getTestTrends = () => {
    const testMap = new Map();

    if (testReports && testReports.length > 0) {
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
    }

    return testMap;
  };

  const getGoalsProgress = () => {
    if (healthGoals && healthGoals.length > 0) {
      return healthGoals.map(goal => ({
        name: goal.title,
        progress: ((goal.currentValue / goal.targetValue) * 100).toFixed(1),
        current: goal.currentValue,
        target: goal.targetValue
      }));
    }
    return [];
  };

  // Get the data
  const nutritionData = getNutritionData();
  const macroData = getMacroDistribution();
  const testTrends = getTestTrends();
  const goalsData = getGoalsProgress();
  const hasNutritionData = nutritionData.some(d => d.calories > 0);
  const hasMacroData = macroData.some(m => m.value > 0);

  const generateCustomReport = () => {
    try {
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
      if (hasNutritionData) {
        const avgCalories = nutritionData.reduce((sum, d) => sum + d.calories, 0) / dateRange;
        const avgProtein = nutritionData.reduce((sum, d) => sum + d.protein, 0) / dateRange;
        const avgCarbs = nutritionData.reduce((sum, d) => sum + d.carbs, 0) / dateRange;
        const avgFat = nutritionData.reduce((sum, d) => sum + d.fat, 0) / dateRange;

        report += `Average Daily Calories: ${Math.round(avgCalories)}\n`;
        report += `Average Daily Protein: ${Math.round(avgProtein)}g\n`;
        report += `Average Daily Carbs: ${Math.round(avgCarbs)}g\n`;
        report += `Average Daily Fat: ${Math.round(avgFat)}g\n\n`;
      } else {
        report += `No nutrition data available for this period\n\n`;
      }

      if (hasMacroData) {
        report += `=== Macro Distribution ===\n`;
        macroData.forEach(macro => {
          report += `${macro.name}: ${macro.value}g\n`;
        });
        report += '\n';
      }

      if (testReports && testReports.length > 0) {
        report += `=== Recent Test Results ===\n`;
        testReports.slice(0, 5).forEach(test => {
          report += `${test.testName}: ${test.value} ${test.unit} [${test.status.toUpperCase()}]\n`;
          report += `  Date: ${format(new Date(test.date), 'MMM dd, yyyy')}\n`;
          report += `  ${test.message}\n\n`;
        });
      }

      if (healthGoals && healthGoals.length > 0) {
        report += `=== Health Goals Progress ===\n`;
        healthGoals.forEach(goal => {
          const progress = ((goal.currentValue / goal.targetValue) * 100).toFixed(1);
          report += `${goal.title}: ${progress}%\n`;
          report += `  Current: ${goal.currentValue} ${goal.unit} | Target: ${goal.targetValue} ${goal.unit}\n`;
          report += `  Due: ${format(new Date(goal.targetDate), 'MMM dd, yyyy')}\n\n`;
        });
      }

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      return 'Error generating report. Please try again.';
    }
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

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '12px'
  };

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
          {!hasNutritionData ? (
            <div className="no-data-card">
              <div className="no-data-icon">📊</div>
              <h4>No Nutrition Data</h4>
              <p>Add diet entries to see your calorie and macro trends here.</p>
            </div>
          ) : (
            <>
              <h3>Calorie Intake Trend</h3>
              <div className="chart-container" style={{ height: '220px', minHeight: '220px' }}>
                <ResponsiveContainer width="99%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#0D9488"
                      strokeWidth={2}
                      dot={{ fill: '#0D9488', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h3>Macronutrients Trend</h3>
              <div className="chart-container" style={{ height: '220px', minHeight: '220px' }}>
                <ResponsiveContainer width="99%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="protein" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488', r: 2 }} />
                    <Line type="monotone" dataKey="carbs" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 2 }} />
                    <Line type="monotone" dataKey="fat" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {hasMacroData && (
                <>
                  <h3>Macro Distribution</h3>
                  <div className="chart-container" style={{ height: '220px', minHeight: '220px' }}>
                    <ResponsiveContainer width="99%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value}g`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value}g`, name]}
                          contentStyle={tooltipStyle}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {reportType === 'tests' && (
        <div className="report-section">
          {testTrends.size === 0 ? (
            <div className="no-data-card">
              <div className="no-data-icon">🩺</div>
              <h4>No Test Data</h4>
              <p>Add test reports to see trends and analytics here.</p>
            </div>
          ) : (
            Array.from(testTrends.entries()).map(([testName, data]) => (
              <div key={testName} className="test-chart">
                <h3>{testName}</h3>
                <div className="chart-container" style={{ height: '200px', minHeight: '200px' }}>
                  <ResponsiveContainer width="99%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0D9488"
                        strokeWidth={2}
                        dot={{ fill: '#0D9488', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {reportType === 'goals' && (
        <div className="report-section">
          <h3>Goals Progress</h3>
          {goalsData.length === 0 ? (
            <div className="no-data-card">
              <div className="no-data-icon">🎯</div>
              <h4>No Goals Set</h4>
              <p>Create health goals to track your progress here.</p>
            </div>
          ) : (
            <div className="chart-container" style={{ height: '280px', minHeight: '280px' }}>
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={goalsData} margin={{ top: 10, right: 10, left: -15, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Progress']}
                    contentStyle={tooltipStyle}
                  />
                  <Bar
                    dataKey="progress"
                    fill="#0D9488"
                    name="Progress %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
