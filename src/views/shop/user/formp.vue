<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '余额修改'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="升级VIP">
        <el-select v-model="form.period" clearable placeholder="VIP时限" class="filter-item" style="width: 130px">
          <el-option v-for="item in vipOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, grant } from '@/api/bopUser'
import { summary } from '@/api/bopVipPrice'

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
        uid: '',
        nickname: '',
        money: '',
        ptype: '1'
      },
      rules: {
      },
      vipOptions: []
    }
  },
  created() {
    this.getVipSummary();
  },
  methods: {
    getVipSummary() {
      summary().then(data => {
        console.log(data);
        this.vipOptions = data;
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      grant(this.form).then(res => {
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
        uid: '',
        username: '',
        password: '',
        realName: '',
        birthday: '',
        cardId: '',
        mark: '',
        nickname: '',
        avatar: '',
        phone: '',
        email: '',
        city: '',
        company: '',
        position: '',
        concern: '',
        addTime: '',
        addIp: '',
        lastTime: '',
        lastIp: '',
        status: '',
        level: '',
        vipValidDate: '',
        isForever: '',
        userType: '',
        loginType: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
