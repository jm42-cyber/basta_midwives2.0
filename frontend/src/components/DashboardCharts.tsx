import { memo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, MapPin } from 'lucide-react';

interface RecordsByCategory {
  immunization: number;
  maternalCare: number;
  familyPlanning: number;
  seniorCitizen: number;
}

interface RecordsByCategoryChartProps {
  data: RecordsByCategory;
}

export const RecordsByCategoryChart = memo(({ data }: RecordsByCategoryChartProps) => {
  const chartData = [
    { name: 'Immunization', value: data.immunization, fill: '#10B981' },
    { name: 'Maternal Care', value: data.maternalCare, fill: '#EC4899' },
    { name: 'Family Planning', value: data.familyPlanning, fill: '#3B82F6' },
    { name: 'Senior Citizens', value: data.seniorCitizen, fill: '#8B5CF6' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Records by Category</h2>
          <p className="text-sm text-gray-600">Total records per program</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300} debounce={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: 'Immunization', value: data.immunization, color: 'bg-emerald-500' },
          { label: 'Maternal', value: data.maternalCare, color: 'bg-pink-500' },
          { label: 'Family', value: data.familyPlanning, color: 'bg-blue-500' },
          { label: 'Senior', value: data.seniorCitizen, color: 'bg-purple-500' },
        ].map((item) => {
          const total = data.immunization + data.maternalCare + data.familyPlanning + data.seniorCitizen;
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700">{item.value}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RecordsByCategoryChart.displayName = 'RecordsByCategoryChart';

interface BarangayCoverageProps {
  barangays: Array<{ id: number; name: string; population: number; records: number }>;
}

export const ProgramDistributionChart = memo(({ barangays }: BarangayCoverageProps) => {
  const coverageData = barangays.map((b) => ({
    name: b.name,
    coverage: b.population > 0
      ? parseFloat(
          Math.min((b.records / b.population) * 100, 100).toFixed(2)
        )
      : 0,
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Barangay Coverage</h2>
          <p className="text-sm text-gray-600">Records per population</p>
        </div>
      </div>

      {barangays.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
          <MapPin className="w-12 h-12 mb-2 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No barangays assigned</p>
          <p className="text-xs text-gray-400">Coverage will appear once barangays are assigned</p>
        </div>
      ) : (
        <>
          {(() => {
            const totalPopulation = barangays.reduce((sum, b) => sum + (b.population || 0), 0);
            const totalRecords = barangays.reduce((sum, b) => sum + (b.records || 0), 0);
            const overallPct = totalPopulation > 0
              ? parseFloat(
                  Math.min((totalRecords / totalPopulation) * 100, 100).toFixed(2)
                )
              : 0;

            return (
              <div className="flex items-center justify-between gap-3 mb-3">
                {/* Coverage progress bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500">Overall Coverage</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {overallPct < 1 && overallPct > 0 ? overallPct.toFixed(2) : Math.round(overallPct)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${overallPct}%` }}
                    />
                  </div>
                </div>
                {/* Barangays assigned badge */}
                <div className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-base font-bold text-emerald-700">{barangays.length}</span>
                  <span className="text-xs text-emerald-600 font-medium">Barangays</span>
                </div>
                {/* Total records badge */}
                <div className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-xl">
                  <span className="text-base font-bold text-primary-700">{totalRecords}</span>
                  <span className="text-xs text-primary-600 font-medium">Records</span>
                </div>
              </div>
            );
          })()}

          <ResponsiveContainer width="100%" height={Math.max(barangays.length * 56, 100)} debounce={200}>
            <BarChart data={coverageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                formatter={(value: number) => [
                  `${value < 1 && value > 0 ? value.toFixed(2) : Math.round(value)}%`,
                  'Coverage Rate'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="coverage"
                fill="#10B981"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>

          {barangays.length > 0 && (() => {
            const ranked = [...barangays]
              .map(b => ({
                name: b.name,
                population: b.population || 0,
                records: b.records || 0,
                coverage: b.population > 0
                  ? parseFloat(
                      Math.min((b.records / b.population) * 100, 100).toFixed(2)
                    )
                  : 0,
              }))
              .sort((a, b) => b.coverage - a.coverage);

            return (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {/* Color legend */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Legend</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-gray-500">High ≥75%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-xs text-gray-500">Medium ≥40%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-xs text-gray-500">Low &lt;40%</span>
                    </div>
                  </div>
                </div>

                {/* Ranked list */}
                <div className="space-y-1">
                  {ranked.map((b, i) => {
                    const dotColor = b.coverage >= 75
                      ? 'bg-emerald-500'
                      : b.coverage >= 40
                      ? 'bg-yellow-400'
                      : 'bg-red-400';
                    const badgeColor = b.coverage >= 75
                      ? 'bg-emerald-50 text-emerald-700'
                      : b.coverage >= 40
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-600';
                    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;

                    return (
                      <div
                        key={b.name}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs w-5 flex-shrink-0">{rankLabel}</span>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                          <span className="text-xs font-semibold text-gray-700 truncate">{b.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-gray-400">{b.population.toLocaleString()} pop.</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${badgeColor}`}>
                            {b.coverage < 1 && b.coverage > 0 ? b.coverage.toFixed(2) : Math.round(b.coverage)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
});

ProgramDistributionChart.displayName = 'ProgramDistributionChart';

interface MonthlyTrendData {
  month: string;
  myRecords: number;
  globalRecords: number;
}

interface MonthlyGrowthChartProps {
  data: MonthlyTrendData[];
}

export const MonthlyGrowthChart = memo(({ data }: MonthlyGrowthChartProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Monthly Growth Trend</h2>
          <p className="text-sm text-gray-600">Records created over time</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280} debounce={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="myRecords"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', r: 5 }}
            activeDot={{ r: 7 }}
            name="My Records"
          />
          <Line
            type="monotone"
            dataKey="globalRecords"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Municipality Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyGrowthChart.displayName = 'MonthlyGrowthChart';
