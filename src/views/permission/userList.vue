<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <div class="filter-container">
      <el-input @keyup.enter.native="funFilter" style="width: 200px;" class="filter-item" :placeholder="'使用者名稱'" v-model="listQuery.keyword">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="funFilter">search</el-button>
      <router-link :to="{ name: 'PermissionUserAdd', params: { id: 'create' }}"><el-button type="info" icon="el-icon-circle-plus" v-if="auths.PermissionUserAdd">新增使用者</el-button></router-link>
    </div>
    <el-table :data="list" row-key="id" element-loading-text="Loading" border fit stripe highlight-current-row >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="使用者帳號">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="使用者名稱">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <router-link :to="{ name: 'PermissionUserEdit', params: { id: scope.row.id }}">
            <el-button type="info" icon="el-icon-edit" circle  v-if="auths.PermissionUserEdit"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle  @click="funCheckDels(scope.row.id)" v-if="auths.PermissionUserEdit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="funSizeChange"
        @current-change="funCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="listQuery.paginate"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserList, delUser } from '@/api/permission'
import $ from 'jquery'
export default {
  data() {
    return {
      loading: false,
      list: null,
      listQuery: { page: 1 },
      listTotal: null
    }
  },
  created() {
    this.fetchList()
  },
  computed: {
    auths() {
      return this.$store.getters.auths
    }
  },
  methods: {
    fetchList() {
      this.loading = true
      getUserList(this.listQuery).then(response => {
        const respData = response.data
        this.list = respData.data

        this.listQuery.page = respData.current_page
        this.listQuery.paginate = parseInt(respData.per_page)

        this.listTotal = respData.total

        this.loading = false

        $('html, body').animate({ scrollTop: 0 })
      }).catch(() => {
        this.loading = false
      })
    },
    funSizeChange(val) {
      this.listQuery.paginate = val
      this.listQuery.page = 1
      this.fetchList()
    },
    funCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    funFilter(val) {
      this.listQuery.page = 1
      this.fetchList()
    },
    funCheckDels(id) {
      this.$swal({
        title: '確定要刪除ID: ' + id + ' ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.value) {
          this.loading = true

          delUser(id).then(response => {
            this.loading = false
            this.fetchList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
