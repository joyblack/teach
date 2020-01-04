<?php
namespace app\utils;
use Firebase\JWT\JWT;
use app\common\constant\ProjectConstant;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\SignatureInvalidException;

class JwtUtil {
    /**
     * 签发Token
     */
    public static function issue($user)
    {
        $time = time(); //当前时间
        $token = [
            'iss' => 'http://www.helloweba.net', //签发者 可选
            'aud' => 'http://www.helloweba.net', //接收该JWT的一方，可选
            'iat' => $time, //签发时间
            'nbf' => $time , //(Not Before)：某个时间点后才能访问，比如设置time+30，表示当前时间30秒后才能使用
            'exp' => $time+7200, //过期时间,这里设置2个小时
            'data' => $user
        ];
        return JWT::encode($token, ProjectConstant::$JWT_KEY);
    }
    
    /**
     * 解析token
     */
    public static function parse($token)
    {
        try {
            JWT::$leeway = 60;//当前时间减去60，把时间留点余地
            //HS256方式，这里要和签发的时候对应
            $decoded = JWT::decode($token, ProjectConstant::$JWT_KEY, ['HS256']); 
            $arr = (array)$decoded;
            print_r($arr);
        } catch(SignatureInvalidException $e) {  //签名不正确
            echo $e->getMessage();
        }catch(BeforeValidException $e) {  // 签名在某个时间点之后才能用
            echo $e->getMessage();
        }catch(ExpiredException $e) {  // token过期
            echo $e->getMessage();
        }catch(\Exception $e) {  //其他错误
            echo $e->getMessage();
        }
        //Firebase定义了多个 throw new，我们可以捕获多个catch来定义问题，catch加入自己的业务，比如token过期可以用当前Token刷新一个新Token
    }
}
