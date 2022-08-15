import { defineStore } from "pinia";
import { ref } from "vue";

export const useCityStore = defineStore("city", () => {
  const selectedCity = ref();

  function setCity(city: any) {
    selectedCity.value = city;
  }

  return { selectedCity, setCity };
});
