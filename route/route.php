<?php
Route::get('think', function () {
    return 'hello,ThinkPHP5!';
});

Route::get('hello/:name', 'index/hello');
/**
 * login
 */
Route::group([], function(){
    Route::post('login/login', 'login');
})->prefix('login/')->allowCrossDomain();

/**
 * user
 */
Route::group([], function(){
    Route::post('user/add', 'add');
    Route::delete('user/delete/:id', 'delete');
    Route::get('user/get/:id', 'get');
    Route::post('user/page', 'page');
    Route::put('user/edit', 'edit');
    Route::put('user/status/:id/:status', 'status');
    Route::put('user/resetPassword/:id', 'resetPassword');
    Route::put('user/changePassword', 'changePassword');
})->prefix('user/')->allowCrossDomain();

/**
 * expert
 */
Route::group([], function(){
    Route::post('expert/add', 'add');
    Route::delete('expert/delete/:id', 'delete');
    Route::get('expert/get/:id', 'get');
    Route::post('expert/page', 'page');
    Route::post('expert/uploadFile', 'uploadFile');
    Route::put('expert/edit', 'edit');
    Route::put('expert/status/:id/:status', 'status');
})->prefix('expert/')->allowCrossDomain();

/**
 * upload
 */
Route::group([], function(){
    Route::post('upload/expert', 'expert');
    Route::post('upload/newsBanner', 'newsBanner');
    Route::post('upload/newsPhoto', 'newsPhoto');
    Route::post('upload/infoBanner', 'infoBanner');
    Route::post('upload/infoPhoto', 'infoPhoto');
})->prefix('upload/')->allowCrossDomain();

/**
 * download
 */
Route::group([], function(){
    Route::get('download/expert/:id', 'expert');
    Route::get('download/newsBanner/:id', 'newsBanner');
    Route::get('download/newsPhoto/:id', 'newsPhoto');
    Route::get('download/infoBanner/:id', 'infoBanner');
    Route::get('download/infoPhoto/:id', 'infoPhoto');
})->prefix('download/')->allowCrossDomain();

/**
 * news
 */
Route::group([], function(){
    Route::post('news/add', 'add');
    Route::delete('news/delete/:id', 'delete');
    Route::get('news/get/:id', 'get');
    Route::post('news/page', 'page');
    Route::put('news/edit', 'edit');
    Route::put('news/status/:id/:status', 'status');
})->prefix('news/')->allowCrossDomain();

/**
 * info
 */
Route::group([], function(){
    Route::post('info/add', 'add');
    Route::delete('info/delete/:id', 'delete');
    Route::get('info/get/:id', 'get');
    Route::post('info/page', 'page');
    Route::put('info/edit', 'edit');
    Route::put('info/status/:id/:status', 'status');
})->prefix('info/')->allowCrossDomain();

return [

];
