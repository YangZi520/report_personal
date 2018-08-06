String.prototype.replaceAll = function(s1,s2){
　　return this.replace(new RegExp(s1,"gm"),s2);
}
//分页对象
var page = null;
//out.row结果集记录数
var rowRecordsCount = 0;
function Page()
{
	this.startIndex=0;
	this.currentPage=1;
	this.perPage=10;
	this.totalPage=1;
}
function firstPage()
{
	if(page.currentPage!=1)
	{
		page.currentPage=1;
		page.startIndex=0;
		_query(page);
	}
}
function lastPage()
{
	if(page.currentPage!=1&&page.currentPage<=page.totalPage)
	{
		page.currentPage-=1;
		page.startIndex-=page.perPage;
		_query(page);
	}
}
function nextPage()
{
	if(page.currentPage!=page.totalPage&&page.currentPage<page.totalPage)
    {
        page.currentPage+=1;
        page.startIndex+=page.perPage;
		_query(page);
    }
}
function endPage()
{
	if(page.currentPage!=page.totalPage)
	{
		page.currentPage=page.totalPage;
		page.startIndex=(page.totalPage-1)*page.perPage;
		_query(page);
	}
}
function currentPage()
{
	let currentPage=$(".currentPage").val();
	if(currentPage>0&&currentPage<=page.totalPage&&currentPage!=page.currentPage)
	{
		page.currentPage=currentPage;
		page.startIndex=(page.currentPage-1)*page.perPage;
		_query(page);
	}
}
function getReportServerPath()
{
	var url = window.location.href;
    var ip = url.substring(url.indexOf("//")+2,url.indexOf(":",url.indexOf(":")+1));
    return "http://"+ip+":8080/reportServer";
}
//打印
function printReport()    
{    
    $("body div").hide();
    window.print();
    $("body div").show();
} 
function _query(obj)
{
	let perPage=parseInt($(".perPage").val());
	if(!obj){
		page = new Page();
	}else{
		if(perPage<=0){
			return ;
		}
	}
	page.perPage=perPage;
	var queryParams = getQueryParam();
    if(out.first)
    {
        for(let i in out.first.id)
        {
            $("td[name='"+out.first.namespace+"."+out.first.sqlid+"."+out.first.id[i]+"']").text('');
        }
        var url = getReportServerPath()+"/select/execSelect/"+out.first.namespace+"/"+out.first.sqlid;
        $.ajax({
            url:url,
            type:'post',
            async:true,
            contentType:'application/json;charset=UTF-8',
            data:JSON.stringify([queryParams.first[out.first.namespace+"."+out.first.sqlid]]),
            dataType:'json',
            headers:{'credentials':getCookie("credentials")},
            success:function(ret){
				if(ret.resultCode=='1000'){
					let data = ret.data.list;
					for(let i in out.first.id)
					{
						$("td[name='"+out.first.namespace+"."+out.first.sqlid+"."+out.first.id[i]+"']").text(data[0][out.first.id[i].toUpperCase()]);
					}
				}
            }
        });
    }
    if(out.row)
    {
		$("body>div>input").attr("disabled",true);
		showLoading();
        var rowIndex = $("[name='"+out.row.namespace+"."+out.row.sqlid+"']").get(0).rowIndex;
        var table = $("table").get(0);
        for(let i=rowIndex+rowRecordsCount;i>rowIndex;i--)
        {
            table.deleteRow(i);
        }
		rowRecordsCount = 0;
        var joinData = {};
        var join_num = 0;
        var row_size = out.row.join.length;
        for(let i=0;i<row_size;i++)
        {
            let url = getReportServerPath()+"/select/execSelect/"+out.row.join[i].namespace+"/"+out.row.join[i].sqlid;
            $.ajax({
                url:url,
                type:'post',
                async:true,
                contentType:'application/json;charset=UTF-8',
                dataType:'json',
                data:JSON.stringify([queryParams.row[out.row.join[i].namespace+"."+out.row.join[i].sqlid]]),
                headers:{'credentials':getCookie("credentials")},
                success:function(ret){
					if(ret.resultCode=='1000'){
						let data = ret.data.list;
						for(let j=0;j<data.length;j++)
						{
							let key = out.row.join[i].namespace+"."+out.row.join[i].sqlid+"."+data[j][out.row.join[i].joinkey.toUpperCase()];
							joinData[key] = data[j];
						}
					}
                    join_num++;
                }
            });
        }
        var inteval = setInterval(function(){
        if(join_num!=row_size)
        {
            return;
        }
        var url = getReportServerPath()+"/select/execSelect/"+out.row.namespace+"/"+out.row.sqlid;
        $.ajax({
           url:url,
           type:'post',
           async:true,
           contentType:'application/json;charset=UTF-8',
           data:JSON.stringify([queryParams.row[out.row.namespace+"."+out.row.sqlid],page]),
           dataType:'json',
           headers:{'credentials':getCookie("credentials")},
           success:function(ret){
			   stopLoading();
			   if(ret.resultCode=='1000'){
				   let data = ret.data.list;
				   page.totalPage= Math.ceil(ret.data.totalSize/page.perPage);
				   $(".currentPage").val(page.currentPage);
				   $(".perPage").next("font").text("条记录,总"+page.totalPage+"页");
				   for(let i=0;i<data.length;i++)
				   {
					   rowRecordsCount++;
					   $("[name='"+out.row.namespace+"."+out.row.sqlid+"']:first").after($("[name='"+out.row.namespace+"."+out.row.sqlid+"']:first").clone());
					   $("[name='"+out.row.namespace+"."+out.row.sqlid+"']:eq(1)").show();
					   for(let j in out.row.id)
					   {
						   var count = 0;
						   for(let k in out.row.link)
						   {
							   if(out.row.link[k].field==out.row.id[j])
							   {
								   count = 1;
								   var a = "<a href="+out.row.link[k].dest+"?queryType=hyperlink";
								   for(let m in out.row.link[k].param)
								   {
									   a+="&"+out.row.link[k].param[m].desField+"="+data[i][out.row.link[k].param[m].srcField.toUpperCase()];
								   }
								   a+="></a>";
								   $("td[name='"+out.row.namespace+"."+out.row.sqlid+"."+out.row.id[j]+"']:eq(1)").append(a);
								   $("td[name='"+out.row.namespace+"."+out.row.sqlid+"."+out.row.id[j]+"']:eq(1)>a").text(data[i][out.row.id[j].toUpperCase()]);
							   }
						   }
						   if(count==0)
						   {
							   $("td[name='"+out.row.namespace+"."+out.row.sqlid+"."+out.row.id[j]+"']:eq(1)").text(data[i][out.row.id[j].toUpperCase()]);
						   }
					   }
					   for(let x=0;x<out.row.join.length;x++)
					   {
						   for(let y in out.row.join[x].id)
						   {
							   let obj = joinData[out.row.join[x].namespace+"."+out.row.join[x].sqlid+"."+data[i][out.row.join[x].joinkey.toUpperCase()]];
							   if(obj)
							   {
								   $("td[name='"+out.row.join[x].namespace+"."+out.row.join[x].sqlid+"."+out.row.join[x].id[y]+"']:eq(1)").text(obj[out.row.join[x].id[y].toUpperCase()]);
							   }
						   }
						}
						
				   }
			   }
          },
		  complete:function()
		          {
					$("body div input").attr("disabled",false);
			      }
       });
       clearInterval(inteval);
       },1000);
    }
}
function getParamValue(name){
	let nameVal = $("dd[name='"+name+"']>a").attr('name');
	if(!nameVal){
	    let param = null;
		let value = null;
		for(let i=0;i<paramList.length;i++){
		    param = paramList[i];
			value = param.value;
			if(param.id==name){
				for(let y=0;y<value.length;y++){
					if(nameVal=== undefined){
						nameVal = "";
						nameVal+=value[y].name;
					}else{
						nameVal+=","+value[y].value;
					}
				}
			}
		}
	}
	nameVal = "'"+nameVal.replaceAll(",","','")+"'";
	return nameVal;
}
function getParamObj()
{
    var url = decodeURIComponent(window.location.href);
    var arr = url.split("?");
    if(arr.length==1)
    {
        return {queryType:'web'};
    }
    var result = arr[1];
    var keyValue = result.split("&");
    var obj = {};
    for (var i = 0; i < keyValue.length; i++)
    {
        var item = keyValue[i].split("=");
        //$("input[name='"+item[0]+"']").val(item[1]);
	$("dl[name='"+item[0]+"']>dd>a:contains('"+item[1]+"')").trigger("click");
        obj[item[0]] = item[1];
    }
    return obj;
}
function getCookie(cookie_name)
{
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if(cookie_pos != -1)
    {
        cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if(cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
        var value = decodeURIComponent(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}
/*等待效果*/
var spinner = new Spinner({
		lines: 9,
 		length: 0,
 		width: 15,
 		radius: 20,
 		corners: 1,
 		rotate: 0,
 		direction: 1,
 		color: '#0101DF',
 		speed: 1, 
 		trail: 34,
 		shadow: false,
 		hwaccel: false,
 		className: 'spinner',
 		zIndex: 2e9,
 		top: '50%',
 		left: '50%'
});
function showLoading()
{
	var target = $("#loading").get(0);
	spinner.spin(target);
}
function stopLoading()
{
	spinner.stop();
}
/**等待效果*/
$(document).ready(function(){
	$(".select dd").click(function () {
		//非更多和多选按钮事件
		if(!$(this).hasClass("more")&&!$(this).hasClass("multi")){
			if($(this).parents('li:first').hasClass("multiple")){
				if($(this).hasClass("select-all")){
					$(this).addClass("selected").siblings().removeClass("selected");
					$(this).parents('li:first').find('i').each(function(){$(this).removeClass("selected")});
				}else{
					$(this).parents('li:first').find('.select-all').removeClass("selected");
					if($(this).find("i").hasClass("selected")){
						$(this).find("i").removeClass("selected");
					}else{
						$(this).find("i").addClass("selected");
					}
				}
			}else{
				$(this).addClass("selected").siblings().removeClass("selected");
			}
			let name = $(this).parents('dl:first').attr('name');
			if($(this).hasClass("select-all")){
				$("dd[name='"+name+"']").remove();
			}else{
				var copyThisA = $(this).clone();
				let chooseTitle = $("dl[name='"+name+"'] dt").text();
				let chooseText = "";
				let chooseName = "";
				//已选条件判断逻辑
				if($("dd[name='"+name+"']").length > 0){
					if($(this).parents('li:first').hasClass("multiple")){
						$(this).parents('li:first').find("i.selected").each(function(){
							chooseText=chooseText+$(this).parent().text()+",";
							chooseName=chooseName+$(this).parent().attr("name")+",";
						});
						if(chooseText.lastIndexOf(",")!=-1){
							chooseText = chooseText.substring(0,chooseText.lastIndexOf(","));
							chooseName = chooseName.substring(0,chooseName.lastIndexOf(","));
							$("dd[name='"+name+"'] a").html(chooseText);
							$("dd[name='"+name+"'] a").attr('name',chooseName);
						}else if(chooseText==""){
							$(this).parents('li:first').find(".select-all").addClass("selected");
							$(".select-result dd[name='"+name+"']").remove();
						}
					}else{
						$("dd[name='"+name+"'] a").html($(this).text());
						$("dd[name='"+name+"'] a").attr('name',$(this).find('a').attr('name'));
					}
				}else{
					copyThisA.html(chooseTitle+copyThisA.html());
					$(".select-result dl").append(copyThisA.attr("name", name));
				}
			}
		}
		//更多按钮事件
		if($(this).hasClass("more")){
			if($(this).parents('li:first').hasClass("li_hidden")){
				$(this).parents('li:first').removeClass('li_hidden');
			}else{
				$(this).parents('li:first').addClass('li_hidden');
			}
		}
		//多选按钮事件
		if($(this).hasClass("multi")){
			if($(this).parents('li:first').hasClass("multiple")){
				$(this).parents('li:first').find("select-all").addClass("selected");
				$(this).parents('li:first').removeClass('li_hidden').removeClass('multiple');
			}else{
				$(this).parents('li:first').removeClass('li_hidden').addClass('multiple');
				$(this).parents('li:first').find('i').each(function(){$(this).removeClass("selected")});
				$(this).parents('li:first').find('dd').each(function(){$(this).removeClass("selected")});
			}
		}
	});
	
	$(document).delegate(".select-result dd:not('select-no')","click", function () {
		let name = $(this).attr("name");
		$(this).remove();
		$("dl[name='"+name+"'] i").each(function(){$(this).removeClass("selected")});
		$(".select dl[name='"+name+"'] .select-all").addClass("selected").siblings().removeClass("selected");
	});
	
	$(document).delegate(".select dd","click", function () {
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
	
});
$(function(){
	//判断是否是超链接跳转查询,必须放在查询参数绑定点击事件之后。
	if(out.row)
	{
		page=new Page();
	}
    var obj = getParamObj();
    if(obj.queryType=="hyperlink")
    {
        _query();
    }
	//分页查询
	$(".currentPage").keydown(function(e){
		if(e.keyCode==13)
		{
			currentPage();
		}
	});
	//初始化每页记录数10条
	$(".perPage").val(10);
	//分页查询
	$(".perPage").keydown(function(e){
		if(e.keyCode==13)
		{
			_query();
		}
	});
});