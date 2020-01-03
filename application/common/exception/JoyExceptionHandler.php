<?php
namespace app\common\exception;
use Exception;
use http\Message;
use think\exception\Handle;
use think\exception\HttpException;
use think\exception\ValidateException;
class JoyExceptionHandler extends Handle
{
    public function render(Exception $e)
    {
        // joy异常
        if ($e instanceof JoyException) {
            return json(array('message' => $e->getMessage(), 'code' => $e->getCode(), 'state' => false));
        }
        // 参数验证错误
        if ($e instanceof ValidateException) {
            return json($e->getError(), 422);
        }
        // 请求异常
        if ($e instanceof HttpException && request()->isAjax()) {
            return response($e->getMessage(), $e->getStatusCode());
        }
        // 其他错误交给系统处理
        return parent::render($e);
    }
}

