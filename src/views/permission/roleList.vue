<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <div class="filter-container text-right">
      <router-link :to="{ name: 'PermissionRoleAdd'}"><el-button type="info" icon="el-icon-circle-plus" v-if="auths.PermissionRoleAdd">新增權限群組</el-button></router-link>
    </div>
    <el-table :data="list" row-key="id" element-loading-text="Loading" border fit stripe highlight-current-row >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="權限群組名稱">
        <template slot-scope="scope">
          {{scope.row.display_name}}
        </template>
      </el-table-column>
      <el-table-column label="權限群組代碼">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <router-link :to="{ name: 'PermissionRoleEdit', params: { id: scope.row.id }}">
            <el-button type="info" icon="el-icon-edit" circle  v-if="auths.PermissionRoleEdit"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle  @click="funCheckDels(scope.row.id)" v-if="auths.PermissionRoleDel"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoleList, delRole } from '@/api/permission'

export default {
  data() {
    return {
      loading: false,
      list: null
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
      getRoleList().then(response => {
        const respData = response.data
        this.list = respData.roles

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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

          delRole(id).then(response => {
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
