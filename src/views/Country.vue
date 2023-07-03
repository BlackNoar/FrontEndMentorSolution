<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
const params = useRoute()
const country = ref(null)
const bordersCountry = ref(null)
const fetchApi = async () => {
  try {
    const data = await fetch(`https://restcountries.com/v3.1/name/${params.params.name}`)
    const json = await data.json()
    country.value = json[0]
    const borderCountryCodes = json[0]?.borders || []
    const allBorderCountry = await Promise.all(
      borderCountryCodes.map(async (code) => {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
        const data = await response.json()
        return data[0].name.common
      })
    )
    bordersCountry.value = allBorderCountry
  } catch (err) {
    console.log(err)
  }
}
onMounted(() => fetchApi())
const lang = computed(
  () =>
    Object.entries(country.value?.languages)
      .flat()
      .filter((txt) => txt[0] === txt.replace(/[^A-Z]+/g, '')) || []
)
watch(
  () => params.params.name,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      fetchApi()
    }
  }
)
</script>
<template>
  <div
    v-if="country == null"
    class="text-center flex flex-wrap xl:justify-between items-center justify-center min-h-screen"
  >
    <div
      class="w-8 h-8 border-4 border-red-200 rounded-full animate-spin"
      style="border-top-color: transparent"
    ></div>
    <p class="ml-2 w-14 dark:text-white">Loading...</p>
  </div>
  <div v-else class="container mx-auto px-10 pt-16">
    <RouterLink
      class="inline-flex items-center gap-2 py-1 dark:bg-dark-card dark:text-white rounded shadow-xl px-5"
      to="/"
      ><i class="pi pi-arrow-left"> </i> Back</RouterLink
    >
    <div class="flex gap-[80px] items-center mt-20">
      <img :src="country?.flags.svg" class="lg:w-1/2 w-full h-[450px]" :alt="country.name.common" />
      <div class="info-side">
        <!-- Country Name -->
        <h3 class="mb-5 font-bold dark:text-white text-xl">{{ country.name.common }}</h3>
        <!-- Info -->
        <div class="flex justify-between">
          <div class="left flex flex-col gap-2">
            <p v-if="country.name" class="font-medium dark:text-white text-base">
              Native Name: <span class="font-normal ml-2">{{ country.name.common }}</span>
            </p>
            <p v-if="country.population" class="font-medium dark:text-white text-base">
              Population: <span class="font-normal ml-2">{{ country.population }}</span>
            </p>
            <p v-if="country.region" class="font-medium dark:text-white text-base">
              Region: <span class="font-normal ml-2">{{ country.region }}</span>
            </p>
            <p v-if="country.subregion" class="font-medium dark:text-white text-base">
              Sub Region:
              <span class="font-normal dark:text-white ml-2">{{ country.subregion }}</span>
            </p>
            <p v-if="country.capital" class="font-medium dark:text-white text-base">
              Capital: <span class="font-normal ml-2">{{ country?.capital[0] }}</span>
            </p>
          </div>
          <div class="right flex flex-col gap-2">
            <p v-if="country.tld" class="font-medium dark:text-white text-base">
              Top Level Domain:
              <span class="font-normal dark:text-white ml-2">{{ country?.tld[0] }}</span>
            </p>
            <p v-if="country.currencies" class="font-medium dark:text-white text-base">
              Currencies:
              <span class="font-normal dark:text-white ml-2">{{
                Object.keys(country?.currencies)[0]
              }}</span>
            </p>
            <p v-if="country.languages" class="font-medium dark:text-white text-base">
              Language:
              <span class="font-normal dark:text-white" v-for="(l, i) in lang" :key="i">
                {{ l }},
              </span>
            </p>
          </div>
        </div>
        <!-- Border Countries -->
        <div class="flex mt-20 flex-wrap" v-if="bordersCountry">
          <h2 class="mr-3 dark:text-white font-medium">Border Countries</h2>
          <RouterLink
            class="shadow-lg ml-2 dark:bg-dark-card dark:shadow-slate-900 rounded-lg py-1 px-3 dark:text-white inline-block mb-2"
            v-for="(c, i) in bordersCountry"
            :key="i"
            :to="'/' + c"
            >{{ c }},</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>