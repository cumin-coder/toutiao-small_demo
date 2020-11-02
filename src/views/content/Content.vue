<template>
    <div>
      <el-card class="box-card">
        <!--面包屑导航-->
        <div slot="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!--内容管理-->
        <el-form ref="form" size='mini' :model="form" label-width="80px">
          <el-form-item label="状态">
            <el-radio-group v-model="form.statusId">
              <el-radio :label="null">全部</el-radio>
              <el-radio
                v-for="item in status"
                :key="item.id"
                :label="item.id"
              >{{item.text}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="频道">
            <el-select v-model="form.channel_id" placeholder="请选择频道">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="channel in form.channels"
                :key="channel.id"
                :label="channel.name"
                :value="channel.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.rangeDate"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="--"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTextInfo(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            根据筛选条件共查询到条结果: {{totalCount}}
          </el-breadcrumb>
        </div>
        <!--表格信息-->
        <el-table
          :data="content"
          style="width: 100%"
          size="mini"
          v-loading="isLoading"
        >
          <el-table-column
            prop="date"
            label="封面"
            >
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover.images[0]"
                :preview-src-list="srcList"
                @click.native="clickAvatar(scope.row.cover.images)"
                class="avatar"
              >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            >
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="status[scope.row.status].type">{{status[scope.row.status].text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-edit" circle @click="$router.replace(`/issue?id=${scope.row.id}`)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delArticle(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="pageSize"
          @current-change="clickCurrentChange"
          :current-page.sync="currentPage"
        >
      </el-pagination>
    </div>
</template>

<script>
import { $textInfo, $getTextChannel, $DeleteArticle } from '../../api/content'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Content',
  data: function () {
    return {
      form: {
        statusId: null, // 文章状态筛选
        channels: [], // 频道大全
        rangeDate: null, // 筛选日期
        channel_id: null // 频道筛选
      },
      content: [], // 全部内容
      status: [
        { id: 0, type: '', text: '草稿' },
        { id: 1, type: 'info', text: '待审核' },
        { id: 2, type: 'success', text: '审核通过' },
        { id: 3, type: 'warning', text: '审核失败' }
      ], // 审核状态
      srcList: ['https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2382124539,922770330&fm=26&gp=0.jpg'], // 预览大图地址
      totalCount: 0, // 总条数
      pageSize: 10, // 当前页面显示几条
      currentPage: 1, // 当前页数
      isLoading: true
    }
  },
  methods: {
    clickAvatar (src) {
      if (src.length > 0) {
        this.srcList = src
      }
    },
    clickCurrentChange (page) {
      // 切换页码时, v-Loading效果显示
      this.isLoading = true
      // 每次点击切换新页码时, 重新请求新页码数据
      this.getTextInfo(page)
    },
    // 请求文章数据
    async getTextInfo (page = 1) {
      const result = await $textInfo({
        page,
        per_page: this.pageSize,
        status: this.form.statusId,
        channel_id: this.form.channel_id,
        begin_pubdate: this.form.rangeDate ? this.form.rangeDate[0] : null,
        end_pubdate: this.form.rangeDate ? this.form.rangeDate[1] : null
      })
      const { results, per_page: perPage, total_count: totalCount } = result.data.data

      // 完成请求 取消loading效果
      this.isLoading = false
      this.content = results
      this.pageSize = perPage
      this.totalCount = totalCount
    },
    async getTextChannel () {
      const result = await $getTextChannel()
      const { channels } = result.data.data
      this.form.channels = channels
    },
    delArticle (target) {
      MessageBox.confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除成功
        await $DeleteArticle(target)
        Message({ message: '删除成功', type: 'success', duration: 1000 })
        await this.getTextInfo(this.currentPage)
      }).catch(() => {
        Message({ message: '删除失败 权限不足', type: 'error', duration: 1000 })
      })
    }
  },
  created () {
    this.getTextInfo()
    this.getTextChannel()
  }
}
</script>

<style lang="less" scoped>
.box-card{
  margin-bottom: 20px;
}

.avatar{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
}
</style>
