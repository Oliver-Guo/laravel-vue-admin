<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <div class="filter-container">
      <el-input @keyup.enter.native="funFilter" style="width: 200px;" class="filter-item" :placeholder="'作者名稱'" v-model="listQuery.keyword">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="funFilter">search</el-button>
      <router-link :to="{ name: 'AuthorAdd', params: { id: 'create' }}"><el-button type="info" icon="el-icon-circle-plus" v-if="auths.AuthorAdd">新增作者</el-button></router-link>
    </div>
    <el-table :data="list" row-key="id" element-loading-text="Loading" border fit stripe highlight-current-row >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="作者名稱">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="啟用關閉" width="80">
        <template slot-scope="scope">
        <el-switch
          v-model="isOnlines[scope.$index]"
          @change="funOnline(scope.row.id,scope.$index)"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="圖片" width="180" align="center">
        <template slot-scope="scope">
          <div style="height:150px">
          <img :src=" scope.row.photo!=null ? scope.row.photo.file_url : $BaseImgUrl+'/images/no-150.png' "  alt='' width="150" height="150">
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <router-link :to="{ name: 'AuthorEdit', params: { id: scope.row.id }}">
            <el-button type="info" icon="el-icon-edit"  circle  v-if="auths.AuthorEdit"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle  @click="funCheckDels(scope.row.id)" v-if="auths.AuthorDel"></el-button>
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
import { getList, delAuthor, putAuthorOnline } from '@/api/author'
import $ from 'jquery'
export default {
  data() {
    return {
      loading: false,
      list: null,
      listQuery: { page: 1, paginate: 10 },
      listTotal: null,
      isOnlines: []
    }
  },
  filters: {
    statusTagFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'info'
      }
      return statusMap[status]
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
      getList(this.listQuery).then(response => {
        const respData = response.data
        this.list = respData.data

        this.listQuery.page = respData.current_page
        this.listQuery.paginate = parseInt(respData.per_page)

        this.listTotal = respData.total

        this.isOnlines = []
        Object.keys(this.list).map(key => {
          this.isOnlines.push((this.list[key].is_online === 1))
        })

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

          delAuthor(id).then(response => {
            this.loading = false
            this.fetchList()
          })
        }
      })
    },
    funOnline(id, index) {
      const resData = { is_online: (this.isOnlines[index]) ? 1 : 0 }
      this.list[index].is_online = resData.is_online
      putAuthorOnline(id, resData)
    }
  }
}
</script>
