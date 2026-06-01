import axios from 'axios';
import { generateMockPollenData, getMockWeather, type PollenData, type WeatherData } from './mockData';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const POLLEN_API_KEY = import.meta.env.VITE_POLLEN_API_KEY;

// API가 준비되지 않았을 경우 (키가 없거나 에러 발생 시) Mock 데이터를 반환합니다.
export const fetchPollenData = async (dateOffset: number = 0): Promise<PollenData[]> => {
  if (!POLLEN_API_KEY) {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockPollenData(new Date(), dateOffset)), 500);
    });
  }

  try {
    // 실제 공공데이터포털 API 연동 부분 (예시)
    // 실제 API는 1시간 단위 데이터를 제공하지 않는 경우가 많으므로
    // 여기서는 예시로 호출하고 실제 환경에서는 Mock 데이터와 혼합/보간해야 합니다.
    const response = await axios.get('/api/pollen/getPollenRiskIdxV3', {
      params: {
        serviceKey: POLLEN_API_KEY,
        pageNo: 1,
        numOfRows: 10,
        dataType: 'JSON',
        areaNo: '1100000000', // 서울 기본값
        time: new Date().toISOString().slice(0, 10).replace(/-/g, '') + '06',
      }
    });
    
    // 응답이 정상이면 파싱 로직 추가 (현재는 데이터가 불충분할 수 있으므로 mock 데이터 혼합)
    // 실제 사용 시 response.data 파싱
    console.log('Pollen API Response:', response.data);
    return generateMockPollenData(new Date(), dateOffset); 
  } catch (error) {
    console.warn('Pollen API fetch failed, using mock data', error);
    return generateMockPollenData(new Date(), dateOffset);
  }
};

export const fetchWeatherData = async (): Promise<WeatherData> => {
  if (!WEATHER_API_KEY) {
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockWeather()), 500);
    });
  }

  try {
    const response = await axios.get('/api/weather/getVilageFcst', {
      params: {
        serviceKey: WEATHER_API_KEY,
        pageNo: 1,
        numOfRows: 10,
        dataType: 'JSON',
        base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        base_time: '0500',
        nx: 60, // 서울 X
        ny: 127 // 서울 Y
      }
    });
    console.log('Weather API Response:', response.data);
    return getMockWeather(); // 실제 파싱 전까지는 mock 사용
  } catch (error) {
    console.warn('Weather API fetch failed, using mock data', error);
    return getMockWeather();
  }
};
