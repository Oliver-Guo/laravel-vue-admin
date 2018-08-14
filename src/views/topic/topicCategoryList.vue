<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <div class="filter-container text-right">
      <el-button type="info" icon="el-icon-circle-plus" v-if="auths.TopicCategoryAdd" @click="funCreate">新增專題分類</el-button>
    </div>
    <el-table :data="list" row-key="id" element-loading-text="Loading" border fit stripe highlight-current-row >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="專題分類名稱">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="啟用關閉">
        <template slot-scope="scope">
        <el-switch
          v-model="isOnlines[scope.$index]"
          @change="funOnline(scope.row.id,scope.$index)"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="info" icon="el-icon-edit" circle  v-if="auths.TopicCategoryEdit" @click="funUpdate(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle  @click="funCheckDels(scope.row.id)" v-if="auths.TopicCategoryDel"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form data-vv-scope="form-1" label-width="120px">
        <el-form-item label="*專題分類名稱" :class="{'is-error':errors.has('form-1.name')}">
          <el-input type="text" v-model="temp.name" name="name"  data-vv-as="專題分類名稱" v-validate="'required'" class="form-control"></el-input>
          <span v-show="errors.has('form-1.name')" class="el-form-item__error">{{ errors.first('form-1.name') }}</span>
        </el-form-item>
        <el-form-item label="是否顯示">
          <el-switch v-model="temp.is_online"
          active-color="#13ce66"
          inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogTitle=='新增'" type="primary" @click="createData('form-1')">儲存</el-button>
        <el-button v-else type="primary" @click="updateData('form-1')">儲存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTopicCategoryList, putTopicCategoryOnline, delTopicCategory, putTopicCategorySort, postTopicCategory, putTopicCategory } from '@/api/topic'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      loading: false,
      list: null,
      isOnlines: [],
      oldList: [],
      newList: [],
      sortable: null,
      dialogFormVisible: false,
      dialogTitle: '',
      temp: {}
    }
  },
  created() {
    this.fetchList()
  },
  mounted() {
    const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
      setData: function(dataTransfer) {
        dataTransfer.setData('Text', '')
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      },
      onEnd: evt => {
        const targetRow = this.list.splice(evt.oldIndex, 1)[0]
        this.list.splice(evt.newIndex, 0, targetRow)
        // for show the changes, you can delete in you code
        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
        this.newList.splice(evt.newIndex, 0, tempIndex)

        this.isOnlines = this.list.map(item => {
          return (item.is_online === 1)
        })

        putTopicCategorySort({ ids: this.newList })
      }
    })
  },
  computed: {
    auths() {
      return this.$store.getters.auths
    }
  },
  methods: {
    fetchList() {
      this.loading = true
      getTopicCategoryList().then(response => {
        const respData = response.data
        this.list = respData.topic_categories

        // this.list.forEach((item, index) => {
        //   this.isOnlines.push((item.is_online === 1))
        // })
        // this.isOnlines = []
        // Object.keys(this.list).map(key => {
        //   this.isOnlines.push((this.list[key].is_online === 1))
        // })
        this.isOnlines = this.list.map(item => {
          return (item.is_online === 1)
        })

        this.newList = this.list.map(v => v.id).slice()

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    funOnline(id, index) {
      const resData = { is_online: (this.isOnlines[index]) ? 1 : 0 }
      this.list[index].is_online = resData.is_online
      putTopicCategoryOnline(id, resData)
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
          delTopicCategory(id).then(response => {
            this.loading = false
            this.fetchList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        is_online: false
      }
    },
    funCreate() {
      this.resetTemp()
      this.dialogTitle = '新增'
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$validator.reset()
      })
    },
    createData(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.temp.is_online = (this.temp.is_online) ? 1 : 0
          this.loading = true
          postTopicCategory({ topic_category: this.temp }).then(() => {
            this.loading = false
            this.dialogFormVisible = false
            this.fetchList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    funUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.is_online = (this.temp.is_online === 1)
      this.dialogStatus = '修改'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$validator.reset()
      })
    },
    updateData(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.temp.is_online = (this.temp.is_online) ? 1 : 0
          this.loading = true
          putTopicCategory(this.temp.id, { topic_category: this.temp }).then(() => {
            this.loading = false
            this.dialogFormVisible = false
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
<style scoped>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
