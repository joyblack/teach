<?php
namespace app\index\controller;

use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\ExpertModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class ExpertController extends Controller {
    public function add() {
        $data = Request::post();
        $Expert = new ExpertModel($data);
        $Expert->save();
        return JoyResult::success($Expert);
    }

    public function delete($id) {
        $Expert = ExpertModel::get($id);
        if ($Expert == null) {
            throw new JoyException('专家信息不存在', 1002);
        }
        ExpertModel::destroy($id);
        return JoyResult::success();
    }

    public function get($id) {
        return JoyResult::success(ExpertModel::get($id));
    }

    public function page() {
        $data = Request::post();
        $list = ExpertModel::where('name|phone', 'like', '%'. $data['search'] .'%')
            -> paginate($data['size'], false, ['page' => $data['page']]);
        return JoyResult::success($list);
    }

    public function edit() {
        $data = Request::put();
        $Expert = ExpertModel::get($data['id']);
        if ($Expert == null) {
            throw new JoyException('专家信息不存在', 1002);
        }
        $Expert = new ExpertModel();
        $Expert->allowField(['phone', 'name', 'remarks'])->save($data, ['id' => $data['id']]);
        return JoyResult::success();
    }

    /**
     * 设置专家信息状态
     */
    public function status($id, $status) {
        $Expert = ExpertModel::get($id);
        if ($Expert == null) {
            throw new JoyException('专家信息不存在', 1002);
        }
        if ($status != CommonEnum::$STATUS_DISABLE && $status != CommonEnum::$STATUS_ENABLE) {
            throw new JoyException('非法的状态信息', 1003);
        }
        $Expert->status = $status;
        $Expert->save();
        return JoyResult::success();
    }
}
