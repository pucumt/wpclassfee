function searchOrder(e){var a={name:$("#InfoSearch #name").val(),isChecked:$("#InfoSearch #isChecked").val()},t=e?"p="+e:"";$selectBody.empty(),selfAjax("post","/admin/question/search?"+t,a,function(e){if($selectBody.empty(),e&&e.questions.length>0){var a=function(e){var a="";switch(e){case 0:a='<a class="btn btn-default btnPass">通过</a><a class="btn btn-default btnRefuse">拒绝</a>';break;case 1:a='<a class="btn btn-default btnRefuse">拒绝</a>';break;default:a='<a class="btn btn-default btnPass">通过</a>'}return a},t=$(document.createDocumentFragment());e.questions.forEach(function(e){var n=$("<tr id="+e._id+"><td>"+e.createdName+'</td><td class="train" id="'+e._id+'">'+e.title+"</td><td>"+moment(e.updatedDate).format("YYYY-MM-DD HH:mm")+'</td><td><div class="btn-group">'+a(e.isChecked)+"</div></td></tr>");n.find(".btn-group").data("obj",e),t.append(n)}),$selectBody.append(t)}$("#selectModal #total").val(e.total),$("#selectModal #page").val(e.page),setPaging("#selectModal",e)})}$(document).ready(function(){$("#left_btnQuestion").addClass("active"),searchOrder()});var $selectBody=$(".content table tbody");$("#InfoSearch #btnSearch").on("click",function(e){searchOrder()}),$("#selectModal .paging .prepage").on("click",function(e){searchOrder(parseInt($("#selectModal #page").val())-1)}),$("#selectModal .paging .nextpage").on("click",function(e){searchOrder(parseInt($("#selectModal #page").val())+1)}),$("#gridBody").on("click","td .btnPass",function(e){var a=e.currentTarget,t=$(a).parent().data("obj");showConfirm("确定要通过"+t.title+"吗？"),$("#btnConfirmSave").off("click").on("click",function(e){selfAjax("post","/admin/question/pass",{id:t._id},function(e){$("#confirmModal").modal("hide"),e.sucess&&searchOrder(parseInt($("#selectModal #page").val()))})})}),$("#gridBody").on("click","td .btnRefuse",function(e){var a=e.currentTarget,t=$(a).parent().data("obj");showConfirm("确定要拒绝"+t.title+"吗？"),$("#btnConfirmSave").off("click").on("click",function(e){selfAjax("post","/admin/question/refuse",{id:t._id},function(e){$("#confirmModal").modal("hide"),e.sucess&&searchOrder(parseInt($("#selectModal #page").val()))})})});