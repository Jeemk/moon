var setting = {
        data: {  
            simpleData: {  
                enable: true  
            }  
        },  
		async: {
			enable: true,
			url:contextPath+"/role/getRoleData",
			autoParam:["id"],
			dataType:'json',
			dataFilter: filter
		},
		callback: {
			onRightClick: function(event, treeId, treeNode){
				$.fn.zTree.getZTreeObj("roleTree").selectNode(treeNode);
				if ($.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0]&&$.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0].id!=-1){
				$("*:not('.ztree')").one("click",function(e){
					 $("#rmenu").css("display","none");
					// $("*:not('.ztree')").unbind("click");
				});
				$("#rmenu").css("left",event.pageX).css("top",event.pageY).css("display","inline");
				}
				else{
					$("#rmenu").css("display","none");
				}
				
			}
		}

}; 

var znodes = [{name:'角色管理',id:-1,isParent:true}];

function filter(treeId, parentNode, childNodes) {
	if (!childNodes) 
		{
		return null;
		}
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].roleName.replace(/\.n/g, '.');
		childNodes[i].isParent = true;
	}
	return childNodes;
}
 
 function closeRMenu(){
	
		 $("#rmenu").css("display","none");
		 $("*").unbind("mousedown");
 }
 var ztree;
$(document).ready(function(){
	$("#rmenu").menu();
	$.fn.zTree.init($("#roleTree"), setting,znodes);
	 ztree = $.fn.zTree.getZTreeObj("roleTree");
});

function addRole(){
	$("#roleForm").dialog({
		modal:true,
		title:'添加角色',
		buttonAlign:'center',
		show:'flod',
		hide: "explode",
		buttons:[{
			text:'添加',
			click:function(){
				$("#roleForm").ajaxSubmitForm(contextPath+"/role/addRole",{"role.parentId":$.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0].id},
						function(){
					$("#roleForm").dialog("close");
					$("#roleForm").reset();
					
					var nodes = ztree.getSelectedNodes();
					ztree.reAsyncChildNodes(nodes[0],"",true);
					ztree.expandNode(nodes[0],true);
				},
						function(){alert("服务器出错，请稍后再试...");});
				
			}
		},{
			text:'取消',
			click:function(){
				$("#roleForm").dialog("close");
				$("#roleForm").reset();
			}
			}
		 
		         ]
	});
}

function deleteRole(){
	if(ztree.getSelectedNodes().length>=1){
		if(confirm("确认要删除该角色吗?")){
			 $.post(contextPath+"/role/logicDeleteRole",{ids:ztree.getSelectedNodes()[0].id},function(result){
				 ztree.reAsyncChildNodes(ztree.getSelectedNodes()[0].getParentNode(),"refresh",true);
					ztree.expandNode(ztree.getSelectedNodes()[0].getParentNode(),true); 

				  });
		}
	}
}

function editRole(){
	 
	  $(":input[name='role.roleName']","#roleForm").val($.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0].name);
	$("#roleForm").dialog({
		modal:true,
		title:'编辑角色',
		buttonAlign:'center',
		show:'flod',
		hide: "explode",
		buttons:[{
			text:'保存',
			click:function(){
				$("#roleForm").ajaxSubmitForm(contextPath+"/role/updateRole",{"role.id":$.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0].id},
						function(){
					$("#roleForm").dialog("close");
					var nodes = ztree.getSelectedNodes();
					nodes[0].name = $(":input[name='role.roleName']","#roleForm").val();
					ztree.updateNode(nodes[0]);
					$("#roleForm").reset();
					//ztree.reAsyncChildNodes(nodes[0].getParentNode(),"",true);
					//ztree.expandNode(nodes[0].getParentNode(),true);
				},
						function(){alert("服务器出错，请稍后再试...");});
				
			}
		},{
			text:'取消',
			click:function(){
				$("#roleForm").dialog("close");
				$("#roleForm").reset();
			}
			}
		 
		         ]
	});  
}

