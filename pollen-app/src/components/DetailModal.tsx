import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { usePollenData, useWeatherData } from '../hooks/useData';
import { X, CloudRain, Droplets, Wind, AlertTriangle, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

export const DetailModal = () => {
  const { isDetailModalOpen, closeDetailModal } = useAppStore();
  const [dayOffset, setDayOffset] = useState<number>(0); // -1: 어제, 0: 오늘, 1: 내일
  
  const { data: pollenData, isLoading: isPollenLoading } = usePollenData(dayOffset);
  const { data: weatherData } = useWeatherData();

  // 이전 날짜와의 비교를 위한 데이터 (화살표 시각화 용도)
  const { data: prevPollenData } = usePollenData(dayOffset - 1);

  const averageValue = useMemo(() => {
    if (!pollenData) return 0;
    return Math.round(pollenData.reduce((acc, cur) => acc + cur.value, 0) / pollenData.length);
  }, [pollenData]);

  const prevAverageValue = useMemo(() => {
    if (!prevPollenData) return 0;
    return Math.round(prevPollenData.reduce((acc, cur) => acc + cur.value, 0) / prevPollenData.length);
  }, [prevPollenData]);

  if (!isDetailModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">상세 분석 보고서</h2>
          <button onClick={closeDetailModal} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-10 custom-scrollbar bg-gray-50/50">
          
          {/* 환경 정보 카드 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
            <div className="flex flex-col items-center gap-2">
              <Droplets className="text-blue-500" size={24} />
              <span className="text-xs text-gray-500 font-medium">습도</span>
              <span className="text-sm font-bold text-gray-800">{weatherData?.humidity ? Math.round(weatherData.humidity) : '--'}%</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CloudRain className={weatherData?.rain ? "text-blue-600" : "text-gray-300"} size={24} />
              <span className="text-xs text-gray-500 font-medium">강수</span>
              <span className="text-sm font-bold text-gray-800">{weatherData?.rain ? '있음' : '없음'}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Wind className="text-teal-500" size={24} />
              <span className="text-xs text-gray-500 font-medium">풍속</span>
              <span className="text-sm font-bold text-gray-800">{weatherData?.windSpeed ? Math.round(weatherData.windSpeed) : '--'}m/s</span>
            </div>
          </div>

          {/* 주요 메시지 구역 */}
          <div className="mb-6 space-y-3">
            {weatherData?.rain && (
              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                <CloudRain className="shrink-0 mt-0.5" size={18} />
                <p>오늘은 비가 오니 공기가 비교적 깨끗할 예정입니다.</p>
              </div>
            )}
            {weatherData?.humidity && weatherData.humidity < 40 && (
              <div className="bg-orange-50 border border-orange-100 text-orange-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <p>오늘은 건조하니 알레르기 반응에 더욱 주의하시길 바랍니다.</p>
              </div>
            )}
            {weatherData?.windSpeed && weatherData.windSpeed > 5 && (
              <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                <Wind className="shrink-0 mt-0.5" size={18} />
                <p>바람이 강하게 불어 꽃가루 날림이 심할 수 있습니다. 주의하세요!</p>
              </div>
            )}
          </div>

          {/* 차트 컨트롤 및 비교 */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {[-1, 0, 1].map(offset => (
                <button
                  key={offset}
                  onClick={() => setDayOffset(offset)}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                    dayOffset === offset ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {offset === -1 ? '어제' : offset === 0 ? '오늘' : '내일'}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
              전일 대비
              {averageValue > prevAverageValue ? (
                <span className="flex items-center text-red-500 ml-1"><ArrowUp size={16} />{averageValue - prevAverageValue}</span>
              ) : averageValue < prevAverageValue ? (
                <span className="flex items-center text-green-500 ml-1"><ArrowDown size={16} />{prevAverageValue - averageValue}</span>
              ) : (
                <span className="flex items-center text-gray-400 ml-1"><ArrowRight size={16} />0</span>
              )}
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-64 w-full">
            {isPollenLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pollenData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(time) => format(new Date(time), 'HH시')}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    labelFormatter={(label) => format(new Date(label), 'MM월 dd일 HH시')}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                  <ReferenceLine y={50} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} />
                  <ReferenceLine y={25} stroke="#eab308" strokeDasharray="3 3" opacity={0.5} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 text-right text-xs text-gray-400">
            점선: 농도 위험구간 기준선
          </div>
        </div>
      </div>
    </div>
  );
};
