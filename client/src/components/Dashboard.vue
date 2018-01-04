<template>
  <div class="dashboard">
    Dashboard
    <form 
    class="dropzone"
    id="my-awesome-dropzone"
    enctype="multipart/form-data"
    ></form>
  </div>
</template>

<script>
// import _ from 'lodash'
const $ = require('jquery')
let Dropzone = require('../../static/dropzone/dropzone.js')
// var csvWriter = require('csv-write-stream')
// var fs = require('fs')
// var writer = csvWriter()
import Papa from 'papaparse'
export default {
  name: 'dashboard',
  mounted () {
    var self = this
    $(document).ready(function () {
      var myDropzone = new Dropzone('#my-awesome-dropzone', {url: 'http://localhost:3034/myuploads', headers: {'Authorization': self.$store.state.token}, paramName: 'uri', addRemoveLinks: true, maxFiles: 1})
      // , maxFiles: 1
      myDropzone.on('maxfilesexceeded', function (file) {
        console.log('No More File Please')
      })
      myDropzone.on('sending', function (file, xhr, formData) {
        console.log('sending......................', file, xhr, formData)
        // formData.append('filesize', '123456')
        // var s = ''
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          encoding: 'UTF-8',
          skipEmptyLines: true,
          newline: '\n',
          complete: function (results, file) {
            console.log(results.data, file)
            results.data[0].email = 'nik@officebrain.com'
            // s = Papa.unparse(results.data)
            // formData.append('uri', 1211231)
            // writer.pipe(fs.createWriteStream('out.csv'))
            // writer.write(s)
            // writer.end()
          }
        })
      })
      // var filename = 'out.csv'
      // var data = s
      // var blob = new Blob([data], {
      //   type: 'text/csv;charset=utf-8'
      // })
      // saveAs(blob, filename)
    })
  }
}
</script>
