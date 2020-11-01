$(document).ready(function () {
    // alert('abc');
    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();

    // 新增按鈕
    $("#addbutton").click(function () {
        $("#dialog-addconfirm").dialog({
            resizable: true,
            height: $(window).height() * 0.4,// dialog視窗度
            width: $(window).width() * 0.4,
            modal: true,
            buttons: {
                // 自訂button名稱
                "新增": function (e) {
                    var url = "ajax/ajaxCard";
                    var sex = $('input:radio:checked[name="addsex"]').val();
                    var cnname = $("#addcnname").val();
                    var enname = $("#addenname").val();
                    var tel = $("#addtel").val();
                    var email = $("#addemail").val();
                    var ajaxobj = new AjaxObject(url, 'json');
                    ajaxobj.sex = sex;
                    ajaxobj.cnname = cnname;
                    ajaxobj.enname = enname;
                    ajaxobj.tel = tel;
                    ajaxobj.email = email;
                    ajaxobj.add();

                    e.preventDefault(); // avoid to execute the actual submit of the form.
                },
                "重新填寫": function () {
                    $("#addform")[0].reset();
                },
                "取消": function () {
                    $(this).dialog("close");
                }
            }
        });
    })
    // 搜尋按鈕
    $("#searchbutton").click(function () {
        $("#dialog-searchconfirm").dialog({
            resizable: true,
            height: $(window).height() * 0.4,// dialog視窗度
            width: $(window).width() * 0.4,
            modal: true,
            buttons: {
                // 自訂button名稱
                "搜尋": function (e) {
                    var url = "ajax/ajaxCard";
                    // var data = $("#searchform").serialize();
                    var cnname = $("#secnname").val();
                    var enname = $("#seenname").val();
                    var sex = $('input:radio:checked[name="sesex"]').val();
                    var ajaxobj = new AjaxObject(url, 'json');
                    ajaxobj.cnname = cnname;
                    ajaxobj.enname = enname;
                    ajaxobj.sex = sex;
                    ajaxobj.search();

                    e.preventDefault(); // avoid to execute the actual submit of the form.
                },
                "重新填寫": function () {

                    $("#searchform")[0].reset();
                },
                "取消": function () {
                    $(this).dialog("close");
                }
            }
        });
    })
    // 修改鈕
    $("#cardtable").on('click', '.modifybutton', function () {
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.modify_get();
    })
    $("#cardtable").on('click', '.deletebutton', function () {
        var deleteid = $(this).attr('id').substring(12);
        var url = "ajax/ajaxCard";
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.id = deleteid;
        ajaxobj.delete();
    })

    // 自適應視窗
    $(window).resize(function () {
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.4;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.4;
        $("#dialog-confirm").dialog("option", "width", dWidth);
        $("#dialog-confirm").dialog("option", "height", dHeight);
    });
});
function refreshTable(data) {
    // var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var strsex = '';
        if (item.sex == 0)
            strsex = '<img src="./img/male.png" style="width: 50px;">';
        else
            strsex = '<img src="./img/female.png" style="width: 50px;">';
        var row = $("<tr></tr>");
        row.append($("<td></td>").html(strsex));
        row.append($('<td data-toggle="tooltip" title="' + item.cnname + '(' + item.enname + ')' + '"></td>').html(item.cnname));
        row.append($('<td data-toggle="tooltip" title="' + item.enname + '(' + item.cnname + ')' + '"></td>').html(item.enname));
        row.append($('<td data-toggle="popover" data-placement="bottom" title="聯絡方式：" data-content="' + item.tel + '"></td>').html(item.tel));
        row.append($("<td></td>").html(item.email));
        row.append($("<td></td>").html('<button id="modifybutton' + item.s_sn + '" class="modifybutton" style="font-size:30px;"><i class="fas fa-edit"></i><span class="glyphicon glyphicon-list-alt"></span></button>'));
        row.append($("<td></td>").html('<button id="deletebutton' + item.s_sn + '" class="deletebutton" style="font-size:30px;"><i class="fas fa-trash-alt"></i><span class="glyphicon glyphicon-trash"></span></button>'));
        $("#cardtable").append(row);
    });
}

