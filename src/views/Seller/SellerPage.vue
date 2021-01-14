<!--路由规则 /sellerpage-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from './Seller.vue'
export default {
  name: 'SellerPage',
  components: {
    seller: Seller
  }
}
</script>

<style scoped>

</style>
