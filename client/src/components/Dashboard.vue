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
      var formData = new FormData() // Currently empty
      // formData.append('uri', 'data:text/csv;charset=utf-8, Symbol,Company,Price AAPL,Apple\n', 'chris.jpg');
      var blob = new Blob(['Symbol,Company,Price AAPL,Apple\n'], {type: 'text/csv'})
      formData.append('uri', blob)
      var request = new XMLHttpRequest()
      request.open('POST', 'http://localhost:3034/myuploads')
      request.setRequestHeader('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTJmZDNiMDlkZjI1ZDAwZjdhMTEzOTMiLCJpYXQiOjE1MTU0OTY5MTMsImV4cCI6MTUxNTUwMDU0MywiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIn0.rl7Q6HwEIZGsnaKqSHyTFZ-vi9UnBXVJP6C2JruhLtU')
      request.setRequestHeader('cache-control', 'no-cache')
      request.send(formData)

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
