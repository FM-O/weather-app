import { useFetch } from "@vueuse/core";
import { reactive, ref } from "vue";

export const focusedCoordinates = ref({
  lat: 0,
  lon: 0,
});

export const weatherState = reactive({
  city: "",
  weatherTimeSlots: [],
});

export const useWeather = () => {
  const isWeatherFetching = ref(false);
  const requestError = ref();

  // Types are kinda verbose, would be better to use an interfaced object
  const fetchWeatherByCoords = async (
    {
      lat,
      lon,
    }: {
      lat: number;
      lon: number;
    } = focusedCoordinates.value
  ) => {
    const { isFetching, error, data } = await useFetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=9ca60a667e3c849942c2b0261f7aa955`
    ).json();

    isWeatherFetching.value = isFetching.value;
    requestError.value = error.value;

    const weatherData = formatApiResponse(data.value);

    weatherState.city = weatherData.city;
    weatherState.weatherTimeSlots = weatherData.weatherTimeSlots;

    return data.value;
  };

  const formatApiResponse = (inputWeatherData: any) => {
    const formattedWeatherData = inputWeatherData.list.map((timeSlot: any) => {
      return {
        dt: timeSlot.dt_txt,
        wind: `${timeSlot.wind.speed}km/h`,
        description: timeSlot.weather[0].description,
        temp: `${timeSlot.main.temp}C°`,
        max_temp: `${timeSlot.main.temp_max}C°`,
        min_temp: `${timeSlot.main.temp_min}C°`,
        humidity: `${timeSlot.main.humidity}%`,
      };
    });

    return {
      city: inputWeatherData.city,
      weatherTimeSlots: formattedWeatherData,
    };
  };

  return {
    fetchWeatherByCoords,
    requestError,
    isWeatherFetching,
  };
};
