export type RiskLevel = 0 | 1 | 2 | 3;

export const getThemeConfig = (level: RiskLevel) => {
  switch (level) {
    case 0:
      return {
        label: '낮음',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
        gradient: 'from-green-400 to-blue-300',
        message: '평상시 활동이 가능합니다.',
        bgImage: 'linear-gradient(to bottom, #dcfce7, #f0fdf4)', // 맑은 하늘 테마
      };
    case 1:
      return {
        label: '보통',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-500',
        gradient: 'from-yellow-300 to-yellow-100',
        message: '민감한 분은 마스크 착용을 권장합니다.',
        bgImage: 'linear-gradient(to bottom, #fefce8, #fef9c3)', // 약간 흐린 테마
      };
    case 2:
      return {
        label: '높음',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-500',
        gradient: 'from-orange-400 to-orange-200',
        message: '외출 시 마스크 및 보호안경 착용, 귀가 후 즉시 씻기를 권장합니다.',
        bgImage: 'linear-gradient(to bottom, #ffedd5, #fed7aa)', // 꽃가루 날림 테마
      };
    case 3:
      return {
        label: '매우높음',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        gradient: 'from-red-500 to-red-300',
        message: '가급적 외출 자제, 실내 환기 금지, 이상 증세 발생 시 병원 진료 권장.',
        bgImage: 'linear-gradient(to bottom, #fee2e2, #fecaca)', // 긴급 테마
      };
    default:
      return {
        label: '알 수 없음',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-500',
        gradient: 'from-gray-300 to-gray-100',
        message: '데이터를 불러오는 중입니다.',
        bgImage: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
      };
  }
};
