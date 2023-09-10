<script setup lang="ts">
createUi()   // 暗黑高亮主题切换
const { loading, endLoading } = useLoading(true)
const LOADING_INTERVAL = 1500
const BEFORE_LEAVING_MS = 1000
useTimeoutFn(endLoading, LOADING_INTERVAL)
R.axios.post('http://192.168.137.44:8888/api/v1/auth/login', { username: 'lilang', password: '123456' })
  .then(res => {
    console.log(res)
  })
</script>

<template>
  <PreLoadPage v-if="loading" :before-leaving-ms="BEFORE_LEAVING_MS" />
  <RouterView v-else />
</template>
