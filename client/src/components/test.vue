<template>
  <div class="test">
    <codemirror :options="editorOptions" v-model="code1" @change = 'onEditorCodeChange(code1)'></codemirror>
  </div>
</template>

<script>
import Test from './test'
import _ from 'lodash'
export default {
  name: 'test',
  props: ['row'],
  components: {
    'test': Test
  },
  data () {
    return {
      code1: '',
      editorOptions: {
        tabSize: 4,
        mode: 'application/json',
        theme: 'base16-light',
        lineNumbers: true,
        line: true,
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      }
    }
  },
  computed: {
  },
  methods: {
    onEditorCodeChange (newCode) {
      this.code1 = newCode
      console.log('this is new code', this.code1)
    },
    looping (data) {
      var value1 = ''
      _.forEach(data, function (value) {
        for (var entry in value) {
          value1 += entry + ':' + value[entry] + ','
          data = value1
          console.log('qqqqqqqq', data)
        }
      })
      return data
    }
  },
  mounted () {
    var output = ''
    for (var entry in this.row) {
      if (typeof (this.row[entry]) === 'object') {
        var result = this.looping(this.row[entry])
        this.row[entry] = '{' + result + '}'
        console.log('result', result)
        console.log('this.row[entry]', this.row[entry])
      }
      output += entry + ':' + this.row[entry] + '\n'
      this.code1 = '{' + output + '}'
    }
  }
}
</script>
<style type="text/css">
  .ivu-table table {
    table-layout: inherit;
  }
</style>
