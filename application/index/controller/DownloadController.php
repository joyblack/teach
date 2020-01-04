<?php
namespace app\index\controller;

use app\index\model\ExpertPhotoModel;
use app\index\model\NewsBannerModel;
use think\Controller;
use app\index\model\NewsPhotoModel;
use app\index\model\InfoBannerModel;
use app\index\model\InfoPhotoModel;

class DownloadController extends Controller {
    /**
     * 专家照片
     */
    public function expert($id){
        $file = ExpertPhotoModel::get($id);
        $download = new \think\response\Download($file['storePath']);
        return $download->name('专家照片.' . $file['extension']);
    }

    /**
     * 新闻封面
     */
    public function newsBanner($id){
        $file = NewsBannerModel::get($id);
        $download = new \think\response\Download($file['storePath']);
        return $download->name('nothing.' . $file['extension']);
    }
    
    /**
     * 新闻内容图片
     */
    public function newsPhoto($id){
        $file = NewsPhotoModel::get($id);
        $download = new \think\response\Download($file['storePath']);
        return $download->name('nothing.' . $file['extension']);
    }
    
    /**
     * 公告封面
     */
    public function infoBanner($id){
        $file = InfoBannerModel::get($id);
        $download = new \think\response\Download($file['storePath']);
        return $download->name('nothing.' . $file['extension']);
    }
    
    /**
     * 公告图片
     */
    public function infoPhoto($id){
        $file = InfoPhotoModel::get($id);
        $download = new \think\response\Download($file['storePath']);
        return $download->name('nothing.' . $file['extension']);
    }
}
