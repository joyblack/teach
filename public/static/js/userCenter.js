/* 点击修改信息，进入编辑用户信息状态 */
function toEditUserInfo(){
	$('#showUser').hide();
	$('#editUser').show();
}
function cancel(){
	$('#showUser').show();
	$('#editUser').hide();
}

function checkStrEmpty(str){
	if(str != null && str != '' && str != undefined && str != 0 && str != '0'){
		return true;
	}
	return false;
}
function saveUserInfo(){
	var user_name = $('#user_name').val();
	if(user_name == '' || user_name == null || user_name == undefined){
		alert('请输入真实姓名');
		return;
	}
	var ulength = user_name.length;
	if(ulength > 6){
		alert('真实姓名长度不能超过6个字符');
		return ;
	}
	
	var gender = $("input[name='gender']:checked").val();
	
	var birthday = $('#birthday').val();
	if(birthday == '' || birthday.length < 1){  
		alert('生日不能为空，请选择！'); return;
	}
	
  /*	var years = $('#years').val();
	var months = $('#months').val();
	var days = $('#days').val();
	
	var birthday = null;
	if(checkStrEmpty(years) && checkStrEmpty(months) && checkStrEmpty(days)){
		
		birthday = years+'-'+months+'-'+days;
	}*/
	
	//var degree = $('#degree').val();
	var telphone = $('#telphone').val();
	var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
	if(!(telphone.length == 11 && mobile.test(telphone))){
		alert('请正确填写手机号码');
		return ;
	}
	
	var dataOptions = {'user_name':user_name,'gender':gender,'birthday':birthday,'telphone':telphone};
	$.ajax({
		async:true,
		type:"post",
		url:"/user/saveUserInfo",
		data:dataOptions,
		dataType : "json",
		success:function(data){
			if(data['code'] == 200){
				//修改成功
//				window.location.reload(true);
				jumpAjaxPage('user/userCenter');
			}
		},
		error:function(){
			alert('error');
		}
	});
	
}

// 用户修改密码
function editPassword(){
	var oldPassword = $.trim($('#oldPassword').val());
	if(oldPassword.length < 6){
		alert('原密码必须是大于或等于6位的字符'); return;
	}
	var newPassword1 = $.trim($('#newPassword1').val());
	if(newPassword1.length < 6){
		alert('新密码必须是大于或等于6位的字符'); return;
	}
	var newPassword2 = $.trim($('#newPassword2').val());
	if(newPassword2.length < 6){
		alert('确认密码必须是大于或等于6位的字符'); return;
	}
	if(newPassword1 != newPassword2){
		alert('新密码和确认密码不一致！'); return;
	}
	var dataOptions = {'oldPassword':oldPassword,'newPassword':newPassword1};
	$.ajax({
		async:true,
		type:"post",
		url:"/user/editPassword",
		data:dataOptions,
		dataType : "json",
		success:function(data){
			if(data['code'] == 200){
				//修改成功
				//jumpAjaxPage('user/userCenter');
				$('#oldPassword').val('');
				$('#newPassword1').val('');
				$('#newPassword2').val('');
				alert('密码修改成功！请重新登录！');
				userLoginOut();
			}else if(data['code'] == 401){
				alert('原密码填写错误！');
			}else{
				alert('操作失败！');
			}
		},
		error:function(){
			alert('操作失败！');
		}
	});
}
// 密码修改成功后退出登录
function userLoginOut(){
	var accessToken = getCookie('access_token');
	$.ajax({
	    type: "POST",
	    url: "/user/userLoginOut",
	    data: {"accessToken":accessToken},
	    success: function(data){
	 	},
	 	error: function(e){
	    }
	});
	delCookie("access_token");
	window.location.href="/";
}

//点击上传头像
function upload_img(){
	//alert('1111');
	window.open("/user/toUploadImg", "uploadImg", "height=423, width=706, top=200, left=300");
}


SYT="-年份-";
SMT="-月份-";
SDT="-日期-";
BYN=70;//年份范围往前100年
AYN=1;//年份范围往后0年
function YMDselect(){
	this.SelY=document.getElementsByName(arguments[0])[0];
	this.SelM=document.getElementsByName(arguments[1])[0];
	this.SelD=document.getElementsByName(arguments[2])[0];
	this.DefY=this.SelD?arguments[3]:arguments[2];
	this.DefM=this.SelD?arguments[4]:arguments[3];
	this.DefD=this.SelD?arguments[5]:arguments[4];
	this.SelY.YMD=this;
	this.SelM.YMD=this;
	this.SelY.onchange=function(){YMDselect.SetM(this.YMD)};
	if(this.SelD)this.SelM.onchange=function(){YMDselect.SetD(this.YMD)};
	YMDselect.SetY(this)
};
//设置年份
YMDselect.SetY=function(YMD){
	dDate = new Date();
	dCurYear = dDate.getFullYear();
	YMD.SelY.options.add(new Option(SYT,'0'));
	for(i = dCurYear+AYN; i>(dCurYear-BYN); i--){
		YMDYT=i+'年';
		YMDYV=i;
		OptY = new Option(YMDYT,YMDYV);
		YMD.SelY.options.add(OptY);
		if(YMD.DefY==YMDYV) OptY.selected=true
	}
	YMDselect.SetM(YMD)
};
//设置月份
YMDselect.SetM=function(YMD){
	YMD.SelM.length = 0;
	YMD.SelM.options.add(new Option(SMT,'0'));
	if(YMD.SelY.value>0){
		for(var i=1;i<=12;i++){
			YMDMT=i+'月';
			YMDMV=i;
			OptM=new Option(YMDMT,YMDMV);
			YMD.SelM.options.add(OptM);
			if(YMD.DefM==YMDMV) OptM.selected=true
		}
	}
	if(YMD.SelD)YMDselect.SetD(YMD)
};
//设置日期
YMDselect.SetD=function(YMD){
	YI=YMD.SelY.value;
	MI=YMD.SelM.value;
	YMD.SelD.length = 0;
	YMD.SelD.options.add(new Option(SDT,'0'));
	if(YI>0 && MI>0){
		dPrevDate = new Date(YI, MI, 0);
		daysInMonth=dPrevDate.getDate();
		for (d = 1; d <= parseInt(daysInMonth); d++) {
			YMDDT=d+'日';
			YMDDV=d;
			OptD=new Option(YMDDT,YMDDV);
			YMD.SelD.options.add(OptD);
			if(YMD.DefD==YMDDV)OptD.selected=true
		}
	}
}