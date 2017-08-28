
// $(function () {
//   ImpletementSocekt();
// });

// let ImpletementSocekt = function () {
//   var socket = io(host);
//   console.log('host from schema',host);
//   var client = feathers()
//     .configure(feathers.hooks())
//     .configure(feathers.socketio(socket));
//   var schemaService = client.service('schema');

//   schemaService.on('created', function (schemainstance) {
//     console.log('created:',schemainstance);
//     // var entityData = '';
//     // for(var i=0; i<schemainstance.entity.length; i++){
//     //   entityData += '<tr><td>'+schemainstance.entity[i].name+'</td><td>'+schemainstance.entity[i].type+'</td><td>'+schemainstance.entity[i].notes+'</td></tr>';
//     // }
//     // $('#tblView').append('<tr data-id="'+schemainstance._id+'"> <td>'+schemainstance.title+'</td><td style="width:200px;text-align:center;"> <a href="/schema/edit/'+schemainstance._id+'" title="Edit" style="font-size: 15px;"> <i class="glyphicon glyphicon-edit"></i></a> <a title="View" style="font-size: 15px;margin-left:8px;" role="button" data-toggle="collapse" href="#'+schemainstance._id+'" aria-expanded="false" aria-controls="'+schemainstance._id+'"> <i class="glyphicon glyphicon-eye-open"></i></a> <a onclick="deleteSchema(this,&quot;'+schemainstance._id+'&quot;)" title="Delete" style="font-size: 15px; margin-left:8px;" class="text-danger"><i class="glyphicon glyphicon-trash"></i></a></td></tr><tr id="'+schemainstance._id+'" role="tabpanel" aria-labelledby="headingOne" data-id="'+schemainstance._id+'" class="panel-collapse collapse"> <td colspan="2"> <div class="col-md-12"> <table class="table"> <thead> <tr> <th>Name</th> <th>Type</th> <th>Notes</th> </tr></thead> <tbody>'+entityData+'</tbody> </table> </div></td></tr>')
//   });

//   schemaService.on('removed', function (schemainstance) {
//     console.log('removed:',schemainstance);
//     // $('#tblView > tbody tr[data-id="'+schemainstance._id+'"]').each(function(){
//     //   $(this).remove();
//     // })
//   });

//   schemaService.on('updated', function (schemainstance) {
//     console.log('updated:',schemainstance);
//     // var entityData = '';
//     // for(var i=0; i<schemainstance.entity.length; i++){
//     //   entityData += '<tr><td>'+schemainstance.entity[i].name+'</td><td>'+schemainstance.entity[i].type+'</td><td>'+schemainstance.entity[i].notes+'</td></tr>';
//     // }
//     // $('#tblView > tbody tr[data-id="'+schemainstance._id+'"]').eq(0).html('<td>'+schemainstance.title+'</td><td style="width:200px;text-align:center;"> <a href="/schema/edit/'+schemainstance._id+'" title="Edit" style="font-size: 15px;"> <i class="glyphicon glyphicon-edit"></i></a> <a title="View" style="font-size: 15px;margin-left:8px;" role="button" data-toggle="collapse" href="#'+schemainstance._id+'" aria-expanded="false" aria-controls="'+schemainstance._id+'"> <i class="glyphicon glyphicon-eye-open"></i></a> <a onclick="deleteSchema(this,&quot;'+schemainstance._id+'&quot;)" title="Delete" style="font-size: 15px; margin-left:8px;" class="text-danger"><i class="glyphicon glyphicon-trash"></i></a></td>')
//     // $('#tblView > tbody tr[data-id="'+schemainstance._id+'"]').eq(1).html('<td colspan="2"> <div class="col-md-12"> <table class="table"> <thead> <tr> <th>Name</th> <th>Type</th> <th>Notes</th> </tr></thead> <tbody>'+entityData+'</tbody> </table> </div></td>')
    

//     // // var index = $('#tblView > tbody tr[data-id="'+schemainstance._id+'"]').index();
//     // // console.log(index);
//     // // console.log($('#tblView > tbody tr:eq(8)').html());
//     // // $('#tblView > tbody tr:eq('+index+')').html('<td>'+schemainstance.title+'</td><td style="width:200px;text-align:center;"> <a href="/schema/edit/'+schemainstance._id+'" title="Edit" style="font-size: 15px;"> <i class="glyphicon glyphicon-edit"></i></a> <a title="View" style="font-size: 15px;margin-left:8px;" role="button" data-toggle="collapse" href="#'+schemainstance._id+'" aria-expanded="false" aria-controls="'+schemainstance._id+'"> <i class="glyphicon glyphicon-eye-open"></i></a> <a onclick="deleteSchema(this,&quot;'+schemainstance._id+'&quot;)" title="Delete" style="font-size: 15px; margin-left:8px;" class="text-danger"><i class="glyphicon glyphicon-trash"></i></a></td>');
//     // // $('#tblView > tbody tr:eq('+(index+1)+')').html('<td colspan="2"> <div class="col-md-12"> <table class="table"> <thead> <tr> <th>Name</th> <th>Type</th> <th>Notes</th> </tr></thead> <tbody>'+entityData+'</tbody> </table> </div></td>');
    
    
//     // // var html = '';
//     // // $('#tblView > tbody tr[data-id="'+schemainstance._id+'"]').each(function(){
//     // //   html += '<tr>'+ $(this).html()+'</tr>'
//     // // });
//     // // console.log(html);

//   });
// }