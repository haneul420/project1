import { Header } from './components/Header';
import { PollenBanner } from './components/PollenBanner';
import { CalendarWidget } from './components/CalendarWidget';
import { DetailModal } from './components/DetailModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { usePollenData } from './hooks/useData';
import { getThemeConfig } from './utils/theme';

function App() {
  const { data } = usePollenData();
  const currentData = data?.[12] || data?.[0];
  const theme = currentData ? getThemeConfig(currentData.level as any) : null;

  return (
    <div 
      className="min-h-screen max-w-md mx-auto bg-gray-50 shadow-2xl relative overflow-hidden transition-colors duration-1000"
      style={theme ? { background: theme.bgImage } : {}}
    >
      <Header />
      
      <main className="pb-10 relative z-0">
        <PollenBanner />
        
        {/* Quick Summary */}
        <div className="mx-4 mt-6">
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl text-center border border-white/50 shadow-sm">
            <span className="font-bold text-gray-800">
              오늘의 위험도 요약:
            </span>{' '}
            <span className="text-gray-700">
              {theme?.label === '낮음' 
                ? '바깥 활동하기 좋은 날씨입니다.' 
                : theme?.label === '보통'
                ? '약간의 꽃가루가 날리니 유의하세요.'
                : '꽃가루가 많습니다. 마스크를 챙기세요!'}
            </span>
          </div>
        </div>

        <CalendarWidget />
      </main>

      <DetailModal />
      <OnboardingModal />
      <SettingsModal />
    </div>
  );
}

export default App;
