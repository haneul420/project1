import { useQuery } from '@tanstack/react-query';
import { fetchPollenData, fetchWeatherData } from '../api/apiClient';

export const usePollenData = (dateOffset: number = 0) => {
  return useQuery({
    queryKey: ['pollenData', dateOffset],
    queryFn: () => fetchPollenData(dateOffset),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 5,
  });
};
