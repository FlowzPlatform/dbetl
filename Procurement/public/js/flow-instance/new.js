 // $(function () {
 //   // tinymce.init({
 //   //   selector: '#templateHtml',
 //   //   height: 300,
 //   //   plugins: [
 //   //     'advlist autolink lists link image charmap print preview anchor',
 //   //     'searchreplace visualblocks code fullscreen',
 //   //     'insertdatetime media table contextmenu paste'
 //   //   ],
 //   //   toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
 //   // });
 //   let id = $("#hdnId").val()

 //   if (id !== 'undefined') {
 //     $("#btnSubmit").text('Update')
 //     alert(host+'instance')
 //     $.ajax({
 //       url: host+'instance/' + id,
 //       // url: dbhost + 'flowsInstance/' + id,
 //       type: 'GET',
 //       success: function (result) {
 //         if (!result.error) {
 //          alert(JSON.stringify(result));
 //           $('#instance_name').val(result[0].name)
 //             // $('#lnkAddnew').click();
 //             // result[0].data.options.forEach(function (option) {
 //             //   $('#lnkAddnew').click();

 //           //     result[0].entity.forEach(function (entity) {
 //           //       var rowdata = option[entity.name]
 //           //       // console.log('yes',rowdata);
 //           //       $('#'+entity.name).val(rowdata);
 //           //     })
 //           // }, this);

 //           // alert(JSON.stringify(result[0]));
 //           // console.log(result[0]);

 //           result[0].data.options.forEach(function (option) {
 //             let $html = createRow(option);
 //             $('#usertable > tbody > tr:last-child').before($html);
 //           });

 //           // setTimeout(function () {
 //           //   tinymce.get('templateHtml').setContent(result.template);
 //           // }, 200)
 //         }
 //       }
 //     });
 //   } else {
 //     if (instance_data.template.length == 0) {
 //       // $('#lnkAddnew').click();
 //     }
 //   }
 // });

 // let createRow = function (element) {
 //   // console.log(element);
 //   let $html = $($('#addnewtext-template').html())
 //   console.log('html: ', $html);

 //   if (instance_data.template.length == 0) {
 //     $.each(element, function (k, v) {
 //       $html.find('#' + k).attr('value', v);
 //     });
 //     return $html;
 //   } else {
 //     $.each(element, function (k, v) {
 //       $html.find('#' + k).attr('value', v).css({ 'pointer-events': 'none' });
 //       // $html.find('.grid_cell_remove_handle').before('<td class="grid_cell_edit_handle"><i class="fa fa-edit" onclick="openTemplateDialog(this)"></i></td>');
 //       // $html.find('#'+k).css('pointer-events': 'none');
 //     });
 //     return $html;
 //   }
 // }
