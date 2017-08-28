$(function () {
  tinymce.init({
    selector: '#templateHtml',
    height: 300,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  });
  let id = $("#hdnId").val()

  if (id !== 'undefined') {
    $(".btnSubmit").text('Update')
    $.ajax({
      url: host + 'schema/' + id,
      type: 'GET',
      success: function (result) {
        var result = result;
        // alert(JSON.stringify(result));
        if (!result.error) {
          $('#txtSchemaName').val(result.title)

          result.entity.forEach(function (element) {
            let $html = createRow(element);
            $('#tableSchema > tbody tr:last-child').closest('tr').before($html);
          }, this);

          setTimeout(function () {
            tinymce.get('templateHtml').setContent(result.template);
          }, 200)
        }
      }
    });
  } else {
    $('#btnAddSchema').click();
  }
});

let addSchema = function (self) {
  let $html = createRow();
  $(self).closest('tr').before($html);
}

let createRow = function (element) {

  let $html = $($('#schema-template').html())

  $html.find('[data-name="txtName"]').attr({
    'id': 'txtName'
  }).editable({
    mode: 'inline',
    type: 'text',
    emptytext: 'Enter Name',
  })



  let types = [
    { value: 'text', text: 'Text' },
    { value: 'email', text: 'Email' },
    { value: 'number', text: 'Number' },
    { value: 'boolean', text: 'Boolean' },
    { value: 'phone', text: 'Phone' },
    { value: 'date', text: 'Date' },
    { value: 'array', text: 'Array' },
  ]

  //// schema variable defined in layout view globaly
  $(schema).each(function () {
    if ($("#hdnId").val() != this._id) {
      types.push({ value: this._id, text: this.title })
    }
  })

  $html.find('[data-name="ddlType"]').attr({
    'id': 'ddlType'
  }).editable({
    mode: 'inline',
    type: 'select',
    value: 'text',
    source: types,
    emptytext: 'Select type',
    success: function (response, newValue) {
      let popover = $html.find('[data-name="txtProperty"]').data('bs.popover');
      if ($.inArray(newValue.toLowerCase(), ['text', 'email', 'phone']) > -1) {
        popover.options.content = $('#textProperty').html();
      } else if ($.inArray(newValue.toLowerCase(), ['number', 'boolean', 'date', 'array']) > -1) {
        popover.options.content = $('#' + newValue.toLowerCase() + 'Property').html();
      } else {
        popover.options.content = $('#schemaProperty').html();
      }
    }
  })

  //set txtName value
  $propertyHtml = $('#textProperty').html()
  if (element != undefined) {
    $html.find('[data-name="txtName"]').editable('setValue', element.name);
    $html.find('[data-name="ddlType"]').editable('setValue', element.type);
    $html.find('#txtnotes').val(element.notes)
    $html.data(element.property);
    // if ($.inArray(element.type.toLowerCase(), ['text', 'email', 'phone']) > -1) {
    //   $propertyHtml = $('#textProperty').html();
    // } else {
    //   $propertyHtml = $('#' + element.type.toLowerCase() + 'Property').html();
    // }

    if ($.inArray(element.type.toLowerCase(), ['text', 'email', 'phone']) > -1) {
      $propertyHtml = $('#textProperty').html();
    } else if ($.inArray(element.type.toLowerCase(), ['number', 'boolean', 'date', 'array']) > -1) {
      $propertyHtml = $('#' + element.type.toLowerCase() + 'Property').html();
    } else {
      $propertyHtml = $('#schemaProperty').html();
    }
  }

  $html.find('[data-name="txtProperty"]').popover({
      html: true,
      content: $propertyHtml,
    }).on('click', function () {
      $('[data-toggle=popover]').not(this).popover('hide');

      // put old value

      let propertyData = $html.data();
      if (propertyData != undefined) {
        $("#txtMin").val(propertyData.min);
        $("#txtMax").val(propertyData.max);
        $("#txtMinDate").val(propertyData.mindate);
        $("#txtMaxDate").val(propertyData.maxdate);
        $("#txtAllowedValue").val(propertyData.allowedValue);
        $("#txtdefault").val(propertyData.defaultValue);
        $("#txtPlaceholder").val(propertyData.placeholder);
        $("#txtHelper").val(propertyData.helper);
        $("#txtRegEx").val(propertyData.regEx);
        $("#ckbSchemaOptional").prop('checked', propertyData.optional);
        $("#txtarray").val(propertyData.array);
        $("#ckbSchemaType").prop('checked', propertyData.IsArray);

      }

      $("button[data-popoverdismiss='true']").click(function () {
        $('[data-toggle=popover]').popover('hide');
      });
      $("#saveProperty").click(function () {
        $html.data({
          min: $("#txtMin").val(),
          max: $("#txtMax").val(),
          mindate: $("#txtMinDate").val(),
          maxdate: $("#txtMaxDate").val(),
          allowedValue: $("#txtAllowedValue").val(),
          defaultValue: $("#txtdefault").val(),
          placeholder: $("#txtPlaceholder").val(),
          helper: $("#txtHelper").val(),
          regEx: $("#txtRegEx").val(),
          optional: $("#ckbSchemaOptional").prop('checked'),
          array: $("#txtarray").val(),
          IsArray: $("#ckbSchemaType").prop('checked')
        });
        $('[data-toggle=popover]').popover('hide');
        ///////
        let listproperty = $html.data();
        var html = '';
        $.each(listproperty, function (key, value) {
          if (value != undefined) {
            if (value != "") {
              html += '<li style="display:inherit">' + key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value + '</li>';
            }
          }
        });
        $html.closest('tr').find('#listProperty').html(html)
      });
    })
    // console.log($html)
  return $html;
}

