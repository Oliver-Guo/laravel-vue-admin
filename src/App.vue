<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
.help.is-error {
    color: #ff3860;
}
.imageListGroup{
  margin:10px 0;
  width: 200px;
}
.imageListGroup .ct{
	position:relative;
	background:#999;
}
.imageListGroup .ct img{
	display:block;
}
.imageListGroup .ct button.el-button{
	position:absolute;
	right:5px;
	top:5px;
	z-index:3;
}
.swal2-container{
  z-index:9995
}
.loading-overlay{
  z-index:9995
}
.tag-center{
  line-height: 20px;
}
</style>
