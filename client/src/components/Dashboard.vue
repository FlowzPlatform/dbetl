<template>
  <div class="dashboard">
    Dashboard
  </div>
</template>

<script>
export default {
  name: 'dashboard'
}
</script>

<!-- <template>
<div>
<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
<el-button style="float:right;margin:5px;" size="small" @click="addTab(editableTabsValue2)">add</el-button>
  <div style="padding:10px;">
	  <el-tab-pane v-for="(item, index) in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
	    {{item.content}}
	  </el-tab-pane>
 	</div>
</el-tabs>
</div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      editableTabsValue2: '2',
      editableTabs2: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2
    }
  },
  methods: {
    addTab (targetName) {
      let newTabName = ++this.tabIndex + ''
      this.editableTabs2.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      })
      this.editableTabsValue2 = newTabName
    },
    removeTab (targetName) {
      let tabs = this.editableTabs2
      let activeName = this.editableTabsValue2
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue2 = activeName
      this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
    }
  }
}
</script>
<style>
	.f-layout-content{
		margin: 0px;
	}
	.f-layout-content-main {
		padding:0px;
	}
</style>
 -->