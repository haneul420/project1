import { useState, useMemo } from 'react';
import { usePollenData, useWeatherData } from '../hooks/useData';
import { CloudRain, Droplets, Wind, AlertTriangle, ArrowUp, ArrowDown, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const DayCard = ({ offset, title }: { offset: number; title: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  const { data: pollenData, isLoading: isPollenLoading } = usePollenData(offset);
  const { data: prevPollenData } = usePollenData(offset - 1);
  const { data: weatherData } = useWeatherData();

  const averageValue = useMemo(() => {
    if (!pollenData) return 0;
    return Math.round(pollenData.reduce((acc, cur) => acc + cur.value, 0) / pollenData.length);
  }, [pollenData]);

  const prevAverageValue = useMemo(() => {
    if (!prevPollenData) return 0;
    return Math.round(prevPollenData.reduce((acc, cur) => acc + cur.value, 0) / prevPollenData.length);
  }, [prevPollenData]);

  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>

        {/* 환경 정보 카드 */}
        <div className="bg-gray-50 rounded-2xl p-3 flex justify-around items-center">
          <div className="flex flex-col items-center gap-1">
            <Droplets className="text-blue-500" size={20} />
            <span className="text-[10px] text-gray-500 font-medium">습도</span>
            <span className="text-xs font-bold text-gray-800">{weatherData?.humidity ? Math.round(weatherData.humidity) : '--'}%</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center gap-1">
            <CloudRain className={weatherData?.rain ? "text-blue-600" : "text-gray-300"} size={20} />
            <span className="text-[10px] text-gray-500 font-medium">강수</span>
            <span className="text-xs font-bold text-gray-800">{weatherData?.rain ? '있음' : '없음'}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center gap-1">
            <Wind className="text-teal-500" size={20} />
            <span className="text-[10px] text-gray-500 font-medium">풍속</span>
            <span className="text-xs font-bold text-gray-800">{weatherData?.windSpeed ? Math.round(weatherData.windSpeed) : '--'}m/s</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
            전일 대비
            {averageValue > prevAverageValue ? (
              <span className="flex items-center text-red-500 ml-1"><ArrowUp size={14} />{averageValue - prevAverageValue}</span>
            ) : averageValue < prevAverageValue ? (
              <span className="flex items-center text-green-500 ml-1"><ArrowDown size={14} />{prevAverageValue - averageValue}</span>
            ) : (
              <span className="flex items-center text-gray-400 ml-1"><ArrowRight size={14} />0</span>
            )}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-xl w-full sm:w-auto"
          >
            {isExpanded ? (
              <>접기 <ChevronUp size={14} /></>
            ) : (
              <>차트 보기 <ChevronDown size={14} /></>
            )}
          </button>
        </div>
      </div>

      {/* 확장 영역 (차트 및 메시지) */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-4">
          
          {/* 주요 메시지 구역 - 오늘 카드에서만 보일지 혹은 다 보일지, 기본적으론 다 동일하게 출력 */}
          <div className="flex flex-col gap-2">
            {weatherData?.rain && (
              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-3 py-2 rounded-xl flex items-start gap-2 text-[11px] leading-tight">
                <CloudRain className="shrink-0" size={14} />
                <p>비가 와서 공기가 비교적 깨끗할 예정입니다.</p>
              </div>
            )}
            {weatherData?.humidity && weatherData.humidity < 40 && (
              <div className="bg-orange-50 border border-orange-100 text-orange-800 px-3 py-2 rounded-xl flex items-start gap-2 text-[11px] leading-tight">
                <AlertTriangle className="shrink-0" size={14} />
                <p>건조하니 알레르기 반응에 주의하세요.</p>
              </div>
            )}
            {weatherData?.windSpeed && weatherData.windSpeed > 5 && (
              <div className="bg-red-50 border border-red-100 text-red-800 px-3 py-2 rounded-xl flex items-start gap-2 text-[11px] leading-tight">
                <Wind className="shrink-0" size={14} />
                <p>바람이 강하게 불어 꽃가루 날림이 심할 수 있습니다.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 h-48 w-full relative">
            {isPollenLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : null}
            
            {pollenData && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pollenData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`colorValue-${offset}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(time) => format(new Date(time), 'HH시')}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    labelFormatter={(label) => format(new Date(label), 'MM월 dd일 HH시')}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                  <ReferenceLine y={50} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} />
                  <ReferenceLine y={25} stroke="#eab308" strokeDasharray="3 3" opacity={0.5} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill={`url(#colorValue-${offset})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="text-right text-[10px] text-gray-400">
            점선: 위험구간 기준선
          </div>
        </div>
      </div>
    </div>
  );
};

export const DetailComparison = () => {
  return (
    <div className="mx-4 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">날짜별 환경 정보 비교</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DayCard offset={-1} title="어제" />
        <DayCard offset={0} title="오늘" />
        <DayCard offset={1} title="내일" />
      </div>
    </div>
  );
};
