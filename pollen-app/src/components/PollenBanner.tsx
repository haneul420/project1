import { usePollenData } from '../hooks/useData';
import { getThemeConfig } from '../utils/theme';
import { AlertCircle } from 'lucide-react';

export const PollenBanner = () => {
  const { data, isLoading, isError } = usePollenData();

  if (isLoading) {
    return (
      <div className="mx-4 mt-2 h-40 rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 font-medium">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="mx-4 mt-2 p-6 rounded-2xl bg-red-50 flex items-center gap-3 border border-red-200">
        <AlertCircle className="text-red-500" />
        <span className="text-red-600 font-medium">정보를 가져오는데 실패했습니다.</span>
      </div>
    );
  }

  // 현재 시간과 가장 가까운 데이터 찾기 (mock 데이터의 경우 12번째 인덱스가 현재)
  const currentData = data[12] || data[0];
  const theme = getThemeConfig(currentData.level as any);

  return (
    <div className="px-4 mt-2 relative">
      <div
        className="relative overflow-hidden rounded-3xl p-6 shadow-lg group border border-white/40"
        style={{ background: theme.bgImage }}
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-sm font-bold mb-3 ${theme.color}`}>
              실시간 꽃가루 위험도
            </div>
            <h2 className={`text-4xl font-extrabold ${theme.color} mb-1 drop-shadow-sm`}>
              {theme.label}
            </h2>
            <p className="text-gray-700 font-medium text-sm mt-2 opacity-90 leading-relaxed">
              {theme.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
