import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { FileText, X, Check } from 'lucide-react';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const CalendarWidget = () => {
  const [categories] = useLocalStorage<string[]>('app_categories', []);
  const [memos, setMemos] = useLocalStorage<Record<string, string>>('app_memos', {});
  
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [memoInput, setMemoInput] = useState<string>('');

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
          <span className={`text-[10px] ${isHighRisk ? 'opacity-100 drop-shadow-md' : 'opacity-40 grayscale'}`}>🌳</span>
        )}
        {categories.includes('weed') && (
          <span className={`text-[10px] ${isNormal ? 'opacity-100 drop-shadow-md' : 'opacity-40 grayscale'}`}>🌿</span>
        )}
      </div>
    );
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDateStr(dateStr);
    setMemoInput(memos[dateStr] || '');
  };

  const handleSaveMemo = () => {
    if (selectedDateStr) {
      if (memoInput.trim() === '') {
        const newMemos = { ...memos };
        delete newMemos[selectedDateStr];
        setMemos(newMemos);
      } else {
        setMemos({ ...memos, [selectedDateStr]: memoInput });
      }
    }
    setSelectedDateStr(null);
  };

  const handleCloseMemo = () => {
    setSelectedDateStr(null);
  };

  return (
    <div className="mx-4 mt-2 mb-10 p-5 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="mb-4 flex flex-col gap-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">주간 알레르기 & 메모 달력</h3>
          <p className="text-sm text-gray-500">원하는 날짜를 눌러 증상이나 메모를 기록하세요.</p>
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

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 relative z-0">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-400">
            {day}
          </div>
        ))}
        
        {days.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isToday = dateStr === format(today, 'yyyy-MM-dd');
          const hasMemo = !!memos[dateStr];
          
          return (
            <div 
              key={date.toISOString()} 
              onClick={() => handleDayClick(date)}
              className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors relative ${
                isToday ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {format(date, 'd')}
              </span>
              {getRiskIcon(date)}
              
              {hasMemo && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  <FileText size={10} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>범례:</span>
        <div className="flex gap-3 items-center">
          <span className="flex items-center gap-1"><span className="opacity-100">🌳</span> 수목류</span>
          <span className="flex items-center gap-1"><span className="opacity-100">🌿</span> 잡초류</span>
          <span className="flex items-center gap-1 text-yellow-600"><FileText size={12} /> 메모 있음</span>
        </div>
      </div>

      {/* 메모 모달 오버레이 */}
      {selectedDateStr && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-sm p-5 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" />
                {selectedDateStr} 메모
              </h4>
              <button onClick={handleCloseMemo} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <textarea
              autoFocus
              value={memoInput}
              onChange={(e) => setMemoInput(e.target.value)}
              placeholder="알레르기 증상이나 복용한 약 등을 기록해보세요..."
              className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm mb-4 bg-gray-50/50"
            />
            
            <button
              onClick={handleSaveMemo}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Check size={18} />
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
