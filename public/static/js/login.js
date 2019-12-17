var ssoServer = "http://oauth.lllnet.cn/";
//var ssoServer = "http://localhost:8088/";

var globalLoginName=null;

//获取cookie值
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}

//刷新验证码
function getYanZhengMa(){
	var sRandNum="";
	for(var i=0;i<4;i++){
		var randNum=Math.floor(Math.random()*10);
		sRandNum=sRandNum+randNum;
	}
	$("#checkcode").attr("src","/static/common/image.jsp?sRand="+sRandNum);
	$("#sRandNum").val(sRandNum);
}

//刷新验证码
function getYanZhengMaMode(){
	var sRandNum="";
	for(var i=0;i<4;i++){
		var randNum=Math.floor(Math.random()*10);
		sRandNum=sRandNum+randNum;
	}
	$("#checkcodeMode").attr("src","/static/common/image.jsp?sRand="+sRandNum);
	$("#sRandNumMode").val(sRandNum);
}
// 删除cookie值
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/";
}

// 用户退出操作（暂时先删除浏览器cookie信息）
function loginOut(){
	if(confirm("您确定要退出当前用户吗？")){
		//清楚redis,oauth 登录用户设置失效
		var accessToken = getCookie('access_token');
		$.ajax({
		    type: "POST",
		    url: basePath+"/user/userLoginOut",
		    data: {"accessToken":accessToken},
		    success: function(data){
		    	
		 	},
		 	error: function(e){
		    }
		   });
		delCookie("access_token");
		window.location.href="/";
		
	}
}



/* 登录 */
function login(){
	var grant_type = $('#grant_type').val();
	var client_id = $('#client_id').val();
	var client_secret = $('#client_secret').val();
	var loginName = $('#loginName').val();
	var password = $('#password').val();
	
	if(loginName.length < 1){
		alert('请输入登录名！');return;
	}
	if(loginName.length > 32){
		alert("登录名不能超过32个字符！");return;
	}
	var password = $('#password').val();
	if(password.length < 1){
		alert('请输入登录密码！');return;
	}
	var randNum = $('#randNum').val();
	var sRandNum = $('#sRandNum').val();
	if(randNum.length < 1){
		alert('请输入验证码！');return;
	}else if(randNum != sRandNum){
		//alert(randNum + '--------' + sRandNum);
		alert('验证码输入错误！');return;
	}
	
//	var redirectUrl = "/grade/gradeList";
	/* 跨域问题暂时未解决，这块先不请求*/
	$.ajax({
		async:true,
		type:"post",
		url:ssoServer+"sso/login?random="+Math.random(),
		data:{'grant_type':grant_type,'client_id':client_id,'client_secret':client_secret,'username':loginName,'password':password},
		dataType : "jsonp",
		success:function(data){
			console.log(data);
//			alert(data['access_token']);
			if(data['code'] == 200){
				setCookie("access_token", data['access_token'], 1);
				
				//记住账号的逻辑
				globalLoginName=loginName;
				if($("#rememberInfo").is(':checked')){
					setCookie("access_loginName",globalLoginName, 30);
			    }else{
			    	delCookie("access_loginName");
			    }
				
				var returnUrl = data['retUrl'];
				$.ajax({
					async:false,
					type:"get",
					url:"http://"+returnUrl+"/cookie/addCookie?access_token="+data['access_token'],
					dataType:"jsonp",
					success:function(json){
						if(json['code'] == 200){
							window.location.href="http://"+returnUrl+"?flag=0";
						}
					},
					error:function(jqXHR, textStatus, errorThrown){
						alert('error');
						if(jqXHR.status = 400){
						}
					}
				});
			}else{
				//登录失败
				alert(data['message']);
			}
			
		},
		error:function(jqXHR, textStatus, errorThrown){
			//alert(jqXHR.status);
			alert('您输入的用户名或密码有误！如果在1小时内输入错误超过5次账号将被锁住！');
			getYanZhengMa();
			if(jqXHR.status = 400){
				
			}
		}
	});
	/*alert('16031f66ad35af974eadedd5247b95b4')
	setCookie("access_token", '3ca51c78e90cecd86c92d66fcc1da172', 1);
	window.location.reload(true);*/
}

