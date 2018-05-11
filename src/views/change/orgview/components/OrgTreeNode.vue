<template>
  <table cellpadding="0" cellspacing="0" border="0">
    <tbody>
      <tr class="node-cells">
        <td class="node-cell" v-bind:colspan='colspanCount'>
          <div class="node" style="cursor: n-resize;" @click="toggleNode">
            <a class='myOrgCharta' href='javascript:void(0)'>
              <div class="ort-item-title">
                <span>{{model.name}}</span>
                <i class="fa opened" :class="!isShow&&model.children.length>0?'fa-plus':'fa-minus'"></i>
              </div>
              <div class="org-item-class"><span>组&nbsp;&nbsp;长：</span>张胜男</div>
              <div class="org-item-class"><span>副组长：</span>张胜男</div>
              <div class="org-item-class"><span style="display: block;float: left;">成&nbsp;&nbsp;员：</span>
                <span style="float: left">
                  <div>张胜男</div>
                  <div>张胜男</div>
                  <div>张胜男</div>
                  <div>张胜男</div>
                  <div>张胜男</div>
                </span>
              </div>
              <div class="ort-item-footer">
                总人数：6人
              </div>
            </a>
          </div>
        </td>
      </tr>
      <tr v-if="haveChildren" v-show="isShow">
          <td v-bind:colspan='colspanCount'>
            <div class="line down"></div>
          </td>
      </tr>
      <tr v-if="haveChildren" v-show="isShow">
        <td v-for="element in lineClass" :key="element.index" :class="element.className" >&nbsp;</td>
      </tr>
      <tr v-if="haveChildren" v-show="isShow">
        <td class="node-container" colspan="2" v-for="(element, index) in model.children" :key="index" >
          <org-tree-node :model='element'></org-tree-node>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script type="text/javascript">
  export default {
    name: 'orgTreeNode',
    props: ['model'],
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      haveChildren() {
        return this.model.children && this.model.children.length
      },
      colspanCount() {
        return this.model.children ? this.model.children.length * 2 : 0
      },
      lineClass() {
        const arr = []
        arr.push('line left')
        for (let i = 1; i < this.colspanCount / 2; i++) {
          arr.push('line right top')
          arr.push('line left top')
        }
        arr.push('line right')
        return arr.map((element, index) => {
          return {
            className: element, index: index
          }
        })
      }
    },
    methods: {
      toggle: function() {
        console.log('node toggle')
      },
      toggleNode: function() {
        this.isShow = !this.isShow
      }
    }
  }
</script>
