<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <pForm ref="formp" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" label="用户id" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column ref="table" prop="avatar" label="头像">
        <template slot-scope="scope">
          <a :href="scope.row.avatar" style="color: #42b983" target="_blank"><img :src="scope.row.avatar" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="电子邮箱" />
      <el-table-column prop="city" label="所在城市" />
      <el-table-column prop="company" label="工作单位" />
      <el-table-column prop="position" label="职位" />
      <el-table-column :show-overflow-tooltip="true" prop="addTime" label="注册日期">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="lastTime" label="最近登录">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.level == '1' && (scope.row.vipValidDate > new Date() || scope.row.isForever == '1')">VIP</el-tag>
            <el-tag v-else>普通会员</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="VIP有效期" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.level == '1' && scope.row.isForever == '1'">永久VIP</el-tag>
            <el-tag v-else-if="scope.row.vipValidDate > new Date()">{{ formatTime(scope.row.vipValidDate, '{y}-{m}-{d}') }}</el-tag>
            <el-tag v-else>过期</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','bopUser:list','bopUser:add','bopUser:edit','bopUser:delete'])" label="操作" width="185" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','bopUser:list','bopUser:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-dropdown size="mini" split-button type="primary" trigger="click">
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','bopUser:list','bopUser:edit']"
                  size="mini"
                  type="primary"
                  @click="editP(scope.row)"
                >升级VIP</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/crud'
  import { del } from '@/api/bopUser'
  import eForm from './form'
  import pForm from './formp'
  import { formatTime } from '@/utils/index'
  export default {
    components: { eForm, pForm },
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        userType: '',
        queryTypeOptions: [
          { key: 'nickname', display_name: '昵称' },
          { key: 'phone', display_name: '手机号' }
        ],
        userLevelOptions: [
          { key: '0', display_name: '普通会员' },
          { key: '1', display_name: 'VIP' }
        ],
        statusOptions: [
          { value: 'routine', label: '小程序' },
          { value: 'wechat', label: '公众号' },
          { value: 'H5', label: 'H5' }
        ]
      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      formatTime,
      checkPermission,
      onStatus(id, status) {
        // this.$confirm(`确定进行[${status ? '禁用' : '开启'}]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        //   .then(() => {
        //     onStatus(id, { status: status }).then(({ data }) => {
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1000,
        //         onClose: () => {
        //           this.init()
        //         }
        //       })
        //     })
        //   })
        //   .catch(() => { })
      },
      beforeInit() {
        this.url = 'api/bopUser'
        const sort = 'uid,desc'
        this.params = { page: this.page, size: this.size, sort: sort }
        const query = this.query
        const type = query.type
        const value = query.value
        if (type && value) { this.params[type] = value }
        return true
      },
      subDelete(uid) {
        // this.delLoading = true
        // del(uid).then(res => {
        //   this.delLoading = false
        //   this.$refs[uid].doClose()
        //   this.dleChangePage()
        //   this.init()
        //   this.$notify({
        //     title: '删除成功',
        //     type: 'success',
        //     duration: 2500
        //   })
        // }).catch(err => {
        //   this.delLoading = false
        //   this.$refs[uid].doClose()
        //   console.log(err.response.data.message)
        // })
      },
      add() {
        this.isAdd = true
        this.$refs.form.dialog = true
      },
      edit(data) {
        this.isAdd = false
        const _this = this.$refs.form
        _this.form = {
          uid: data.uid,
          username: data.username,
          password: data.password,
          realName: data.realName,
          birthday: data.birthday,
          cardId: data.cardId,
          mark: data.mark,
          nickname: data.nickname,
          avatar: data.avatar,
          phone: data.phone,
          email: data.email,
          city: data.city,
          company: data.company,
          position: data.position,
          concern: data.concern,
          addTime: data.addTime,
          addIp: data.addIp,
          lastTime: data.lastTime,
          lastIp: data.lastIp,
          status: data.status,
          level: data.level,
          vipValidDate: data.vipValidDate,
          isForever: data.isForever,
          userType: data.userType,
          loginType: data.loginType
        }
        _this.dialog = true
      },
      editP(data) {
        this.isAdd = false
        const _this = this.$refs.formp
        _this.form = {
          uid: data.uid,
          nickname: data.nickname,
          phone: data.phone
        }
        _this.dialog = true
      }
    }
  }
</script>

<style scoped>

</style>
