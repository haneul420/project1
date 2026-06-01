import { MapPin, Settings } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppStore } from '../store/useAppStore';

const LOCATIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

export const Header = () => {
  const [location, setLocation] = useLocalStorage<string>('app_location', '서울');
  const { openSettingsModal } = useAppStore();

  return (
    <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <MapPin className="text-blue-500" size={20} />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent text-lg font-bold outline-none text-gray-800 cursor-pointer"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500 font-medium">
          꽃가루 알림 웹
        </div>
        <button 
          onClick={openSettingsModal}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          title="설정 (카테고리 변경)"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
