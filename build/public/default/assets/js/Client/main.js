var hideConfirmForm;window.showAlert=function(o,n,i){$("#confirmModal").modal({backdrop:"static",keyboard:!1}),$("#confirmModal #confirmModalLabel").text(n||"提示"),$("#confirmModal .modal-body").text(o),$("#confirmModal .modal-footer .btn-default").text("确定"),$("#confirmModal #btnConfirmSave").hide(),hideConfirmForm=function(){i&&i(),$("#confirmModal").hide()}},window.showConfirm=function(o,n,i){$("#confirmModal").modal({backdrop:"static",keyboard:!1}),$("#confirmModal #confirmModalLabel").text(n||"确认"),$("#confirmModal .modal-body").text(o),$("#confirmModal .modal-footer .btn-default").text("取消"),$("#confirmModal #btnConfirmSave").show(),hideConfirmForm=function(){i&&i(),$("#confirmModal").hide()}},$(document).ready(function(){$("#btnAsk").click(function(o){location.replace("/ask")}),$("#btnSearch").click(function(o){var n=$.trim($("#txtSearch").val());n.length>2?location.replace("/?q="+n):showAlert("搜索字数不能少于3个")})}),window.selfAjax=function(o,n,i,t){return loading(),$[o](n,i).then(function(o){return t(o),hideLoading(),o})},window.loading=function(){$("#loadingIndicator").modal({backdrop:"static",keyboard:!1})},window.hideLoading=function(){$("#loadingIndicator").modal("hide")},String.prototype.format=function(){var o=this;if(0==arguments.length)return null;for(var n=0;n<arguments.length;n++){var i=new RegExp("\\{"+n+"\\}","gm");o=o.replace(i,arguments[n])}return o};