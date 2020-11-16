<template>
  <div>
    <el-card class="box-card">
      <!--    面包屑导航-->
      <div slot="header" class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--    粉丝列表-->
      <el-tabs v-model="activeName" v-loading="isLoading">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row>
            <el-col
              class="col"
              :span='4'
              v-for="fans in fansList"
              :key="fans.id.toString()"
            >
              <el-image :src="fans.photo" :preview-src-list="imagePreview" class="image"/>
              <!--            <el-avatar :src="fans.photo" />-->
              <p>{{fans.name}}</p>
              <el-button size="mini">+关注</el-button>
            </el-col>
          </el-row>
          <!--    分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :page-size="perPage"
            :total="totalCount"
            @current-change="onCurrentPage"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <h2>百度地图 散点图</h2>
<!--          <sandiantu></sandiantu>-->
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card>
<!--      <Bmap></Bmap>-->
<!--      <BmapDemo></BmapDemo>-->
    </el-card>
    <el-card>
      <Histogram></Histogram>
    </el-card>
  </div>
</template>

<script>
import { $getFansList } from '../../api/fans'
import Histogram from './components/Histogram'
// import Bmap from './components/Bmap'
// import BmapDemo from './components/Bamp-demo'
// import sandiantu from './components/sandiantu'
export default {
  name: 'Fans',
  components: {
    Histogram
    // Bmap,
    // BmapDemo,
    // sandiantu
  },
  data () {
    return {
      activeName: 'first',
      fansList: [], // 粉丝列表
      imagePreview: [], // 点击头像预览大图
      totalCount: 0, // 共多少页
      currentPage: 1, // 当前页
      perPage: 20, // 每页显示多少条
      isLoading: false
    }
  },
  methods: {
    onCurrentPage (page) {
      console.log(page)
      this.currentPage = page
      this.getFansList(page)
    },
    async getFansList (page) {
      this.isLoading = true
      const result = await $getFansList(page, this.perPage)
      const { results, total_count: totalCount } = result.data.data
      this.fansList = results
      this.totalCount = totalCount
      // 将图片的地址放入预览大图数组中
      this.fansList.forEach(fans => {
        this.imagePreview.push(fans.photo)
      })
      this.isLoading = false
    }
  },
  mounted () {
    // 获取粉丝数据
    this.getFansList(1)
  }
}
</script>

<style lang="less" scoped>
.col{
  text-align: center;
  margin: 10px;
  padding: 10px;
  .image{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
