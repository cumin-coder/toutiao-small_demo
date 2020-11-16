<template>
  <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
  <div id="container"></div>
</template>

<script>
// import echarts from 'echarts'
export default {
  name: 'Bmap',
  mounted () {
    var map = new window.BMap.Map('container') // 创建地图实例
    var point = new window.BMap.Point(116.404, 39.915) // 创建点坐标
    map.centerAndZoom(point, 1) // 初始化地图，设置中心点坐标和地图级别
  }
}
</script>

<style scoped>

</style>
