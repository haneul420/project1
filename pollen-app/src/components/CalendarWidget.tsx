import { useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const CalendarWidget = () => {
  const [categories] = useLocalStorage<string[]>('app_categories', []);
  
  // 오늘을 기준으로 2주간의 달력 생성
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 0 });
  
  const days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => addDays(startDate, i));
  }, [startDate]);

  // 임의의 알고리즘으로 날짜마다 농도 생성 (UI용)
  const getRiskIcon = (date: Date) => {
    const day = date.getDate();
    // 가짜 위험도 데이터 생성 로직 (시각적 시연용)
    const isHighRisk = (day % 3 === 0);
    const isNormal = (day % 2 === 0);
    
    if (categories.length === 0) return null;

    return (
      <div className="flex gap-0.5 justify-center mt-1">
        {categories.includes('tree') && (
          <span className={`text-xs ${isHighRisk ? 'opacity-100 drop-shadow-md' : 'opacity-40 grayscale'}`}>🌳</span>
        )}
        {categories.includes('weed') && (
          <span className={`text-xs ${isNormal ? 'opacity-100 drop-shadow-md' : 'opacity-40 grayscale'}`}>🌿</span>
        )}
      </div>
    );
  };

  return (
    <div className="mx-4 mt-6 p-5 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-4 flex flex-col gap-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">주간 꽃가루 요약</h3>
          <p className="text-sm text-gray-500">당신의 맞춤형 알레르기 달력입니다.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-1">
          {categories.length === 0 ? (
            <span className="text-xs text-gray-400">선택된 알레르기 물질이 없습니다. 설정을 확인해주세요.</span>
          ) : (
            <>
              {categories.includes('tree') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200">
                  🌳 수목류 추적 중
                </span>
              )}
              {categories.includes('weed') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold border border-yellow-200">
                  🌿 잡초류 추적 중
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-400">
            {day}
          </div>
        ))}
        
        {days.map(date => {
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          
          return (
            <div 
              key={date.toISOString()} 
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                isToday ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {format(date, 'd')}
              </span>
              {getRiskIcon(date)}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>범례:</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><span className="opacity-100">🌳</span> 수목류 주의</span>
          <span className="flex items-center gap-1"><span className="opacity-100">🌿</span> 잡초류 주의</span>
        </div>
      </div>
    </div>
  );
};