function buyNologin(){
	//提示 登陆
//	$("#myModal").modal("show");
	window.location.href="/";
} 

function ModeLogin(){
	var grant_type = $('#grant_type').val();
	var client_id = $('#client_id').val();
	var client_secret = $('#client_secret').val();
	var loginName = $('#loginNameMode').val();
	var password = $('#passwordMode').val();
	
	if(loginName.length < 1){
		alert('请输入登录名！');return;
	}
	if(loginName.length > 32){
		alert("登录名不能超过32个字符！");return;
	}
	var password = $('#passwordMode').val();
	if(password.length < 1){
		alert('请输入登录密码！');return;
	}
	var randNum = $('#randNumMode').val();
	var sRandNum = $('#sRandNumMode').val();
	if(randNum.length < 1){
		alert('请输入验证码！');return;
	}else if(randNum != sRandNum){
		//alert(randNum + '--------' + sRandNum);
		alert('验证码输入错误！');return;
	}
	
//	var redirectUrl = "/grade/gradeList";
	/* 跨域问题暂时未解决，这块先不请求*/
	$.ajax({
		async:true,
		type:"post",
		url:ssoServer+"sso/login?random="+Math.random(),
		data:{'grant_type':grant_type,'client_id':client_id,'client_secret':client_secret,'username':loginName,'password':password},
		dataType : "jsonp",
		success:function(data){
//			alert(data['access_token']);
			if(data['code'] == 200){
				setCookie("access_token", data['access_token'], 1);
				
				//记住账号的逻辑
				globalLoginName=loginName;
				if($("#rememberInfoMode").is(':checked')){
					setCookie("access_loginName",globalLoginName, 30);
			    }else{
			    	delCookie("access_loginName");
			    }
				
				var returnUrl = data['retUrl'];
				$.ajax({
					async:false,
					type:"get",
					url:"http://"+returnUrl+"/cookie/addCookie?access_token="+data['access_token'],
					dataType:"jsonp",
					success:function(json){
						if(json['code'] == 200){
							$("#myModal").modal("hide");
//							var htmlNologin = '<a style="outline:none" data-toggle="modal" data-target="#myModal" href="#">请登录</a> | <a href="javascript:jumpAjaxPage(\'register\');">免费注册</a>';
//							var cookieVal = getCookie('access_token');
//							if(cookieVal == null || cookieVal == '' || cookieVal == undefined){
//								document.getElementById("login_div_top").innerHTML = htmlNologin;
//							}else{
//								$.ajax({
//									type:"get",
//									async:true,
//									url:"http://"+returnUrl+"/user/checkUserAlive",
//									dataType:"json",
//									data:{'accessToken':cookieVal,'unamesn':'gclc-qh'},
//									success:function(dataJson){
//										if(dataJson['code'] == 200){
//											var userName = dataJson['body']['user_name'];
//											var htmlLogined = '<a>' + userName + '</a><a href="javascript:loginOut();">退出登录</a> | <a href="javascript:jumpAjaxPage(\'user/myGrade\',\'needLogin\');">个人中心</a> | <a href="javascript:jumpAjaxPage(\'order/myOrdersList\',\'needLogin\');">我的订单</a>';
//											document.getElementById("login_div_top").innerHTML = htmlLogined;
//											var studentInfoContainer='<div class="t_t">学员信息</div><div class="con"><div class="u_touxiang">';
//											var photo = 'http://static.lllnet.cn/platform/u_photo.jpg';
//											if(dataJson['body']['photo_path'] != null && dataJson['body']['photo_path'] != '' && dataJson['body']['photo_path'] != undefined){
//												photo = '${imgServer }' + dataJson['body']['photo_path'];
//											}
//											studentInfoContainer+='<img src="'+photo+'" /></div><div class="u_name">'+userName+'</div><div  class="u_btns">'+
//								            '<a href="javascript:jumpAjaxPage(\'user/myGrade\');">个人中心</a> | <a href="javascript:loginOut();">退出</a></div><div  class="u_btns1"><a href="javascript:jumpAjaxPage(\'user/myGrade\');">进入培训</a></div></div>';
//											
//											$('.login_box').html(studentInfoContainer);
//										}else{
//											document.getElementById("login_div_top").innerHTML = htmlNologin;
//										}
//									},
//									error:function(){
//										$("#r_logined").show();
//										document.getElementById("login_div_top").innerHTML = htmlNologin;
//									}
//
//								});
//							}
							window.location.href="http://"+returnUrl+"?flag=0";
						}
					},
					error:function(jqXHR, textStatus, errorThrown){
						alert('error');
						if(jqXHR.status = 400){
						}
					}
				});
			}else{
				//登录失败
				alert(data['message']);
			}
			
		},
		error:function(jqXHR, textStatus, errorThrown){
			//alert(jqXHR.status);
			alert('您输入的用户名或密码有误！如果在1小时内输入错误超过5次账号将被锁住！');
			getYanZhengMa();
			if(jqXHR.status = 400){
				
			}
		}
	});
	/*alert('16031f66ad35af974eadedd5247b95b4')
	setCookie("access_token", '3ca51c78e90cecd86c92d66fcc1da172', 1);
	window.location.reload(true);*/
}


