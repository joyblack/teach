<?php
namespace app\index\controller;

use app\common\enums\CommonEnum;
use app\common\exception\JoyException;
use app\index\model\ExpertModel;
use app\index\model\ExpertPhotoModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;

class UploadController extends Controller {
    private $expertStorePath = 'uploads/expert';

    private $fileKey = 'file';

    /**
     * 专家照片
     */
    public function expert(){
        $file = request()->file($this->fileKey);
        $info = $file->move($this->expertStorePath);
        if ($info) {
            $file = new ExpertPhotoModel();
            $file->filename = $info->getFilename();
            $file->store_path = $this->expertStorePath . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
            return JoyResult::success($file);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }
}
