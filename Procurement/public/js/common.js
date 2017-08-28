$.fn.progressbarStart = function() {
    return this.each(function() {
        var elem = $(this);
        $(this).addClass('disabled').css({ 'cursor': 'progress', 'pointer-events': 'none' }).prepend('<i class="fa fa-spinner fa-plus fa-spin fa-fw fa-1x"></i>');
    });
}

$.fn.progressbarEnd = function() {
    return this.each(function() {
        var elem = $(this);
        $(this).removeClass('disabled').css({ 'cursor': '', 'pointer-events': '' }).children('i').remove();
    });
}

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// let host = "http://localhost:3030/"
// let dbhost = "http://localhost:3000/api/"
// let Schemahost;
// let Instancehost;
// $.ajax({
//     url: dbhost + 'settings',
//     type: 'GET',
//     success: function (result) {
//       // alert('Success!'+JSON.stringify(result));
//         if(result.mongo.isdefault == 'true'){
//             Schemahost = host + 'm-schema/';
//             Instancehost = host + 'm-instance/';
//         }
//         else if(result.rethink.isdefault == 'true'){
//             Schemahost = host + 'r-schema/';
//             Instancehost = host + 'r-instance/';
//         }      
//     }
// });