    var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire");
	var browser = navigator.userAgent.toLowerCase(); 
	var isMobile = false; 
	for (var i=0; i<mobileAgent.length; i++){
		if (browser.indexOf(mobileAgent[i]) != -1){
			isMobile = true;
			break; 
		}
	}
	if(isMobile){
		//window.location.href="http://h5.lllnet.cn/index_platform.html";
	}
 
 
 $(function(){
	 
	 var baseStr=window.location.href;
	 var resultStr=baseStr.substr(-8);
	
	 if(resultStr=="register"){
		 jumpAjaxPage('register');
		 $("#about-modal").modal("hide");
		 setCookie("guidance",1, 180);
	 }

	 if(resultStr=="external"){
		 jumpAjaxPage('register',3);
		 $("#about-modal").modal("hide");
		 setCookie("guidance",1, 180);
		 setCookie("is_import",3, 180);
	 }else{
		 delCookie("is_import");
	 }

	 $('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
		});
	 getYanZhengMa();
	 getYanZhengMaMode();
	  
		 /*
		         var htmlNologin = '<a href="http://admin.lllnet.cn"><img src="'+basePath+'/static/images/headericon3.gif" /> 管理员登录</a>';
		        			var cookieVal = getCookie('access_token');
		        			//alert(cookieVal);
		        			if(cookieVal == null || cookieVal == '' || cookieVal == undefined){
								//先判断是否IP用户
                                var org_type = $('#org_type').val();
                                if(parseInt(org_type) == 3){
                                    $.ajax({
                                        type:"get",
                                        async:false,
                                        url:basePath+"/user/checkIpUser",
                                        dataType:"json",
                                        success:function(data){
                                            if(data['code'] == 200){
                                                var newAccessToken = data['body']['accessToken']; 
                                                var clientIp = data['body']['clientIp']; 
	                                               //alert('IP用户端访问,当前IP是：'+clientIp);
                                                if(newAccessToken != '' && newAccessToken != null && newAccessToken != undefined){
	                                                setCookie("access_token", newAccessToken, 10); 
	                                                window.location.reload(true);
                                                }

                                            }else{
                                                $("#r_logined").show();
                                               // document.getElementById("loginStatus").innerHTML = '';
                                            }
                                        }
                                    });
                                }else{
                                    $("#r_logined").show();
                                    //document.getElementById("loginStatus").innerHTML = '';
                                }
		        			}else{
								$.ajax({
									type:"get",
									async:true,
									url:basePath+"/user/checkUserAlive",
									dataType:"json",
									data:{'accessToken':cookieVal,'unamesn':'${org.uname_sn}'},
									success:function(dataJson){
										if(dataJson['code'] == 200){
											$("#loginContainer").hide();
										 var userName = dataJson['body']['user_name'];
										 	 var org_type = $('#org_type').val();
											var	htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="http://static.lllnet.cn/platform/u_photo.jpg" /> 个人中心</a> | <a href="javascript:loginOut();"> 退出登录</a>';
                                			 if(parseInt(org_type) == 3){
												htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="http://static.lllnet.cn/platform/u_photo.jpg" /> 个人中心</a> ';
                                			 }
											var photo = 'http://static.lllnet.cn/platform/u_photo.jpg';
											if(dataJson['body']['photo_path'] != null && dataJson['body']['photo_path'] != '' && dataJson['body']['photo_path'] != undefined){
												photo = '${imgServer }' + dataJson['body']['photo_path'];
												htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="'+photo+'" />个人中心</a> | <a href="javascript:loginOut();"><img src="http://${org.domain}/static/images/headericon3.gif" /> 退出登录</a>';
												if(parseInt(org_type) == 3){
													htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="'+photo+'" />个人中心</a>';
                                			 	}
											}
											 var userInfo='<div class="login_box"><div class="photo"><img src='+photo+' /><h2>'+userName+'</h2></div><div class="btns"> <a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="btn1">个人中心</a><a href="javascript:loginOut();" class="btn2">退出登录</a></div></div>';
											if(parseInt(org_type) == 3){
												 userInfo='<div class="login_box"><div class="photo"><img src='+photo+' /><h2>'+userName+'</h2></div><div class="btns"> <a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="btn1">个人中心</a></div></div>';
											}
											 
										    $("#r_logined").html('').show();
											$("#loginedTitle").html("<span>用户信息</span>");
											//htmlLogined = htmlLogined + '<a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="f_14" id="userInfo">'+userName+'</a><a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="btn3">个人主页</a><a href="javascript:loginOut();" class="btn3">退出</a>'
											
											//alert(dataJson['body']['photo_path']);
											
											//document.getElementById("loginStatus").innerHTML = htmlLogined;
											
										}else{
											var org_type = $('#org_type').val();
                                            if(parseInt(org_type) == 3){
                                                $.ajax({
                                                    type:"get",
                                                    async:false,
                                                    url:basePath+"/user/checkIpUser",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data['code'] == 200){
                                                            
                                                            var newAccessToken = data['body']['accessToken'];
                                                            if(newAccessToken != '' && newAccessToken != null && newAccessToken != undefined){
	                                                            setCookie("access_token", newAccessToken, 10); 
	                                                            window.location.reload(true);
                                                            } 

                                                        }else{
                                                            $("#r_logined").show();
                                                            //document.getElementById("loginStatus").innerHTML = '';
                                                        }
                                                    }
                                                });
                                            }else{
                                                $("#r_logined").show();
                                                //document.getElementById("loginStatus").innerHTML = '';
                                            }
										//	$("#r_logined").show();
										//	document.getElementById("loginStatus").innerHTML = '';
										}
									},
									error:function(){
											$("#r_logined").show();
											//document.getElementById("loginStatus").innerHTML = '';
									}
								});
		        			}
							
							var flag = window.location.href;
							if(flag.indexOf("flag") > 1){
								jumpAjaxPage('grade/gradeList');
								$('.nav li a').removeClass('current');
								$('#id_grades').addClass('current');
							}
							
							$("#search_value").keydown(function(e) {  
                               if (e.keyCode == 13) {  
                                      index_searchCourse();
                               }  
                             }); */
									            		 
		            	});
		            	
		       $('.sq_r_side ol li').mouseover(function(){
                var $kcn=$(this).index();
                $('.sq_r_side ol li').removeClass('shnax');
                $(this).addClass('shnax');
                $('.sq_r_side dd').hide();
                $('.sq_r_side dd').eq($kcn).show();
                if(($kcn)=="0"){
                	$("#moreFlag").attr("href","javascript:jumpAjaxPage('grade/gradeList?categoryId=1');");
                	    
                }else if(($kcn)=="1"){
                	$("#moreFlag").attr("href","javascript:jumpAjaxPage('grade/gradeList?categoryId=2');");
                	 
                }else if(($kcn)=="2"){
                	$("#moreFlag").attr("href","javascript:jumpAjaxPage('grade/gradeList?categoryId=3');");
                	 
                }
            })
              $('.sq_r_side1 ol li').mouseover(function(){
                var $kcn=$(this).index();
                $('.sq_r_side1 ol li').removeClass('shnax1');
                $(this).addClass('shnax1');
                $('.sq_r_side1 dd').hide();
                $('.sq_r_side1 dd').eq($kcn).show();
            })
 
 //弹出框回车登录           
 $("#myModal").bind("keydown",function(e){
			                    	var theEvent = e || window.event;    
			                    	var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
			                    	if (code == 13) {    
			                    		ModeLogin();
			                            }    
		                        });           
 //回车登录  
$("#loginContainer").bind("keydown",function(e){
		                    	var theEvent = e || window.event;    
		                    	var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
		                    	if (code == 13) {    
		                    		ModeLogin();
		                            }    
	                        });  
	            	

//弹出框去注册
function toRegister(){
	$("#myModal").modal("hide");
	jumpAjaxPage('register');
}

function toSelectCourse(){
	$("#modalAlert").modal("hide");
//	jumpAjaxPage('grade/gradeList');
	clickFootor('id_grades');
}
function toSelectCourse2(returnUrl){
	$("#modalAlert").modal("hide");
	window.location.href = "http://" + returnUrl + "?flag=1";
}