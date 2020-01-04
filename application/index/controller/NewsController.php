<?php
namespace app\index\controller;

use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\NewsModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class NewsController extends Controller {
    public function add() {
        $data = Request::post();
        $Expert = new NewsModel($data);
        $Expert->save();
        return JoyResult::success($Expert);
    }

    public function delete($id) {
        $Expert = NewsModel::get($id);
        if ($Expert == null) {
            throw new JoyException('新闻信息不存在', 1002);
        }
        NewsModel::destroy($id);
        return JoyResult::success();
    }

    public function get($id) {
        return JoyResult::success(NewsModel::get($id));
    }

    public function page() {
        $data = Request::post();
        $list = NewsModel::where('title|username', 'like', '%'. $data['search'] .'%')
            -> paginate($data['size'], false, ['page' => $data['page']]);
        return JoyResult::success($list);
    }

    public function edit() {
        $data = Request::put();
        $Expert = NewsModel::get($data['id']);
        if ($Expert == null) {
            throw new JoyException('新闻信息不存在', 1002);
        }
        $Expert = new NewsModel();
        $Expert->allowField(['title', 'username', 'remarks', 'bannerId', 'content'])->save($data, ['id' => $data['id']]);
        return JoyResult::success();
    }

    /**
     * 设置新闻信息状态
     */
    public function status($id, $status) {
        $Expert = NewsModel::get($id);
        if ($Expert == null) {
            throw new JoyException('新闻信息不存在', 1002);
        }
        if ($status != CommonEnum::$STATUS_DISABLE && $status != CommonEnum::$STATUS_ENABLE) {
            throw new JoyException('非法的状态信息', 1003);
        }
        $Expert->status = $status;
        $Expert->save();
        return JoyResult::success();
    }
}
