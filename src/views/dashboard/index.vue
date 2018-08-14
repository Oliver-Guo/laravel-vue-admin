<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Welcome {{name}}</div>

  </div>
</template>

<script>

export default {
  name: 'dashboard',
  computed: {
    name: function() {
      return this.$store.state.user.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
