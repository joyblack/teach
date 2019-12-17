//点击导航菜单
function jumpAjaxPage(urlt,flag){
	 
	$("#huilan-aikf-container").hide();
	if(urlt=="register"){

		if($("#modalFenZhan") !=null && ""!=$("#modalFenZhan")){
			$("#orgName_sn").attr("data-toggle","modal");
			$("#orgName_sn").attr("data-target","#modalFenZhan");
			$("#orgName_sn").click();

		}

		 
	 }
	// 清除搜索的内容
//	$('#search_value').val('');
	var orgName_sn = $('#orgName_sn').val();
	var logined = false;
	if(flag == 'needLogin'){
		$.ajax({
			async:false,
			url:basePath+'/user/userIsLogin?orgName_sn='+orgName_sn,
			type:"post", 
			success:function(data){
				if(data['code'] != 200){
					//alert('请您先登录！');
					window.location.href="/";
					return;
				}else{
					logined = true;
				}
			},
			error:function(XMLResponse){
			}
		});
	}else{
		logined = true;
	}
	$.ajax({
		async:true,
		url:basePath+'/'+urlt,
		type:"get", 
		data:{'orgNameSn':orgName_sn,'r':Math.random()},
		success:function(data){
			 
			$("#ajaxMainContent").html(data);
		},
		error:function(XMLResponse){
		}
	});
	if(urlt=='user/myRecord'){
		$('.nav li a').removeClass('current');
		document.getElementById('id_userCenter').className="current";
	}
	if(logined){
	}
}
// 课程搜索
function index_searchCourse(){
	//alert('--- 点击搜索课程信息！');
	var search_value = $('#search_value').val();
	$('#search_value').val('');
	$.ajax({
		async:true,
		url:basePath+'/course/courseList',
		type:"post", 
		data:{'search_value':search_value, 'r':Math.random()},
		success:function(data){
			$('.nav li a').removeClass('current');
			$('#id_course').addClass('current');
			$("#ajaxMainContent").html(data);
		},
		error:function(XMLResponse){
		}
	});
}

function clickFootor(idstr){
//	$('#'+idstr).click();
	document.getElementById(idstr).click();
}

$(function(){
	$('.nav li a').click(function(){
		$('.nav li a').removeClass('current');
		$(this).addClass('current');
	});
	
});
function getCourseUp(){
	var orgName_sn = $('#orgName_sn').val();
	$.ajax({
		type:"get",
		async:true,
		url:"/course/getCourseUp2",
		dataType:"json",
		data:{'offset':0,'size':2,'orgNameSn':orgName_sn},
		success:function(dataJson){
			var html = template('newCourseUp', dataJson);
			document.getElementById("course1").innerHTML = html;
		}
	});
}
function getCourseDown(){
	var orgName_sn = $('#orgName_sn').val();
	$.ajax({
		type:"get",
		async:true,
		url:"/course/getCourseUp2",
		dataType:"json",
		data:{'offset':2,'size':4,'orgNameSn':orgName_sn},
		success:function(dataJson){
			var html = template('newCourseDown', dataJson);
			document.getElementById("course2").innerHTML = html;
		}
	});
}
function getGradesTop2(){
	var orgName_sn = $('#orgName_sn').val();
	$.ajax({
		type:"get",
		async:true,
		url:"/grade/getTopGrades",
		dataType:"json",
		data:{'offset':0,'size':2,'orgNameSn':orgName_sn},
		success:function(dataJson){
			template.helper("ctf", dateFormat);
			template.helper("btf", dateFormat);
			var html = template('gradesTop2', dataJson);
			document.getElementById("traning1").innerHTML = html;
		}
	});
}
function goodStudents(){
	var orgName_sn = $('#orgName_sn').val();
	$.ajax({
		type:"get",
		async:true,
		url:"/userCourse/getGoodStudentsLimit",
		dataType:"json",
		data:{'offset':0,'size':8,'orgNameSn':orgName_sn},
		success:function(dataJson){
			var html = template('goodStudents', dataJson);
			document.getElementById("goodStudentContainor").innerHTML = html;
		}
	});
}


function dateFormat(date, format){  
    date = new Date(date);  
    var map = {  
        "M": date.getMonth() + 1, //月份   
        "d": date.getDate(), //日   
        "h": date.getHours(), //小时   
        "m": date.getMinutes(), //分   
        "s": date.getSeconds(), //秒   
        "q": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };  
      
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){  
        var v = map[t];  
        if (v !== undefined) {  
            if (all.length > 1) {  
                v = '0' + v;  
                v = v.substr(v.length - 2);  
            }  
            return v;  
        }  
        else if (t === 'y') {  
                return (date.getFullYear() + '').substr(4 - all.length);  
            }  
        return all;  
    });  
    return format;  
}

function examParams_strEnc(params){
	var key = 'ad#ks';
	return strEnc(params, key, key, key);
}

function examParams_strDec(str){
	var key = 'ad#ks';
	return strDec(str, key, key, key);
}

