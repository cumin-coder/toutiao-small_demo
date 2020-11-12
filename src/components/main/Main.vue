<template>
  <!--
        首页展示 /home
        内容管理 /content
        素材管理 /material
        发布文章 /issue
        评论管理 /comment
        粉丝管理 /fans
        个人设置 /settings
  -->

  <el-container class="container">
    <el-aside class="aside" width="auto">
      <Sidebar :isCollapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="left-content">
          <i :class="[ isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold' ]" @click="isCollapse = !isCollapse"></i>
          <span>Cumin有限公司</span>
        </div>
        <div class="right-content">
          <img class='avatar' :src='user.photo' alt="">
          <span class="name">{{user.name}}</span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
           </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from '../sidebar/Sidebar'
import { $getHeader2Name } from '../../api/login'
import { MessageBox } from 'element-ui'
import $globalBus from '../../utils/global-bus'
export default {
  name: 'Main',
  components: {
    Sidebar
  },
  data () {
    return {
      user: {},
      isCollapse: true // 侧边栏简略或全面
    }
  },
  created () {
    // 请求头像和名字Header2Name
    this.getHeaderInfo()
    // 全局事件总线
    $globalBus.$on('user-info', (data) => {
      console.log('user-info', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    Logout () {
      MessageBox.confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 退出成功
        localStorage.removeItem('token')
        this.$router.replace('/login')
      }).catch(() => {})
    },
    handleCommand (command) {
      switch (command) {
        case 'exit' :
          // 退出
          this.Logout()
          break
        case 'setting' :
          console.log('setting')
          break
      }
    },
    async getHeaderInfo () {
      const result = await $getHeader2Name()
      this.user = result.data.data
    }
  }
}
</script>

<style lang="less" scoped>

  .container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .aside{
    }
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;

      .left-content{
        .el-icon-s-fold{
          font-size: 20px;
          margin-right: 10px;
        }
        .el-icon-s-unfold{
          font-size: 20px;
          margin-right: 10px;
        }
      }
      .right-content{
        display: flex;
        align-items: center;
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .name{
          margin-right: 10px;
        }
      }
    }
    .main{
      background: #fff;
    }
  }

</style>