let deleteSchemaRow = function (self) {
  if (confirm("Are you sure you want to delete?")) {
    $(self).closest('tr').remove()
  }
}

let save = function () {
  $(".btnSubmit").progressbarStart();
  if (!isValid()) {
    $(".btnSubmit").progressbarEnd();
    return false;
  }

  let schema = {
    title: $('#txtSchemaName').val(),
    templateType: 'html',
    template: tinymce.get('templateHtml').getContent(),
    entity: []
  };

  $('#tableSchema > tbody tr:not(:last-child)').each(function () {
    // alert(JSON.stringify($(this).data()));
    schema.entity.push({
      name: $(this).find("#txtName").editable('getValue')['txtName'],
      type: $(this).find("#ddlType").editable('getValue')['ddlType'],
      notes: $(this).find("#txtnotes").val(),
      property: $(this).data()
    })
  })

  let id = $("#hdnId").val()
  let url = host + 'schema';
  let type = 'POST'
  if (id !== 'undefined') {
    url = host + 'schema/' + id;
    type = 'PUT'
  }
  // console.log("TYPE",type, dbhost ,schema);
  $.ajax({
    url: url,
    type: type,
    data: schema,
    success: function (result) {
      // alert('Success!');
      toastr.success('Data Saved!', 'Successfully');
      if (!result.error) {
        $(".btnSubmit").progressbarEnd();
        setTimeout(function () {
          window.location.href = "/"
        }, 1000);
      }
    }
  });
}

let isValid = function () {
  let valid = true;

  $helpSchemaName = $('small[for="txtSchemaName"]')
  $helpTblSchema = $('small[for="tblSchema"]')
  $helpSchemaName.hide();
  $helpTblSchema.hide();

  if ($('#txtSchemaName').val().trim() == '') {
    valid = false;
    $helpSchemaName.show();
  }

  $('#tableSchema > tbody tr:not(:last-child)').each(function () {
    if ($.trim($(this).find("#txtName").editable('getValue')['txtName']) === '') {
      valid = false;
      $helpTblSchema.show()
      return false;
    }
  })

  return valid;
}
