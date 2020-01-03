<?php
namespace app\index\controller;

use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\ExpertModel;
use app\index\model\ExpertPhotoModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class DownloadController extends Controller {
    private $expertStorePath = 'uploads/expert';
    /**
     * 专家照片
     */
    public function expert($id){
        $file = ExpertPhotoModel::get($id);
        $download = new \think\response\Download($file['store_path']);
        return $download->name('专家照片.' . $file['extension']);
    }
}
