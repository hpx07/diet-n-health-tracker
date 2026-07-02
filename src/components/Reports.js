import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { dietCalculator } from '../services/dietCalculator';
import { format, subDays } from 'date-fns';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea
} from 'recharts';
import './Reports.css';

// Shared macro palette — must match the progress bar colors in App.css
const COLORS = {
  calories: '#0D9488', // teal    (primary)
  protein: '#8B5CF6',  // violet
  carbs: '#3B82F6',    // blue
  fat: '#F59E0B'       // amber
};

const STATUS_COLORS = {
  normal: '#10B981',
  low: '#F59E0B',
  high: '#F43F5E'
};

const AXIS_TICK = { fontSize: 10, fill: '#94A3B8' };
const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #E2E8F0',
  boxShadow: '0 2px 8px rgba(0,0,0,.09)',
  padding: '6px 10px'
};

const Reports = ({ onNavigate }) => {
  const { userProfile, dietEntries, testReports, healthGoals } = useApp();
  const [reportType, setReportType] = useState('nutrition');
  const [dateRange, setDateRange] = useState(7);

  const rangeStart = format(subDays(new Date(), dateRange - 1), 'yyyy-MM-dd');

  const getNutritionData = () => {
    const endDate = new Date();
    const dateMap = new Map();

    for (let i = dateRange - 1; i >= 0; i--) {
      const date = format(subDays(endDate, i), 'yyyy-MM-dd');
      dateMap.set(date, { date, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    (dietEntries || []).forEach(entry => {
      if (entry.date && dateMap.has(entry.date) && entry.nutrition) {
        const data = dateMap.get(entry.date);
        const multiplier = (Number(entry.quantity) || 100) / 100;
        data.calories += (entry.nutrition.calories || 0) * multiplier;
        data.protein += (entry.nutrition.protein || 0) * multiplier;
        data.carbs += (entry.nutrition.carbs || 0) * multiplier;
        data.fat += (entry.nutrition.fat || 0) * multiplier;
      }
    });

    return Array.from(dateMap.values()).map(d => ({
      ...d,
      displayDate: format(new Date(d.date), 'MMM dd'),
      calories: Math.round(d.calories),
      protein: Math.round(d.protein),
      carbs: Math.round(d.carbs),
      fat: Math.round(d.fat)
    }));
  };

  // Macro split for the SELECTED period only (was previously all-time)
  const getMacroDistribution = () => {
    const totals = (dietEntries || []).reduce((acc, entry) => {
      if (entry.nutrition && entry.date && entry.date >= rangeStart) {
        const multiplier = (Number(entry.quantity) || 100) / 100;
        acc.protein += (entry.nutrition.protein || 0) * multiplier;
        acc.carbs += (entry.nutrition.carbs || 0) * multiplier;
        acc.fat += (entry.nutrition.fat || 0) * multiplier;
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    return [
      { name: 'Protein', value: Math.round(totals.protein), color: COLORS.protein },
      { name: 'Carbs', value: Math.round(totals.carbs), color: COLORS.carbs },
      { name: 'Fat', value: Math.round(totals.fat), color: COLORS.fat }
    ];
  };

  const getTestTrends = () => {
    const testMap = new Map();

    (testReports || []).forEach(report => {
      if (!testMap.has(report.testName)) {
        testMap.set(report.testName, { unit: report.unit, normalRange: report.normalRange, points: [] });
      }
      testMap.get(report.testName).points.push({
        rawDate: report.date,
        date: format(new Date(report.date), 'MMM dd'),
        value: report.value,
        status: report.status
      });
    });

    testMap.forEach(trend => {
      trend.points.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    });

    return testMap;
  };

  const getGoalsProgress = () => {
    return (healthGoals || []).map(goal => ({
      name: goal.title,
      progress: goal.targetValue > 0
        ? Number(((goal.currentValue / goal.targetValue) * 100).toFixed(1))
        : 0,
      current: goal.currentValue,
      target: goal.targetValue,
      unit: goal.unit
    }));
  };

  const nutritionData = getNutritionData();
  const macroData = getMacroDistribution();
  const testTrends = getTestTrends();
  const goalsData = getGoalsProgress();
  const hasNutritionData = nutritionData.some(d => d.calories > 0);
  const hasMacroData = macroData.some(m => m.value > 0);

  const loggedDays = nutritionData.filter(d => d.calories > 0).length;
  const avgOf = (key) => loggedDays > 0
    ? Math.round(nutritionData.reduce((sum, d) => sum + d[key], 0) / loggedDays)
    : 0;

  const hasFullProfile = userProfile?.weight && userProfile?.height && userProfile?.age;
  const dietPlan = hasFullProfile
    ? dietCalculator.generateDietPlan(userProfile, userProfile.goal)
    : null;
  const targetCalories = dietPlan?.targetCalories || null;

  const macroTotal = macroData.reduce((sum, m) => sum + m.value, 0);

  // Resolve gender-specific normal range stored on the report
  const resolveRange = (range) => {
    if (!range) return null;
    if (range.male && range.female) {
      return userProfile?.gender === 'female' ? range.female : range.male;
    }
    return typeof range.min === 'number' ? range : null;
  };

  const TestTrendChart = ({ trend }) => {
    const range = resolveRange(trend.normalRange);
    const values = trend.points.map(p => p.value);
    let lo = Math.min(...values);
    let hi = Math.max(...values);

    let bandLo = null;
    let bandHi = null;
    if (range) {
      bandLo = range.min;
      lo = Math.min(lo, bandLo);
      // Open-ended ranges (e.g. HDL max 999) shouldn't blow up the scale
      if (range.max <= Math.max(hi, range.min) * 3) {
        bandHi = range.max;
        hi = Math.max(hi, bandHi);
      }
    }

    const pad = (hi - lo) * 0.15 || Math.abs(hi) * 0.15 || 1;
    const domain = [Math.max(0, lo - pad), hi + pad];
    const latest = trend.points[trend.points.length - 1];

    const renderDot = (props) => {
      const { cx, cy, payload, index } = props;
      return (
        <circle
          key={`dot-${index}`}
          cx={cx} cy={cy} r={4}
          fill={STATUS_COLORS[payload.status] || COLORS.calories}
          stroke="#fff" strokeWidth={1.5}
        />
      );
    };

    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3>{trend.title}</h3>
          {latest && (
            <span className="test-latest" style={{ color: STATUS_COLORS[latest.status] || 'inherit' }}>
              {latest.value} {trend.unit}
              <span className="test-latest-status" style={{ background: STATUS_COLORS[latest.status] || '#94A3B8' }}>
                {(latest.status || 'n/a').toUpperCase()}
              </span>
            </span>
          )}
        </div>
        {range && (
          <p className="chart-hint">
            Normal range: {range.min}{range.max < 999 ? `–${range.max}` : '+'} {trend.unit}
          </p>
        )}
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trend.points} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} minTickGap={24} />
            <YAxis
              domain={domain}
              tick={AXIS_TICK} tickLine={false} axisLine={false} width={52}
              tickFormatter={(v) => String(Math.round(v * 10) / 10)}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [`${v} ${trend.unit}`, trend.title]}
            />
            {bandLo !== null && (
              <ReferenceArea
                y1={Math.max(bandLo, domain[0])}
                y2={bandHi !== null ? Math.min(bandHi, domain[1]) : domain[1]}
                fill="#10B981" fillOpacity={0.08}
              />
            )}
            {bandLo !== null && bandLo >= domain[0] && (
              <ReferenceLine y={bandLo} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.6} />
            )}
            {bandHi !== null && bandHi <= domain[1] && (
              <ReferenceLine y={bandHi} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.6} />
            )}
            <Line
              type="monotone" dataKey="value"
              stroke={COLORS.calories} strokeWidth={2}
              dot={renderDot} activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
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

      report += `=== Nutrition Summary (avg per logged day) ===\n`;
      if (hasNutritionData) {
        report += `Days logged: ${loggedDays} of ${dateRange}\n`;
        report += `Average Calories: ${avgOf('calories')} kcal\n`;
        report += `Average Protein: ${avgOf('protein')}g\n`;
        report += `Average Carbs: ${avgOf('carbs')}g\n`;
        report += `Average Fat: ${avgOf('fat')}g\n`;
        if (targetCalories) report += `Calorie Target: ${targetCalories} kcal/day\n`;
        report += '\n';
      } else {
        report += `No nutrition data available for this period\n\n`;
      }

      if (hasMacroData) {
        report += `=== Macro Distribution (last ${dateRange} days) ===\n`;
        macroData.forEach(macro => {
          const pct = macroTotal > 0 ? Math.round((macro.value / macroTotal) * 100) : 0;
          report += `${macro.name}: ${macro.value}g (${pct}%)\n`;
        });
        report += '\n';
      }

      if (testReports && testReports.length > 0) {
        report += `=== Recent Test Results ===\n`;
        testReports.slice(0, 5).forEach(test => {
          report += `${test.testName}: ${test.value} ${test.unit} [${(test.status || 'n/a').toUpperCase()}]\n`;
          report += `  Date: ${format(new Date(test.date), 'MMM dd, yyyy')}\n`;
          if (test.message) report += `  ${test.message}\n`;
          report += '\n';
        });
      }

      if (healthGoals && healthGoals.length > 0) {
        report += `=== Health Goals Progress ===\n`;
        healthGoals.forEach(goal => {
          const progress = goal.targetValue > 0
            ? ((goal.currentValue / goal.targetValue) * 100).toFixed(1)
            : '0';
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

  const goTo = (tab) => {
    if (onNavigate) onNavigate(tab);
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
        !hasNutritionData ? (
          <div className="report-section">
            <div className="no-data-card">
              <div className="no-data-icon">📊</div>
              <h4>No Nutrition Data</h4>
              <p>Add diet entries to see your calorie and macro trends here.</p>
              <button onClick={() => goTo('diet')} className="add-data-btn">
                Go to Diet Tracker
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="summary-cards">
              <div className="summary-stat" style={{ '--stat-color': COLORS.calories }}>
                <span className="summary-stat-value">{avgOf('calories')}</span>
                <span className="summary-stat-label">Avg kcal/day</span>
              </div>
              <div className="summary-stat" style={{ '--stat-color': COLORS.protein }}>
                <span className="summary-stat-value">{avgOf('protein')}g</span>
                <span className="summary-stat-label">Avg Protein</span>
              </div>
              <div className="summary-stat" style={{ '--stat-color': COLORS.carbs }}>
                <span className="summary-stat-value">{avgOf('carbs')}g</span>
                <span className="summary-stat-label">Avg Carbs</span>
              </div>
              <div className="summary-stat" style={{ '--stat-color': COLORS.fat }}>
                <span className="summary-stat-value">{avgOf('fat')}g</span>
                <span className="summary-stat-label">Avg Fat</span>
              </div>
            </div>

            <div className="chart-card">
              <h3>Calorie Intake</h3>
              <p className="chart-hint">
                Logged {loggedDays} of the last {dateRange} days
                {targetCalories ? ` · target ${targetCalories} kcal/day` : ''}
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={nutritionData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.calories} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.calories} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="displayDate" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} minTickGap={24} />
                  <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={45} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} kcal`, 'Calories']} />
                  {targetCalories && (
                    <ReferenceLine
                      y={targetCalories}
                      stroke={COLORS.calories}
                      strokeDasharray="6 4"
                      ifOverflow="extendDomain"
                      label={{ value: 'Target', fontSize: 10, fill: COLORS.calories, position: 'insideTopRight' }}
                    />
                  )}
                  <Area
                    type="monotone" dataKey="calories"
                    stroke={COLORS.calories} strokeWidth={2}
                    fill="url(#calGradient)"
                    dot={{ r: 2.5, strokeWidth: 0, fill: COLORS.calories }}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Macronutrient Trends</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={nutritionData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="displayDate" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} minTickGap={24} />
                  <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [`${v}g`, name]} />
                  <Line type="monotone" dataKey="protein" name="Protein" stroke={COLORS.protein} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="carbs" name="Carbs" stroke={COLORS.carbs} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="fat" name="Fat" stroke={COLORS.fat} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: COLORS.protein }} />Protein</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: COLORS.carbs }} />Carbs</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: COLORS.fat }} />Fat</span>
              </div>
            </div>

            {hasMacroData && (
              <div className="chart-card">
                <h3>Macro Distribution</h3>
                <div className="donut-layout">
                  <div className="donut-chart">
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie
                          data={macroData} dataKey="value" nameKey="name"
                          innerRadius="58%" outerRadius="85%"
                          paddingAngle={3} strokeWidth={0}
                          isAnimationActive={false}
                        >
                          {macroData.map((m) => <Cell key={m.name} fill={m.color} />)}
                        </Pie>
                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [`${v}g`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <span className="donut-center-value">{macroTotal}g</span>
                      <span className="donut-center-label">total</span>
                    </div>
                  </div>
                  <div className="donut-legend">
                    {macroData.map((m) => (
                      <div key={m.name} className="donut-legend-row">
                        <span className="legend-dot" style={{ background: m.color }} />
                        <span className="donut-legend-name">{m.name}</span>
                        <span className="donut-legend-val">
                          {m.value}g · {macroTotal > 0 ? Math.round((m.value / macroTotal) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}

      {reportType === 'tests' && (
        testTrends.size === 0 ? (
          <div className="report-section">
            <div className="no-data-card">
              <div className="no-data-icon">🩺</div>
              <h4>No Test Data</h4>
              <p>Add test reports to see trends and analytics here.</p>
              <button onClick={() => goTo('tests')} className="add-data-btn">
                Go to Test Reports
              </button>
            </div>
          </div>
        ) : (
          Array.from(testTrends.entries()).map(([testName, trend]) => (
            <TestTrendChart key={testName} trend={{ ...trend, title: testName }} />
          ))
        )
      )}

      {reportType === 'goals' && (
        <div className="report-section">
          <h3>Goals Progress</h3>
          {goalsData.length === 0 ? (
            <div className="no-data-card">
              <div className="no-data-icon">🎯</div>
              <h4>No Goals Set</h4>
              <p>Create health goals to track your progress here.</p>
              <button onClick={() => goTo('goals')} className="add-data-btn">
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
                    {goal.current} / {goal.target} {goal.unit || ''}
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
