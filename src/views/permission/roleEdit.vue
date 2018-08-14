<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <el-form data-vv-scope="form-1" label-width="120px">
      <el-form-item label="*權限群組名稱" :class="{'is-error':errors.has('form-1.display_name')}">
        <el-input type="text" v-model="form.display_name" name="display_name"  data-vv-as="權限群組名稱" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.display_name')" class="el-form-item__error">{{ errors.first('form-1.display_name') }}</span>
      </el-form-item>
      <el-form-item label="*權限群組代碼" :class="{'is-error':errors.has('form-1.name')}">
        <el-input type="text" v-model="form.name" name="name"  data-vv-as="權限群組代碼" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.name')" class="el-form-item__error">{{ errors.first('form-1.name') }}</span>
      </el-form-item>
      <div class="panel panel-info level" v-for="(permissionGroup,index) in permissonList" :key="index">
        <div class="panel-heading">
        <span class="pull-left">{{index}}</span>
        </div>
        <div class="panel-body">
        <table>
          <tbody>
            <tr v-for="(permissions,index2) in permissionGroup" :key="index2">
                <td class="text-right display-type">{{index2}}：</td>
                <td>
                    <div class="role-chbx" v-for="permission in permissions" :key="permission.id">
                      <label><input type="checkbox" v-model.number="rolePermissions" :value="permission.id"> {{permission.display_name}}</label>
                    </div>
                </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      <el-form-item>
          <el-button type="primary" style="width:10%; margin-top: 20px;" @click.native.prevent="checkForm('form-1')">儲存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getRolePermissions, getRole, putRole } from '@/api/permission'

export default {
  data() {
    return {
      loading: false,
      permissonList: null,
      rolePermissions: [],
      form: {},
      roleId: this.$route.params.id
    }
  },
  created() {
    this.fetchRolePermissions()
    this.fetchRole()
  },
  methods: {
    fetchRolePermissions() {
      this.loading = true
      getRolePermissions().then(response => {
        const respData = response.data
        this.permissonList = respData

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    fetchRole() {
      this.loading = true

      getRole(this.roleId).then(response => {
        const respData = response.data

        this.form = respData.role

        this.rolePermissions = respData.permission_ids

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.loading = true

          const resData = { role: Object.assign({}, this.form), permission_ids: this.rolePermissions }

          putRole(this.roleId, resData).then(response => {
            const respData = response.data

            this.loading = false

            if (respData === '') {
              this.fetchRole()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.level.panel{
	margin-top:10px;
	margin-bottom:0;
}
.level .panel-heading{
	font-size:16px;
	font-weight:bold;
}

.panel-body{
	padding:5px;
}

.role-chbx {
    display: inline-block;
    margin-right: 15px;
    margin-top: 10px;
}

.display-type{
	padding-top: 15px !important;
	width: 150px;
}

.text-right {
  text-align: right !important;
}

</style>
