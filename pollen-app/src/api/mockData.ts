import { addHours, subDays, startOfHour } from 'date-fns';

export interface PollenData {
  time: string;
  level: number; // 0: 낮음, 1: 보통, 2: 높음, 3: 매우높음
  value: number; // 차트용 구체적인 수치 (0 ~ 100)
}

export interface WeatherData {
  humidity: number;
  rain: boolean;
  windSpeed: number; // m/s
  windDirection: string;
}

// 1시간 단위 24시간 데이터 생성 (오늘, 어제, 내일)
export const generateMockPollenData = (baseDate: Date = new Date(), offsetDays: number = 0): PollenData[] => {
  const data: PollenData[] = [];
  const targetDate = addHours(subDays(startOfHour(baseDate), -offsetDays), -12); // 12시간 전부터 시작

  for (let i = 0; i < 24; i++) {
    const time = addHours(targetDate, i);
    // 시간에 따른 임의의 곡선 생성 (낮에 높고 밤에 낮음)
    const hour = time.getHours();
    const isDay = hour > 6 && hour < 18;
    
    let baseValue = isDay ? 40 + Math.random() * 40 : 10 + Math.random() * 20;
    
    // offsetDays에 따라 전체적인 수치 변화
    baseValue += offsetDays * 10;
    if (baseValue < 0) baseValue = 0;
    if (baseValue > 100) baseValue = 100;

    let level = 0;
    if (baseValue > 75) level = 3;
    else if (baseValue > 50) level = 2;
    else if (baseValue > 25) level = 1;

    data.push({
      time: time.toISOString(),
      level,
      value: Math.round(baseValue),
    });
  }

  return data;
};

export const getMockWeather = (): WeatherData => ({
  humidity: 35 + Math.random() * 40, // 35 ~ 75%
  rain: Math.random() > 0.8, // 20% chance of rain
  windSpeed: 2 + Math.random() * 8, // 2 ~ 10 m/s
  windDirection: 'NW',
});
