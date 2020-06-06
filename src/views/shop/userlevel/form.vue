<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="VIP类型">
        <el-input v-model="form.name" style="width: 370px;" :disabled="!isAdd"/>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="活动价格">
        <el-input v-model="form.realPrice" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="时效(天)">
        <el-input v-model="form.period" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.isDel" :label="0">激活</el-radio>
        <el-radio v-model="form.isDel" :label="1">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/bopVipPrice'

export default {
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
        price: '',
        realPrice: '',
        period: '',
        addTime: '',
        isDel: ''
      },
      rules: {
      }
    }
  },
  methods: {
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
      this.form.addTime = new Date().getMilliseconds()
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
        price: '',
        realPrice: '',
        period: '',
        addTime: '',
        isDel: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
