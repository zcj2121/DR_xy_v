<template>
  <div class="app-container" id="menuTable">

    <el-row>
      <el-col :span="5">
        <span class="tabel-title">角色列表</span>
        <div class="menu-left">
          <el-radio-group v-model="roleActive">
            <el-radio-button :label="item.id" v-for="(item, index) in roleData" :key="index">{{item.tRoleName}}</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="19">
        <span class="tabel-title">菜单树</span>
        <div class="menu-tree">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :default-checked-keys="menuActive"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="btn-box-bottom">
          <el-button class="filter-item" size="medium" type="primary" @click="save">保存</el-button> <el-button class="filter-item" style="margin-left:10px;" size="medium" type="primary" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { retrieve, menuAPI, retrieveActive, update } from '@/api/system/jurisdiction'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        detailShow: false,
        roleActive: null,
        roleData: [],
        menuList: [],
        menuActive: [],
        defMenuActive: [],
        defMenuData: [],
        defaultProps: {
          children: 'sumMenuList',
          label: 'menuName'
        },
        saveForm: {
          tAuthRoleId: '',
          tAuthMenuIds: ''
        }
      }
    },
    watch: {
      // 监听 选中的角色
      roleActive: {
        handler(roleActive) {
          this.menuDataActive()
        },
        deep: true
      }
    },
    created() {
      this.fetchData()
      this.menuData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        retrieve().then(response => {
          if (response) {
            this.roleData = response.list
            this.roleActive = response.list[0].id
            this.listLoading = false
          }
        })
      },
      menuData() {
        menuAPI().then(response => {
          if (response) {
            this.menuList = Object.assign([], response.list)
            this.defMenuData = Object.assign([], response.list)
            this.menuDataActive()
            this.listLoading = false
          }
        })
      },
      menuDataActive() {
        this.$refs.tree.setCheckedKeys([])
        retrieveActive({ tAuthValue: this.roleActive }).then(response => {
          if (response) {
            const defData = response.list
            const arr = []
            // const childArr = []
            // for (const i in defData) {
            //   childArr.push(defData[i].tMenuParent)
            // }
            // const aaa = Array.from(new Set(childArr))
            for (const i in defData) {
              if (defData[i].checked === true) {
                arr.push(defData[i].id)
              }
              // for (const j in aaa) {
              //   if (defData[i].tMenuParent === aaa[j]) {
              //     if (defData[i].checked !== true) {
              //       arr.splice(arr.findIndex(item => item === aaa[j]), 1)
              //     }
              //   }
              // }
            }
            this.menuActive = Object.assign([], arr)
            this.defMenuActive = Object.assign([], arr)
            this.reset()
            this.listLoading = false
          }
        })
      },
      save() {
        const newobj = Object.assign([], this.$refs.tree.getCheckedKeys()) // 获取 树 选中的值
        // for (const i in this.defMenuData) {
        //   // const defMenuChild = this.defMenuData[i].sumMenuList
        //   const defMenuChildId = this.defMenuData[i].id
        //   newobj.push(defMenuChildId)
        //   // for (const j in defMenuChild) {
        //   //   for (const k in newobj) {
        //   //     if (defMenuChild[j].id === newobj[k]) {
        //   //       newobj.push(defMenuChildId)
        //   //     }
        //   //   }
        //   // }
        // }
        // const bbb = Array.from(new Set(newobj))
        this.saveForm.tAuthMenuIds = newobj.toString()
        this.saveForm.tAuthRoleId = this.roleActive
        this.$confirm('确定保存吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.menuDataActive()
          update(this.saveForm).then(() => {
            this.$store.dispatch('editMenu').then(() => {
              // location.reload()
            })
            this.menuDataActive()
          })
        }).catch(() => {
          // _this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // })
        })
      },
      reset() {
        this.$refs.tree.setCheckedKeys(this.defMenuActive) // 设置选中值
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #menuTable{
    .menu-left{
      margin-right: 20px;
      .el-radio-group{
        display: block;
        width:100%;
        .el-radio-button, .el-radio-button__inner{
          display: block;
        }
        .el-radio-button:first-child .el-radio-button__inner{
          border-radius: 0px;
        }
        .el-radio-button__inner{
          border-left:1px solid #dcdfe6;
          border-bottom: none;
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          border-left:1px solid #409EFF;
        }
        .el-radio-button:last-child .el-radio-button__inner{
          border-radius: 0px;
        }
        .el-radio-button:last-child .el-radio-button__inner{
          border-bottom:1px solid #dcdfe6;
        }
      }
    }
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        height: 250px;
        overflow-y: auto;
      }
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>
  .menu-tree{
    border:1px solid #dcdfe6;
    padding:15px;
  }
  .btn-box-bottom{
    margin-top:15px;
  }
</style>