function initEdit(response) {
  var modifyid = $("#cardtable").attr('id').substring(12);
  $("#mocnname").val(response[0].cnname);
  $("#moenname").val(response[0].enname);
  if (response[0].sex == 0) {
      $("#modifyman").prop("checked", true);
      $("#modifywoman").prop("checked", false);
  }
  else {
      $("#modifyman").prop("checked", false);
      $("#modifywoman").prop("checked", true);
  }
  $("#modifysid").val(modifyid);
  $("#dialog-modifyconfirm").dialog({
      resizable: true,
      height: $(window).height() * 0.4,// dialog視窗度
      width: $(window).width() * 0.4,
      modal: true,
      buttons: {
          // 自訂button名稱
          "修改": function (e) {
              // $("#modifyform").submit();
              var url = "ajax/ajaxCard";
              var cnname = $("#mocnname").val();
              var enname = $("#moenname").val();
              var sex = $('input:radio:checked[name="mosex"]').val();
              var ajaxobj = new AjaxObject(url, 'json');
              ajaxobj.cnname = cnname;
              ajaxobj.enname = enname;
              ajaxobj.sex = sex;
              ajaxobj.id = modifyid;
              ajaxobj.modify();

              e.preventDefault(); // avoid to execute the actual submit of the form.
          },
          "重新填寫": function () {
              $("#modifyform")[0].reset();
          },
          "取消": function () {
              $(this).dialog("close");
          }
      },
      error: function (exception) { alert('Exeption:' + exception); }
  });
}

/**
 * 
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert("Alert:");
}
AjaxObject.prototype.getall = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","tel":"0911-223-344","email":"peter@test.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","tel":"0922-334-455","email":"allen@test.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","tel":"0933-445-566","email":"sharon@test.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","tel":"0944-556-677","email":"yoki@test.com"}]';
  refreshTable(JSON.parse(response));
}
AjaxObject.prototype.add = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","tel":"0911-223-344","email":"peter@test.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","tel":"0922-334-455","email":"allen@test.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","tel":"0933-445-566","email":"sharon@test.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","tel":"0944-556-677","email":"yoki@test.com"},{"s_sn":"52","cnname":"新增帳號","enname":"NewAccount","sex":"1"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-addconfirm").dialog("close");
}
AjaxObject.prototype.modify = function () {
  response = '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","tel":"0922-334-455","email":"allen@test.com"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-modifyconfirm").dialog("close");
}
AjaxObject.prototype.modify_get = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","tel":"0911-223-344","email":"peter@test.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","tel":"0922-334-455","email":"allen@test.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","tel":"0933-445-566","email":"sharon@test.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","tel":"0944-556-677","email":"yoki@test.com"}]';
  initEdit(JSON.parse(response));
}
AjaxObject.prototype.search = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","tel":"0911-223-344","email":"peter@test.com"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-searchconfirm").dialog("close");
}
AjaxObject.prototype.delete = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","tel":"0911-223-344","email":"peter@test.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","tel":"0922-334-455","email":"allen@test.com"}]';
  refreshTable(JSON.parse(response));
}


  //十字聚焦變色
  tablecontent.addEventListener('mouseover', event => {
    var arr = Array.from(event.target.parentNode.parentNode.children)
    var index = [...event.target.parentNode.children].indexOf(event.target)

    arr.forEach(i => Array.from(i.children).forEach(j => j.style.backgroundColor = null))
    arr.forEach(k => k.children[index].style.backgroundColor = '#f7b50073')
  }, false)
  
  tablecontent.addEventListener('mouseleave', event => {
    var arr = Array.from(event.target.children)
    arr.forEach(i => Array.from(i.children).forEach(j => j.style.backgroundColor = null))
  }, false);



  //電話點擊提示
  $(function () { 
	$("[data-toggle='popover']").popover();
});