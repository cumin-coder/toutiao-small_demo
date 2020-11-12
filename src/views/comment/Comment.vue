<template>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div slot="header" class="header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
              <el-breadcrumb-item>评论管理</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <el-table
          size="mini"
          :data="comments"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="total_comment_count"
            label="总评论数"
            width="180">
          </el-table-column>
          <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数">
          </el-table-column>
          <el-table-column
            label="评论状态"
            width="180">
            <template slot-scope="scope">
              {{scope.row.comment_status ? '启用' : '关闭'}}中
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              {{scope.row.comment_status}}
              <el-switch
                v-model="scope.row.comment_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change='onStatusChange(scope.row)'
                :disabled="switchDisabled"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :small="true"
          class="pagination-comment"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          background
          :disabled="paginationDisabled"
        >
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
import { $getCommentInfo, $editCommentStatus } from '../../api/comment'
import _ from 'lodash'
export default {
  name: 'Comment',
  data () {
    return {
      comments: [], // 全部评论的数据
      pageSize: 10, // 每页数量
      currentPage: 1, // 当前页数
      totalPage: null, // 总页数
      loading: false, // 是否加载中
      paginationDisabled: false, // 分页是否禁用中
      switchDisabled: false // 切换按钮是否禁用中
    }
  },
  methods: {
    // 是否加载中 是否禁用
    statusIsTrue () {
      this.loading = true
      this.paginationDisabled = true
    },
    // 当前显示的总条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      // 当改变了当前页显示的总条数时,将当前的页码跳转到 默认第一页
      this.currentPage = 1
      // 更新页面
      this.getCommentInfo()
      this.statusIsTrue()
    },
    // 当前的页码
    handleCurrentChange (page) {
      this.currentPage = page
      // 更新页面
      this.getCommentInfo()
      this.statusIsTrue()
    },
    async getCommentInfo () {
      const result = await $getCommentInfo('comment', this.currentPage, this.pageSize)
      const { results, total_count: totalCount } = result.data.data
      this.comments = results
      this.totalPage = totalCount
      // 解除加载状态
      this.loading = false
      this.paginationDisabled = false
    },
    async editCommentStatus (status) {
      // const { id, comment_status: CommentStatus } = status
      // 关闭评论状态
      await $editCommentStatus(status.id.toString(), status.comment_status)
    },

    /**
     * 防抖: 在连续触发某个事件时 不会调用 当停止触发某个事件时 触发一次
     * 节流: 限制一个时间(600ms) 时间(600ms)一到 触发一次
     */
    // 防抖限制
    onStatusChange: _.debounce(function (status) {
      this.editCommentStatus(status)
    }, 1000)
  },
  created () {
    this.getCommentInfo()
    this.loading = true
  }
}
</script>

<style lang="less" scoped>
  .pagination-comment{
    margin-top: 20px;
  }
</style>
