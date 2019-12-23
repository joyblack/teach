<?php
namespace app\index\controller;

use think\Controller;
use think\Db;

class UserController extends Controller
{
    public function get($id) {
        return json(Db::table('th_user') -> find($id));
    }
}
