//点击课程，课程播放
/*function coursePlay(gradeId,courseId){
		var orgName_sn = $('#orgName_sn').val();
		
		var flag = false;
		$.ajax({
			async:false,
			url:basePath+'/user/userIsLogin?orgName_sn='+orgName_sn,
			type:"post", 
			success:function(data){
				if(data['code'] != 200){
					alert('请您先登录！');
					window.location.reload();
				}else{
					flag = true;
					//$('#gradeId_play').val(gradeId);
					//$('#courseId_play').val(courseId);
					//$("#toCoursePlayForm").submit();
				}
			},
			error:function(XMLResponse){
			}
		});
		
		if(flag){
			var winName = "mediaServer";
			var url = basePath+"/course/toCoursePlay?gradeId="+gradeId+"&courseId="+courseId;
			window.open(url,winName);
			//var tempWindow=
			//var url = "http://127.0.0.1:8084/media/accessCourseInfo?gradeId="+gradeId+"&courseId="+courseId;
			//tempWindow.location = url;
		}
}*/

//点击进入班级考试
function toGradeExam(gradeId, examId){
	var winName = 'gradeExam';
	var url = basePath + '/grade/toGradeExam?gradeId='+gradeId+'&examId='+examId;
	window.open(url, winName);
}
//进入课程详情页面
function courseInfo(courseCode, gradeId){
	/*$("#ajaxMainContent").load('http://vqs.bjadks.com/courseInfo/'+courseCode+'.html?random='+Math.random(),function(){
		$('#play_grade_id').val(gradeId);
	});*/
	$.ajax({
		async:true,
		url:basePath+'/course/courseInfo',
		type:"post", 
		data:{"courseCode":courseCode, "gradeId":gradeId},
		success:function(data){
			$("#ajaxMainContent").html(data);
		},
		error:function(XMLResponse){
			//alert(XMLResponse);
		}
	});
}
//课件播放
function coursewarePlay(coursewareId){
	var gradeId = $('#play_grade_id').val();
	var course_resource_type = $('#course_resource_type').val();
	var winName = "mediaServer" + coursewareId;
	var url = basePath+"/courseware/toCoursewarePlay?coursewareId="+coursewareId+"&courseResourceType="+course_resource_type;
	if(gradeId != undefined && gradeId != '' && gradeId != null){
		url = url + "&gradeId=" + gradeId;
	}
	window.open(url, winName);
}

function actionPlay(){
	var h_lastCoursewareId = $('#h_lastCoursewareId').val();
	if(h_lastCoursewareId != '' && h_lastCoursewareId.length > 0){
		coursewarePlay(h_lastCoursewareId);
	}else{	
		//console.log("进入actionPlay函数");
		var firstCware = $('#actionPlay0');
		//console.log(firstCware+"值")
		if(firstCware){
			//$('#actionPlay0').click(function(){
			//consolle.log("开始学习");
			//});
			$('#actionPlay0').click();
		}
	}
}

//课程点赞
function likeCourse(courseId,userId){
	$.ajax({
		async:true,
		url:basePath+'/course/addCourseLikeCount?courseId='+courseId+"&userId="+userId,
		type:"get", 
		success:function(data){
			if(data['code'] == 200){
				var old = $('#like_count').text();
				var oldnum = parseInt(old);
				$('#like_count').text(oldnum+1);
			}else{
				alert('您已赞过，请1小时后再来！');
			}
		},
		error:function(XMLResponse){
		}
	});
}


/**
 * 课程详情页，点击返回按钮，回到班级课程列表，或者课程超市（当前课程二级分类）的列表
 */
function courseInfoBack(){
	var gradeId = $('#play_grade_id').val();
	var ccode = $('#h_category_code').val();
	if(gradeId != undefined && gradeId != '' && gradeId != null){
		//回到班级
		jumpAjaxPage('user/gradeIndex/'+gradeId);
	}else{
		//回到课程超市
		indexCourseListByCurrentCategory(ccode);
	}
}
//加载课程列表内容页面（首页点击课程分类）
function indexCourseListByCurrentCategory(category_code){
	var temp = category_code.split("-");
	var currentCourseCategoryId = temp[temp.length-2]; //当前课程分类IDy
	var parentCategory = temp[0]+"-"+temp[1]+"-";
//	alert(category_code);
//	alert(parentCategory);
	$.ajax({
		async:true,
		url:basePath+'/course/courseList',
		type:"post", 
		data:{"category_code": parentCategory,"currentCourseCategoryId":currentCourseCategoryId},
		success:function(data){
			$("#ajaxMainContent").html(data);
		},
		error:function(XMLResponse){
		}
	});
}
 