<script setup lang="ts">
import HomeView from "@/views/HomeView.vue";
import { useCityStore } from "@/stores/city";

const cityStore = useCityStore();
</script>

<template>
  <header>
    <div class="app-title">
      <span>Granuteo</span> <em>Get your weather anywhere, anytime</em>
    </div>
    <div v-if="cityStore.selectedCity" class="selected-app-city">
      Currently selected city:
      {{ cityStore.selectedCity.name }}
    </div>
  </header>

  <HomeView />
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1;
  margin-bottom: 20px;
}

header .selected-app-city {
  color: whitesmoke;
  font-size: 2.4rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logo {
  margin: 0 2rem 0 0;
}

header span {
  display: block;
  text-transform: uppercase;
  font-size: 4rem;
  font-weight: 700;
}

header em {
  display: block;
  margin-top: 5px;
  font-size: 2.2rem;
  font-style: normal;
}

nav {
  text-align: left;
  margin-left: -1rem;
  font-size: 1rem;

  padding: 1rem 0;
  margin-top: 1rem;
}
</style>