function checkUser(turl){
	$.ajax({
		type:"get",
		async:true,
		url:"http://"+turl+"/user/checkUserAlive",
		dataType:"json",
		success:function(dataJson){
			//alert(dataJson['code']);
			if(dataJson['code'] == 200){
				if($("#r_logined").length > 0){	
					$("#r_logined").hide();
				}
				var	htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="http://'+turl+'/static/common/images/u_photo.jpg" /></a>';
				if(dataJson['body']['photo_path'] != null && dataJson['body']['photo_path'] != '' && dataJson['body']['photo_path'] != undefined){
					var photo = 'http://imgqs.bjadks.com/' + dataJson['body']['photo_path'];
					htmlLogined = '<a href="javascript:jumpAjaxPage(\'user/myGrade\');"><img src="'+photo+'" /></a>';
				}
				var userName = dataJson['body']['user_name'];
				htmlLogined = htmlLogined + '<a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="f_14" id="userInfo">'+userName+'</a><a href="javascript:jumpAjaxPage(\'user/myGrade\');" class="btn3">个人主页</a><a href="javascript:loginOut();" class="btn3">退出</a>'
				
				document.getElementById("loginStatus").innerHTML = htmlLogined;
				
			}else{
				//$("#r_logined").show();
				document.getElementById("loginStatus").innerHTML = htmlNologin;
			}
		},
		error:function(){
			if($("#r_logined").length > 0){				
				$("#r_logined").show();
			}
			document.getElementById("loginStatus").innerHTML = htmlNologin;
		}
	});
}

function testBtn(){
	//alert('--------------------------------------------');
	$.ajax({
		type:"post",
		async:true,
		url:"/pay/toPay",
		dataType:"json",
		success:function(dataJson){
			//alert(dataJson['code']);
			if(dataJson['code'] == 200){
				alert("------------"+dataJson['body']);
				//winodw.open(dataJson['body']);
				window.location.href = dataJson['body'];
			}else{
				//$("#r_logined").show();
				document.getElementById("loginStatus").innerHTML = htmlNologin;
			}
		},
		error:function(){
		}
	});
}

function jumpto(url){
	window.location.href=url;
}
/* 设置cookie值---过期天数 */
function setCookie(cName,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=cName+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+";path=/");
}


function doSearch(){
	var sval = $('#searchVal').val();
	if(sval == null || sval == '' || sval == undefined){
		alert('请输入搜索培训班名字关键字');
		return ;
	}
	window.location.href="/grade/gradeList/"+sval;
}
//用户注册
function register_user(){
	var reg_name = $("#reg_name").val();
	if($.trim(reg_name) == ''){
		alert('用户名不能为空！'); return;
	}else{
		var reg = /^[0-9a-zA-Z]+$/;
		if(!reg.test($.trim(reg_name))){
			alert('用户名只能包含字母及数字！'); return;
		}
	}
	var reg_pwd1 = $("#reg_pwd1").val();
	if($.trim(reg_pwd1) == ''){
		alert('密码不能为空！'); return;
	}else if(reg_pwd1.length < 6){
		alert('密码的长度不能小于6位数！'); return;
	}
	var reg_pwd2 = $("#reg_pwd2").val();
	if($.trim(reg_pwd2) == ''){
		alert('确认密码不能为空！'); return;
	}else if($.trim(reg_pwd1) != $.trim(reg_pwd2)){
		alert('两次输入的密码不一致！'); return;
	}
	$.ajax({
		async:true,
		type: "post",
		url: "/register",
		data:{'reg_name':reg_name,'reg_pwd':reg_pwd1},
		success:function(data){
			if(data == 'succ'){				
				alert('恭喜，注册成功！');
				window.location.href="/login";
			}
		}
	});
}
//跳转的后台
function toAdmin(){
	window.open("http://admin.lllnet.cn");
}

