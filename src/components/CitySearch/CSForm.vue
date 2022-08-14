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
        class="cs-cities-suggested"
        v-if="cityList.length && !errorInComponent"
      >
        <h3>Select a city...</h3>
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

.cs-cities-suggested {
  margin-top: 1rem;
  background-color: white;
  color: #2c2c2c;
}

.cs-cities-suggested h3 {
  border-bottom: 2px solid #2c2c2c;
  margin: 0 0.5rem;
  padding: 1rem;
  font-size: 1.4rem;
}

.cs-cities-suggested ul {
  padding: 1rem 0;
  list-style: none;
}

.cs-cities-suggested ul li {
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.cs-cities-suggested ul li:hover {
  background-color: #cee32d;
}
</style>
