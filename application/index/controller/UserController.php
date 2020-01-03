<?php
namespace app\index\controller;

use app\common\constant\ProjectConstant;
use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\UserModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class UserController extends Controller {
    public function add() {
        $data = Request::post();
        $user = UserModel::where('username', $data['username'])->find();
        if($user != null) {
            throw new JoyException('登录名已存在', 1001);
        }
        // 默认密码
        $data['password'] = ProjectConstant::$DEFAULT_PASSWORD;
        $user = new UserModel($data);
        $user->save();
        return JoyResult::success($user);
    }

    public function delete($id) {
        $user = UserModel::get($id);
        if ($user == null) {
            throw new JoyException('用户不存在', 1002);
        }
        if ($user['username'] == ProjectConstant::$ADMIN_USERNAME) {
            throw new JoyException('超级管理员不允许进行删除', 1004);
        }
        UserModel::destroy($id);
        return JoyResult::success();
    }

    public function get($id) {
        return JoyResult::success(UserModel::get($id));
    }

    public function page() {
        $data = Request::post();
        $list = UserModel::where('username|name|phone', 'like', '%'. $data['search'] .'%')
            -> paginate($data['size'], false, ['page' => $data['page']]);
        return JoyResult::success($list);
    }

    public function edit() {
        $data = Request::put();
        $user = UserModel::get($data['id']);
        if ($user == null) {
            throw new JoyException('用户不存在', 1002);
        }
        $user = new UserModel();
        $user->allowField(['phone', 'name', 'remarks'])->save($data, ['id' => $data['id']]);
        return JoyResult::success();
    }

    /**
     * 设置用户状态
     */
    public function status($id, $status) {
        $user = UserModel::get($id);
        if ($user == null) {
            throw new JoyException('用户不存在', 1002);
        }
        if ($status != CommonEnum::$STATUS_DISABLE && $status != CommonEnum::$STATUS_ENABLE) {
            throw new JoyException('非法的状态信息', 1003);
        }
        $user->status = $status;
        $user->save();
        return JoyResult::success();
    }

    /**
     * 重置密码
     */
    public function resetPassword($id) {
        $user = UserModel::get($id);
        if ($user == null) {
            throw new JoyException('用户不存在', 1002);
        }
        $user->password = ProjectConstant::$DEFAULT_PASSWORD;
        $user->save();
        return JoyResult::success();
    }

    /**
     * 修改用户密码
     */
    public function changePassword() {
        $data = Request::put();
        $user = UserModel::get($data['id']);
        if ($user == null) {
            throw new JoyException('用户不存在', 1002);
        }
        $user->password = $data['password'];
        $user->save();
        return JoyResult::success();
    }






    
}