function assignMenu(){
	var menuTreeSetting = {
	        data: {  
	            simpleData: {  
	                enable: true  
	            }  
	        },  
	        check:{
	        	enable:true,
	        	chkStyle:'checkbox'
   
	        },
			async: {
				enable: true,
				url:contextPath+"/menu/getAssignMenuData",
				autoParam:["id=pid"],
				dataType:'json',
				otherParam:{rid:ztree.getSelectedNodes()[0].id},
				dataFilter: filter
			}

	}; 
	function filter(treeId, parentNode, childNodes) {
	if (!childNodes) 
		{
		return null;
		}
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].menuName.replace(/\.n/g, '.')+"   路径："+childNodes[i].url;
		childNodes[i].url = "";
		childNodes[i].isParent = true;
	}
	return childNodes;
}
	var menuNodes = [{name:'菜单管理',id:-1,isParent:true,checked:true}];
	$.fn.zTree.init($("#menuTree"), menuTreeSetting,menuNodes);
	$("#menuTree").dialog({
		modal:true,
		title:'分配菜单',
		width:500,
		buttonAlign:'center',
		show:'flod',
		hide: "explode",
		buttons:[{
			text:'保存',
			click:function(){
				var ids="",checkStatus="" ;
				$.each($.fn.zTree.getZTreeObj("menuTree").getChangeCheckedNodes(),function(index,e){
					ids+="ids="+e.id+"&";
					checkStatus+="checkStatus="+e.checked+"&";
				});
				alert(ids+checkStatus+"rid="+ztree.getSelectedNodes()[0].id);
				$.post(contextPath+"/menu/assignMenu",ids+checkStatus+"rid="+ztree.getSelectedNodes()[0].id,function(result){
					alert("成功");
				});
				/* $("#menuTree").ajaxSubmitForm(contextPath+"/role/updateRole",{"role.id":$.fn.zTree.getZTreeObj("roleTree").getSelectedNodes()[0].id},
						function(){
					$("#roleForm").dialog("close");
					var nodes = ztree.getSelectedNodes();
					nodes[0].name = $(":input[name='role.roleName']","#roleForm").val();
					ztree.updateNode(nodes[0]);
					$("#roleForm").reset();
					//ztree.reAsyncChildNodes(nodes[0].getParentNode(),"",true);
					//ztree.expandNode(nodes[0].getParentNode(),true);
				},
						function(){alert("服务器出错，请稍后再试...");}); */
				
			}
		},{
			text:'取消',
			click:function(){
				$("#menuTree").dialog("close");
			}
			}
		 
		         ]
	});
}

function assignPermission(){
	var rid = ztree.getSelectedNodes()[0].id;
	if(!rid)
		return false;
	var grid = $("#permissionTable").flexigrid({
		url: contextPath+'/permission/getPermissionDataByRole?rid='+rid,
		dataType: 'json',
		singleSelect:false,
		colModel : [
			{display: 'ID', name : 'id', width : 20, sortable : false, align: 'center'},
			{display: '权限代码', name : 'code', width : 150, sortable : false, align: 'center'},
			{display: '权限名称', name : 'name', width :250, sortable : false, align: 'center'}
			
			],
		searchitems : [
			{display: '权限代码', name : 'code'}
			],
		sortname: "id",
		sortorder: "asc",
		usepager: true,
		title: '权限列表',
		useRp: true,
		rp: 15,
		showTableToggleBtn: true,
		width: '100%',
		height: 200
	});   
	$(grid).flexReload({url: contextPath+'/permission/getPermissionDataByRole?rid='+rid});
	$(".flexigrid").dialog({
		modal:true,
		title:'分配权限',
		width:480,
		buttonAlign:'center',
		show:'flod',
		hide: "explode",
		buttons:[{
			text:'确定',
			click:function(){
				var selectRows = $('.trSelected', grid);
				var ids = "",status="";
		/* 		$.each(selectRows,function(index,e){
					ids+="ids="+$(e).attr("id").substring(3)+"&";
				}); */
				$($(grid).flexChangedRows()).each(function(){
					ids +="ids="+$(this).val()+"&";
					status += "status="+($(this).attr("checked")=="checked")+"&";
				});
				if(ids!="")
				  $.post(contextPath+"/permission/assignPermission",ids+status+"rid="+ztree.getSelectedNodes()[0].id,function(result){
					alert("成功");
				});  
			}
		},{
			text:'取消',
			click:function(){
				$(this).dialog("close");
			}
		}]
	});
}
