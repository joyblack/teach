<?php
Route::get('think', function () {
    return 'hello,ThinkPHP5!';
});

Route::get('hello/:name', 'index/hello');

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
})->prefix('upload/')->allowCrossDomain();

/**
 * download
 */
Route::group([], function(){
    Route::get('download/expert/:id', 'expert');
})->prefix('download/')->allowCrossDomain();

return [

];
