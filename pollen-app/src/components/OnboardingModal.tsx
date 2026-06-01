import { useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppStore } from '../store/useAppStore';
import { Check, Info } from 'lucide-react';

export const OnboardingModal = () => {
  const { isOnboardingCompleted, setOnboardingCompleted } = useAppStore();
  const [categories, setCategories] = useLocalStorage<string[]>('app_categories', []);
  const [localSelections, setLocalSelections] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (categories.length > 0) {
      setOnboardingCompleted(true);
    }
  }, [categories, setOnboardingCompleted]);

  const toggleCategory = (cat: string) => {
    if (localSelections.includes(cat)) {
      setLocalSelections(prev => prev.filter(c => c !== cat));
    } else {
      setLocalSelections(prev => [...prev, cat]);
    }
  };

  const handleSave = () => {
    if (localSelections.length === 0) return;
    setCategories(localSelections);
    setOnboardingCompleted(true);
  };

  if (!isMounted || isOnboardingCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">환영합니다!</h2>
          <p className="text-gray-500 text-sm">알레르기 반응이 있는 대상을 선택해주세요.<br/>맞춤형 알림을 제공해 드립니다.</p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { id: 'tree', label: '수목류 (참나무, 소나무 등)', icon: '🌳' },
            { id: 'weed', label: '잡초류 (환삼덩굴, 쑥 등)', icon: '🌿' }
          ].map(item => {
            const isSelected = localSelections.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleCategory(item.id)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-gray-700">{item.label}</span>
                </div>
                {isSelected && <Check className="text-blue-500" size={20} />}
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <Info size={16} className="shrink-0 text-blue-400" />
          <p>선택한 정보는 기기에 안전하게 저장되며 언제든 설정에서 변경할 수 있습니다.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={localSelections.length === 0}
          className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-lg disabled:opacity-50 disabled:bg-gray-300 transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  );
};
