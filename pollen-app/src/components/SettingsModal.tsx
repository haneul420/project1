import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppStore } from '../store/useAppStore';
import { Check, X, Info } from 'lucide-react';

export const SettingsModal = () => {
  const { isSettingsModalOpen, closeSettingsModal } = useAppStore();
  const [categories, setCategories] = useLocalStorage<string[]>('app_categories', []);
  const [localSelections, setLocalSelections] = useState<string[]>([]);

  useEffect(() => {
    if (isSettingsModalOpen) {
      setLocalSelections(categories);
    }
  }, [isSettingsModalOpen, categories]);

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
    closeSettingsModal();
    window.location.reload();
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-800">카테고리 설정</h2>
          <button onClick={closeSettingsModal} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500 font-medium">관심 있는 알레르기 유발 물질을 선택해주세요.</p>
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
          <p>선택 항목은 저장 시 달력 픽토그램에 즉시 반영됩니다.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={localSelections.length === 0}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-lg disabled:opacity-50 disabled:bg-gray-300 transition-colors"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};
