<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="素材名">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" clearable placeholder="素材类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in $parent.typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="素材链接">
        <el-input v-model="form.url" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.isDel" :label="false">启用</el-radio>
        <el-radio v-model="form.isDel" :label="true">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/bopMaterial'
import crudOperation from '@crud/CRUD.operation'
import {mapGetters} from "vuex";

export default {
  components: { crudOperation },

  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        name: '',
        type: '',
        url: '',
        createTime: '',
        creatorId: '',
        creator: '',
        isDel: ''
      },
      rules: {
      }

    }
  },
  // created() {
  //   this.initOptions();
  // },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    // initOptions() {
    //   this.typeOptions = [
    //     { value: '1', label: '图片'},
    //     { value: '2', label: '视频'}
    //   ]
    // },
    // // 打开编辑弹窗前做的操作
    // [CRUD.HOOK.beforeToEdit](crud, form) {
    //   this.initOptions()
    // },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      this.form.createTime = new Date()
      this.form.creatorId = this.user.id
      this.form.creator = this.user.username
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        type: '',
        url: '',
        createTime: '',
        creatorId: '',
        creator: '',
        isDel: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
