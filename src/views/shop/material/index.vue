<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','bopMaterial:list','bopMaterial:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="素材名" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" style="cursor: pointer;" >图片</el-tag>
          <el-tag v-else-if="scope.row.type === 2" style="cursor: pointer;" >视频</el-tag>
        </template>
      </el-table-column>
      <el-table-column ref="table" prop="url" label="素材">
        <template slot-scope="scope">
          <a :href="scope.row.url" style="color: #42b983" target="_blank"><img :src="scope.row.url" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>

      <el-table-column prop="creator" label="创建者" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDel" style="cursor: pointer; color: red" :type="''">禁用</el-tag>
            <el-tag v-else style="cursor: pointer; color: green" :type=" 'info' ">启用</el-tag>
          </template>
      </el-table-column>

      <el-table-column v-if="checkPermission(['admin','bopMaterial:list','bopMaterial:edit','bopMaterial:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','bopMaterial:list','bopMaterial:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','bopMaterial:list','bopMaterial:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
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
import { del } from '@/api/bopMaterial'
import { formatTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      typeOptions: [
        { value: '1', label: '图片'},
        { value: '2', label: '视频'}
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
    beforeInit() {
      this.url = 'api/bopMaterial'
      const sort = ['name,asc','id,desc']
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        type: data.type,
        url: data.url,
        createTime: data.createTime,
        creatorId: data.creatorId,
        creator: data.creator,
        isDel: data.isDel
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