//首页证书查询
function certSearch(){
	var icard = $('#certSearchUserIcard').val(); //身份证
	var certSn = $('#certSearchCertSn').val(); //证书编号
	var icardOn = true;
	var certSnOn = true;
	if(icard == null || icard == '' || icard == undefined){
		icardOn = false;
		icard = "";
	}else{
		var stas = isCardNo(icard);
		if(stas == false){
			return;
		}
	}
	if(certSn == null || certSn == '' || certSn == undefined){
		certSnOn = false;
		certSn = "";
	}
	
	if(!icardOn && !certSnOn){
		alert('请输入身份证号 或者 证书编号！');
		return;
	}
	$.ajax({
		async:true,
		url:"/gradeUser/indexSearchCert",
		data:{"icard":icard,"certSn":certSn},
		type:"get",
		dataType:"json",
		success:function(data){
			if(data['code'] == 200){
				var orgSnName = $("#orgName_sn").val();
				if(orgSnName == 'gclc-cjrc'){
					window.open('/gradeUser/searchUserCert?icard='+icard+'&certSn='+certSn, 'searchUserGradeCert', 'width=1000, height=755, top=0, left=330, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no');
				}else{
					window.open('/gradeUser/searchUserCert?icard='+icard+'&certSn='+certSn, 'searchUserGradeCert', 'width=728, height=556, top=136, left=330, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
				}
			}else{
				alert(data['message']);
			}
		}
	});
	
}
function isCardNo(card){
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
		if(reg.test(card) === false){ 
		alert("请输入合法的身份证号码"); 
		return false; 
	}
}


/********************************** 分中心用户自动登录跳转 ********************************/
function centerToLogin(toDomain){
	 var fromDomain = $('#orgDomain').val();
//	 alert("from: " + fromDomain + ", to: " + toDomain);
	 if(fromDomain != '' && toDomain != '' && (fromDomain != toDomain)){
		 var userCookie = getCookie('access_token');
		 if(userCookie != undefined && userCookie != null && userCookie != ''){
			 $.ajax({
				 async:true,
				 type:"post",
				 url:ssoServer+"ssoc/ssoLogin?random="+Math.random(),
				 data:{'fromDomain':fromDomain,'toDomain':toDomain,'accessToken':userCookie},
				 dataType : "jsonp",
				 success:function(data){
//					alert(data['code']);
					 if(data['code'] == 200){
						setCookie("access_token", data['access_token'], 1);
						$.ajax({
							async:false,
							type:"get",
							url:"http://"+toDomain+"/cookie/addCookie?returnUrl="+toDomain+"&access_token="+data['access_token'],
							dataType:"jsonp",
							success:function(json){
								if(json['code'] == 200){
									window.location.href="http://"+toDomain;
								}
							},
							error:function(jqXHR, textStatus, errorThrown){
//								alert('error');
								if(jqXHR.status = 400){
								}
							}
						});
					 }else{
						 alert(data['message']);
					 }
				 },
				 error:function(jqXHR, textStatus, errorThrown){
//					 alert('您输入的用户名或密码有误！如果在24小时内输入错误超过5次账号将被锁住！');
					 if(jqXHR.status = 400){
					 }
				 }
			 });
		 }else{
			 window.location.href="http://"+toDomain;
		 }
	 }else{
		 window.location.href="http://"+toDomain;
	 }
//	 window.location.href="http://"+toDomain;
}





