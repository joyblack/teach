<?php
namespace app\index\controller;

use app\common\constant\ProjectConstant;
use app\common\exception\JoyException;
use app\index\model\ExpertPhotoModel;
use app\index\model\NewsBannerModel;
use app\index\model\NewsPhotoModel;
use app\utils\JoyResult;
use think\Controller;
use think\facade\Request;
use app\index\model\InfoBannerModel;
use app\index\model\InfoPhotoModel;

class UploadController extends Controller {
    private $fileKey = 'file';
    /**
     * 专家照片
     */
    public function expert(){
        $file = request()->file($this->fileKey);
        $info = $file->move(ProjectConstant::$UPLOAD_PATH_EXPERT);
        if ($info) {
            $file = new ExpertPhotoModel();
            $file->filename = $info->getFilename();
            $file->storePath = ProjectConstant::$UPLOAD_PATH_EXPERT . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
            return JoyResult::success($file);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }

    /**
     * 上传新闻封面
     */
    public function newsBanner(){
        $file = request()->file($this->fileKey);
        $info = $file->move(ProjectConstant::$UPLOAD_PATH_NEWS);
        if ($info) {
            $file = new NewsBannerModel();
            $file->filename = $info->getFilename();
            $file->storePath = ProjectConstant::$UPLOAD_PATH_NEWS . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
            return JoyResult::success($file);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }
    
    /**
     * 上传新闻图片
     */
    public function newsPhoto(){
        $file = request()->file($this->fileKey);
        $info = $file->move(ProjectConstant::$UPLOAD_PATH_NEWS);
        if ($info) {
            $file = new NewsPhotoModel();
            $file->filename = $info->getFilename();
            $file->storePath = ProjectConstant::$UPLOAD_PATH_NEWS . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
            
            // 编辑器所需发返回
            $res['errno'] = 0;
            $res['data'] = array('/api/download/newsPhoto/' . $file->id);
            return json($res);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }
    
    
    /**
     * 上传公告封面
     */
    public function infoBanner(){
        $file = request()->file($this->fileKey);
        $info = $file->move(ProjectConstant::$UPLOAD_PATH_INFO);
        if ($info) {
            $file = new InfoBannerModel();
            $file->filename = $info->getFilename();
            $file->storePath = ProjectConstant::$UPLOAD_PATH_INFO . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
            return JoyResult::success($file);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }
    
    /**
     * 上传公告图片
     */
    public function infoPhoto(){
        $file = request()->file($this->fileKey);
        $info = $file->move(ProjectConstant::$UPLOAD_PATH_INFO);
        if ($info) {
            $file = new InfoPhotoModel();
            $file->filename = $info->getFilename();
            $file->storePath = ProjectConstant::$UPLOAD_PATH_INFO . '/' . $info->getSaveName();
            $file->extension = $info->getExtension();
            $file->filesize = $info->getInfo()['size'];
            $file->save();
    
            // 编辑器所需发返回
            $res['errno'] = 0;
            $res['data'] = array('/api/download/infoPhoto/' . $file->id);
            return json($res);
        }else{
            throw new JoyException('上传文件失败' . $file->getError(), 500);
        }
    }
    
    
}
