<?php
namespace app\index\controller;

use app\common\exception\JoyException;
use app\index\model\UserModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;
use app\utils\JwtUtil;
use app\common\constant\ProjectConstant;

class LoginController extends Controller {
    public function login() {
        $data = Request::post();
        $user = UserModel::where('username', $data['username'])->find();
        if($user == null) {
            throw new JoyException('用户不存在', 1001);
        }
        if($user->password != $data['password']) {
            throw new JoyException('密码错误', 1002);
        }
        $user['password'] = null;
        $user[ProjectConstant::$TOKEN_KEY] = JwtUtil::issue($user);
        return JoyResult::success($user);
    }
}
