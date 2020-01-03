<?php
namespace app\utils;

class JoyResult{
    public static function success($data = array(), $message = "操作成功", $code = 200) {
        $jsonData = array();
        $jsonData['state'] = true;
        $jsonData['data'] = $data;
        $jsonData['message'] = $message;
        $jsonData['code'] = $code;
        return json($jsonData, $code);
    }

    public static function error($data = array(), $message = "操作失败", $code = 1000) {
        $jsonData = array();
        $jsonData['state'] = false;
        $jsonData['data'] = $data;
        $jsonData['message'] = $message;
        $jsonData['code'] = $code;
        return json($jsonData, 200);
    }
}
