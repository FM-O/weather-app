<script setup lang="ts">
import { ref } from "vue";
import { useDebounceFn, useFetch } from "@vueuse/core";

import * as Highcharts from "highcharts";

import {
  focusedCoordinates,
  useWeather,
  weatherState,
} from "@/components/Weather/useWeather";

import { useCityStore } from "@/stores/city";

import AddIcon from "@/components/assets/AddIcon.vue";

//types
type Tcity = {
  country: string;
  lat: number;
  local_names?: object;
  lon: number;
  name: string;
  state: string;
};

// Global component features
const isLoading = ref(false);
const errorInComponent = ref();

// City List feature
const suggestedCapitalCities = ref<Array<Tcity>>([
  {
    country: "FR",
    lat: 48.856613,
    lon: 2.352222,
    name: "Paris",
    state: "Ile-de-France",
  },
  {
    country: "US",
    lat: 40.712776,
    lon: -74.005974,
    name: "New York",
    state: "New York",
  },
  {
    country: "CN",
    lat: 31.230391,
    lon: 121.473701,
    name: "Shanghai",
    state: "East China",
  },
]);

const cityList = ref<Array<Tcity>>([...suggestedCapitalCities.value]);

const cityStore = useCityStore();

const selectCityInList = (index: number) => {
  cityStore.setCity(cityList.value[index]);

  focusedCoordinates.value.lat = cityStore.selectedCity.lat;
  focusedCoordinates.value.lon = cityStore.selectedCity.lon;
};

// City Input feature
const city = ref("");
const cityInput = ref();

const searchCity = useDebounceFn(async () => {
  if (city.value.length <= 2) return;

  const { isFetching, error, data } = await useFetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=5&appid=9ca60a667e3c849942c2b0261f7aa955`
  ).json();

  isLoading.value = isFetching.value;

  errorInComponent.value = error.value;

  cityList.value = data.value;
}, 800);

// Add to series
const { fetchWeatherByCoords } = useWeather();

const addToSeries = async (city: Tcity) => {
  const cityWeatherData = await fetchWeatherByCoords({
    lat: city.lat,
    lon: city.lon,
  });

  weatherState.series.push({
    data: cityWeatherData.list.map((data: any) => {
      const time = new Highcharts.Time({});

      return [
        time.dateFormat("%Y-%m-%d %H:%M:%S", data.dt * 1000),
        data.main.temp,
      ];
    }),
  } as never); // HACK ==== NEED TO CHANGE
};
</script>

<template>
  <div class="cs-form">
    <h2>Search a city from which display the weather:</h2>
    <form>
      <input
        type="text"
        name="city"
        id="city-input"
        v-model="city"
        ref="cityInput"
        @keyup="searchCity"
        :disabled="isLoading"
        placeholder="City name..."
      />
      <div
        class="cs-cities-searched"
        v-if="cityList.length && !errorInComponent"
      >
        <h3>Select a city...</h3>
        <ul>
          <li
            v-for="(city, index) in cityList"
            :key="index"
            @click="selectCityInList(index)"
          >
            <span class="city-desc">
              {{ city.name }}, {{ city.country }}, {{ city.state }}
            </span>
            <span
              v-if="cityStore.selectedCity && weatherState.city"
              class="city-add"
              @click.stop="addToSeries(city)"
            >
              <span> Add city to graph </span>
              <AddIcon />
            </span>
          </li>
        </ul>
      </div>
      <div v-if="errorInComponent || !cityList.length" class="error">
        No city found
      </div>
    </form>
  </div>
</template>

<style scoped>
.cs-form h2 {
  font-size: 1.4rem;
}
.cs-form form {
  margin-top: 0.8rem;
}
#city-input {
  border: 1px solid #cee32d;
  background-color: transparent;
  padding: 1rem;

  min-width: 200px;
  font-size: 1.4rem;
  color: whitesmoke;
}

.cs-cities-searched {
  margin-top: 1rem;
  background-color: white;
  color: #2c2c2c;
}

.cs-cities-searched h3 {
  border-bottom: 2px solid #2c2c2c;
  margin: 0 0.5rem;
  padding: 1rem;
  font-size: 1.4rem;
}

.cs-cities-searched ul {
  padding: 1rem 0;
  list-style: none;
}

.cs-cities-searched ul li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.cs-cities-searched ul li:hover {
  background-color: #cee32d;
}

.city-add {
  display: flex;
  align-items: center;
}

.city-add span {
  margin-right: 0.8rem;
}

.city-add:hover {
  color: #787878;
}

.error {
  margin-top: 1rem;
  font-size: 1.6rem;
  color: #e50000;
  font-weight: 700;
}
</style>
