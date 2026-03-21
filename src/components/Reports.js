import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { format, subDays } from 'date-fns';
import './Reports.css';

const Reports = () => {
  const { userProfile, dietEntries, testReports, healthGoals } = useApp();
  const [reportType, setReportType] = useState('nutrition');
  const [dateRange, setDateRange] = useState(7);

  // Debug logging
  console.log('📊 Reports - Data loaded:', {
    dietEntries: dietEntries?.length || 0,
    testReports: testReports?.length || 0,
    healthGoals: healthGoals?.length || 0,
    userProfile: userProfile ? 'Yes' : 'No'
  });

  const getDateRangeData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);
    return { startDate, endDate };
  };

  const getNutritionData = () => {
    const { endDate } = getDateRangeData();
    const dateMap = new Map();

    // Create date range
    for (let i = 0; i < dateRange; i++) {
      const date = format(subDays(endDate, i), 'yyyy-MM-dd');
      dateMap.set(date, { date, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    // Fill with actual data
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

    const result = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        ...d,
        displayDate: format(new Date(d.date), 'MMM dd'),
        calories: Math.round(d.calories),
        protein: Math.round(d.protein),
        carbs: Math.round(d.carbs),
        fat: Math.round(d.fat)
      }));

    console.log('📊 Nutrition data:', result);
    return result;
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

    const result = [
      { name: 'Protein', value: Math.round(totals.protein), color: '#0D9488' },
      { name: 'Carbs', value: Math.round(totals.carbs), color: '#10B981' },
      { name: 'Fat', value: Math.round(totals.fat), color: '#F59E0B' }
    ];

    console.log('📊 Macro data:', result);
    return result;
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

  const nutritionData = getNutritionData();
  const macroData = getMacroDistribution();
  const testTrends = getTestTrends();
  const goalsData = getGoalsProgress();
  const hasNutritionData = nutritionData.some(d => d.calories > 0);
  const hasMacroData = macroData.some(m => m.value > 0);

  // Simple line graph component for single metric
  const LineGraph = ({ data, dataKey, label, color = '#0D9488' }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]), 1);
    const minValue = Math.min(...data.map(d => d[dataKey]), 0);
    const range = maxValue - minValue || 1;
    
    // Calculate points for the line
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item[dataKey] - minValue) / range) * 100;
      return { x, y, value: item[dataKey], date: item.displayDate || item.date };
    });

    // Create SVG path
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="line-graph">
        <div className="line-graph-container">
          <svg className="line-graph-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            
            {/* Area under the line */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={color}
              opacity="0.1"
            />
            
            {/* The line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Data points */}
          <div className="line-graph-points">
            {points.map((point, index) => (
              <div
                key={index}
                className="line-graph-point"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: color
                }}
                title={`${point.date}: ${point.value} ${label}`}
              >
                <span className="point-value">{point.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="line-graph-labels">
          {data.map((item, index) => (
            <div key={index} className="line-graph-label">
              {item.displayDate || item.date}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Multi-line graph component for multiple metrics
  const MultiLineGraph = ({ data, lines }) => {
    const allValues = data.flatMap(d => lines.map(line => d[line.key]));
    const maxValue = Math.max(...allValues, 1);
    const minValue = Math.min(...allValues, 0);
    const range = maxValue - minValue || 1;

    // Calculate points for each line
    const linesPaths = lines.map(line => {
      const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((item[line.key] - minValue) / range) * 100;
        return { x, y, value: item[line.key], date: item.displayDate };
      });

      const pathData = points.map((point, index) => 
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      ).join(' ');

      return { ...line, points, pathData };
    });

    return (
      <div className="multi-line-graph">
        <div className="line-graph-container">
          <svg className="line-graph-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="var(--c-border)" strokeWidth="0.2" opacity="0.5" />
            
            {/* Draw all lines */}
            {linesPaths.map((line, index) => (
              <g key={index}>
                {/* Area under the line */}
                <path
                  d={`${line.pathData} L 100 100 L 0 100 Z`}
                  fill={line.color}
                  opacity="0.05"
                />
                {/* The line */}
                <path
                  d={line.pathData}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
          
          {/* Data points for all lines */}
          {linesPaths.map((line, lineIndex) => (
            <div key={lineIndex} className="line-graph-points">
              {line.points.map((point, index) => (
                <div
                  key={`${lineIndex}-${index}`}
                  className="line-graph-point"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    backgroundColor: line.color,
                    zIndex: lineIndex + 1
                  }}
                  title={`${point.date}: ${line.label} ${point.value}g`}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="line-graph-labels">
          {data.map((item, index) => (
            <div key={index} className="line-graph-label">
              {item.displayDate}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="line-graph-legend">
          {lines.map((line, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: line.color }} />
              <span className="legend-label">{line.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple pie chart component
  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="simple-pie-chart">
        <div className="pie-chart-bars">
          {data.map((item, index) => (
            <div key={index} className="pie-bar">
              <div className="pie-bar-label">{item.name}</div>
              <div className="pie-bar-track">
                <div
                  className="pie-bar-fill"
                  style={{
                    width: `${(item.value / total) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="pie-bar-value">{item.value}g ({((item.value / total) * 100).toFixed(0)}%)</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
              <button 
                onClick={() => window.location.href = '/diet-tracker'} 
                className="add-data-btn"
              >
                Go to Diet Tracker
              </button>
            </div>
          ) : (
            <>
              <h3>Calorie Intake Trend</h3>
              <LineGraph 
                data={nutritionData} 
                dataKey="calories" 
                label="cal"
                color="#0D9488"
              />

              <h3>Macronutrients Trend</h3>
              <MultiLineGraph 
                data={nutritionData}
                lines={[
                  { key: 'protein', label: 'Protein', color: '#0D9488' },
                  { key: 'carbs', label: 'Carbs', color: '#10B981' },
                  { key: 'fat', label: 'Fat', color: '#F59E0B' }
                ]}
              />

              {hasMacroData && (
                <>
                  <h3>Macro Distribution</h3>
                  <PieChart data={macroData} />
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
              <button 
                onClick={() => window.location.href = '/test-reports'} 
                className="add-data-btn"
              >
                Go to Test Reports
              </button>
            </div>
          ) : (
            Array.from(testTrends.entries()).map(([testName, data]) => (
              <div key={testName} className="test-chart">
                <h3>{testName}</h3>
                <div className="test-values">
                  {data.map((point, index) => (
                    <div key={index} className="test-value-item">
                      <span className="test-date">{point.date}</span>
                      <span className={`test-value status-${point.status}`}>{point.value}</span>
                    </div>
                  ))}
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
              <button 
                onClick={() => window.location.href = '/health-goals'} 
                className="add-data-btn"
              >
                Go to Health Goals
              </button>
            </div>
          ) : (
            <div className="goals-list">
              {goalsData.map((goal, index) => (
                <div key={index} className="goal-item">
                  <div className="goal-header">
                    <span className="goal-name">{goal.name}</span>
                    <span className="goal-progress">{goal.progress}%</span>
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-bar-fill"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                  <div className="goal-details">
                    {goal.current} / {goal.target}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
