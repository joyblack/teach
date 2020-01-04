<?php
namespace app\index\controller;

use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\InfoModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class InfoController extends Controller {
    public function add() {
        $data = Request::post();
        $m = new InfoModel($data);
        $m->save();
        return JoyResult::success($m);
    }

    public function delete($id) {
        $m = InfoModel::get($id);
        if ($m == null) {
            throw new JoyException('公告信息不存在', 1002);
        }
        InfoModel::destroy($id);
        return JoyResult::success();
    }

    public function get($id) {
        return JoyResult::success(InfoModel::get($id));
    }

    public function page() {
        $data = Request::post();
        $list = InfoModel::where('title|username', 'like', '%'. $data['search'] .'%')
            -> paginate($data['size'], false, ['page' => $data['page']]);
        return JoyResult::success($list);
    }

    public function edit() {
        $data = Request::put();
        $m = InfoModel::get($data['id']);
        if ($m == null) {
            throw new JoyException('公告信息不存在', 1002);
        }
        $m = new InfoModel();
        $m->allowField(['title', 'username', 'remarks', 'bannerId', 'content'])->save($data, ['id' => $data['id']]);
        return JoyResult::success();
    }

    /**
     * 设置公告信息状态
     */
    public function status($id, $status) {
        $m = InfoModel::get($id);
        if ($m == null) {
            throw new JoyException('公告信息不存在', 1002);
        }
        if ($status != CommonEnum::$STATUS_DISABLE && $status != CommonEnum::$STATUS_ENABLE) {
            throw new JoyException('非法的状态信息', 1003);
        }
        $m->status = $status;
        $m->save();
        return JoyResult::success();
    }
}
