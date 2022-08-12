<script setup lang="ts">
import { ref } from "vue";
import { useDebounceFn, useFetch } from "@vueuse/core";

import { focusedCoordinates } from "@/components/Weather/useWeather";

//types
type Tcity = {
  country: string;
  lat: number;
  local_names: object;
  lon: number;
  name: string;
  state: string;
};

// Global component features
const isLoading = ref(false);
const errorInComponent = ref();

// City List feature
const suggestedCapitalCities = ref<Array<Tcity>>([]);

const cityList = ref<Array<Tcity>>([]);

const selectedCity = ref();

const selectCityInList = (index: number) => {
  selectedCity.value = cityList.value[index];

  focusedCoordinates.value.lat = selectedCity.value.lat;
  focusedCoordinates.value.lon = selectedCity.value.lon;
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
</script>

<template>
  <form>
    <input
      type="text"
      name="city"
      id="city-input"
      v-model="city"
      ref="cityInput"
      @keyup="searchCity"
      :disabled="isLoading"
    />
    <div v-if="!errorInComponent">
      <ul>
        <li
          v-for="(city, index) in cityList"
          :key="index"
          @click="selectCityInList(index)"
        >
          {{ city.name }}, {{ city.country }}, {{ city.state }}
        </li>
      </ul>
    </div>
  </form>
</template>
