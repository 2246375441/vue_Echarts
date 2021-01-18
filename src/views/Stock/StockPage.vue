<!--路由规则 /stockpage-->
<template>
  <div class="com-page">
    <stock></stock>
  </div>
</template>

<script>
import Stock from './Stock'
export default {
  data () {
    return {}
  },
  components: {
    stock: Stock
  }
}
</script>

<style lang="less" scoped>
</style>
