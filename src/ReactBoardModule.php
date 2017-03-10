<?php
/**
 * Board
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     LGPL-2.1
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * @link        https://xpressengine.io
 */

namespace Blueng\ReactBoard;

use Route;
use XeSkin;
use View;
use Mail;
use Xpressengine\Menu\AbstractModule;
use Xpressengine\Plugins\Board\Handler as BoardHandler;
use Xpressengine\Plugins\Board\ConfigHandler;
use Xpressengine\Plugins\Board\UrlHandler;
use Xpressengine\Plugins\Board\Models\Board as BoardModel;
use Xpressengine\Plugins\Board\Models\BoardSlug;
use Xpressengine\Plugins\Board\ToggleMenus\TrashItem;
use Xpressengine\Plugins\Comment\Handler as CommentHandler;
use Xpressengine\Plugins\Comment\Models\Comment;
use Xpressengine\Plugins\Comment\Models\Target as CommentTarget;

/**
 * Board
 *
 * * Board Module
 * * AbstractModule 인터페이스 지원. 메뉴로 추가할 수 있음.
 * * Boot 할 때 Addon, Order 게시판 번들 추가 기능 등록
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 */
class ReactBoardModule extends AbstractModule
{
    const FILE_UPLOAD_PATH = 'public/plugin/board';
    const THUMBNAIL_TYPE = 'spill';

    /**
     * boot
     *
     * @return void
     */
    public static function boot()
    {
        self::registerManageRoute();
        self::registerInstanceRoute();
        //self::registerApiRoute();
    }
    /**
     * Register Plugin Manage Route
     *
     * @return void
     */
    protected static function registerManageRoute()
    {
        Route::settings(self::getId(), function () {
            Route::get('/', ['as' => 'settings.board.board.index', 'uses' => 'ReactBoardSettingsController@index']);
            Route::get(
                '/global/edit',
                ['as' => 'settings.react_board.global.edit', 'uses' => 'ReactBoardSettingsController@globalEdit']
            );
            Route::post(
                '/global/update',
                ['as' => 'settings.react_board.global.update', 'uses' => 'ReactBoardSettingsController@globalUpdate']
            );
            Route::get('edit/{boardId}', ['as' => 'settings.react_board.edit', 'uses' => 'ReactBoardSettingsController@edit']);
            Route::post(
                'update/{boardId}',
                ['as' => 'settings.react_board.update', 'uses' => 'ReactBoardSettingsController@update']
            );
            Route::post('storeCategory/', [
                'as' => 'settings.react_board.storeCategory', 'uses' => 'ReactBoardSettingsController@storeCategory'
            ]);
        }, ['namespace' => 'Blueng\ReactBoard\Controllers']);
    }


    /**
     * Register Plugin Instance Route
     *
     * @return void
     */
    protected static function registerInstanceRoute()
    {
        Route::instance(self::getId(), function () {
            // container html response
            Route::get('/', ['as' => 'container', 'uses' => 'ReactBoardModuleController@container']);

            // api
            Route::get('/list/', ['as' => 'api.list', 'uses' => 'ReactBoardModuleController@articles']);
            Route::get('/show/{id}', ['as' => 'api.show', 'uses' => 'ReactBoardModuleController@show']);
            Route::post('/store/', ['as' => 'api.store', 'uses' => 'ReactBoardModuleController@store']);
            Route::match(['post', 'put'], '/update/{id}', [
                'as' => 'api.update', 'uses' => 'ReactBoardModuleController@update'
            ]);
            Route::match(['post', 'delete'], '/destroy/{id}', [
                'as' => 'api.destroy', 'uses' => 'ReactBoardModuleController@destroy'
            ]);
            Route::post('/favorite/create/{id}', [
                'as' => 'api.favorite.create', 'uses' => 'ReactBoardModuleController@createFavorite'
            ]);
            Route::match(['post', 'delete'], '/favorite/destroy/{id}', [
                'as' => 'api.favorite.destroy', 'uses' => 'ReactBoardModuleController@destroyFavorite'
            ]);

            Route::get('/category', ['as' => 'api.category', 'uses' => 'ReactBoardModuleController@category']);

        }, ['namespace' => 'Blueng\ReactBoard\Controllers']);
    }

/*    protected static function registerApiRoute()
    {
        Route::instance(self::getId(), function () {
            Route::group([
                'prefix' => 'api',
                'namespace' => 'Blueng\ReactBoard\Controllers'
            ], function () {
                Route::get('/articles', ['as' => 'api.articles', 'uses' => 'ApiController@articles']);
                Route::get('/articles/{id}', ['as' => 'api.article', 'uses' => 'ApiController@article']);
                Route::get('/create', ['as' => 'api.create', 'uses' => 'ApiController@create']);
                Route::post('/store', ['as' => 'api.store', 'uses' => 'ApiController@store']);
                Route::get('/edit/{id}', ['as' => 'api.edit', 'uses' => 'ApiController@edit']);
                Route::match(['post', 'put'], '/update/{id?}', ['as' => 'api.update', 'uses' => 'ApiController@update']);
                Route::match(['post', 'delete'], '/destroy/{id?}', ['as' => 'api.delete', 'uses' => 'ApiController@destroy']);
                Route::post('/favorite/{id?}', ['as' => 'api.favorite', 'uses' => 'ApiController@favorite']);
                Route::get('/hasSlug', ['as' => 'hasSlug', 'uses' => 'UserController@hasSlug']);
            });
        });
    }*/



    /**
     * register intercept for comment count
     *
     * @return void
     */
    public static function registerCommentCountIntercept()
    {
        intercept(
            sprintf('%s@create', CommentHandler::class),
            static::class.'-comment-create',
            function ($func, array $inputs, $user = null) {
                $comment = $func($inputs, $user);

                $board = BoardModel::find($comment->target->targetId);

                if ($board == null) {
                    return $comment;
                }
                if ($board->type != static::getId()) {
                    return $comment;
                }

                /** @var BoardHandler $handler */
                $handler = app('xe.board.handler');
                /** @var ConfigHandler $configHandler */
                $configHandler = app('xe.board.config');

                $handler->setModelConfig($board, $configHandler->get($board->instanceId));
                $board->commentCount = CommentTarget::where('targetId', $board->id)->count();
                $board->save();

                return $comment;
            }
        );

        intercept(
            sprintf('%s@trash', CommentHandler::class),
            static::class.'-comment-trash',
            function ($func, Comment $comment) {
                $result = $func($comment);

                if ($board = BoardModel::find($comment->target->targetId)) {
                    if ($board == null) {
                        return $result;
                    }
                    if ($board->type != static::getId()) {
                        return $result;
                    }

                    /** @var BoardHandler $handler */
                    $handler = app('xe.board.handler');
                    /** @var ConfigHandler $configHandler */
                    $configHandler = app('xe.board.config');

                    $handler->setModelConfig($board, $configHandler->get($board->instanceId));
                    $board->commentCount = CommentTarget::where('targetId', $board->id)->count();
                    $board->save();
                }

                return $result;
            }
        );

        intercept(
            sprintf('%s@remove', CommentHandler::class),
            static::class.'-comment-remove',
            function ($func, Comment $comment) {
                $result = $func($comment);

                if ($board = BoardModel::find($comment->target->targetId)) {
                    if ($board == null) {
                        return $result;
                    }
                    if ($board->type != static::getId()) {
                        return $result;
                    }

                    /** @var BoardHandler $handler */
                    $handler = app('xe.board.handler');
                    /** @var ConfigHandler $configHandler */
                    $configHandler = app('xe.board.config');

                    $handler->setModelConfig($board, $configHandler->get($board->instanceId));
                    $board->commentCount = CommentTarget::where('targetId', $board->id)->count();
                    $board->save();
                }

                return $result;
            }
        );

        intercept(
            sprintf('%s@restore', CommentHandler::class),
            static::class.'-comment-restore',
            function ($func, Comment $comment) {
                $result = $func($comment);

                if ($board = BoardModel::find($comment->target->targetId)) {
                    if ($board == null) {
                        return $result;
                    }
                    if ($board->type != static::getId()) {
                        return $result;
                    }

                    /** @var BoardHandler $handler */
                    $handler = app('xe.board.handler');
                    /** @var ConfigHandler $configHandler */
                    $configHandler = app('xe.board.config');

                    $handler->setModelConfig($board, $configHandler->get($board->instanceId));
                    $board->commentCount = CommentTarget::where('targetId', $board->id)->count();
                    $board->save();
                }

                return $result;
            }
        );
    }

    /**
     * register intercept ofr comment alarm
     *
     * @return void
     */
    public static function registerCommentAlarmIntercept()
    {
        intercept(
            sprintf('%s@create', CommentHandler::class),
            static::class.'-comment-alarm',
            function ($func, $inputs, $user = null) {
                $comment = $func($inputs, $user);

                $board = BoardModel::find($comment->target->targetId);

                if ($board == null) {
                    return $comment;
                }
                if ($board->type != static::getId()) {
                    return $comment;
                }
                if ($board->userId == $comment->userId) {
                    return $comment;
                }
                if ($board->userId == '') {
                    return $comment;
                }
                if ($board->boardData->isAlarm() === false) {
                    return $comment;
                }

                /**
                 * todo check show url
                 */
                /** @var UrlHandler $urlHandler */
                $urlHandler = app('xe.board.url');
                $urlHandler->setConfig(app('xe.board.config')->get($board->instanceId));
                $url = $urlHandler->getShow($board);
                $data = [
                    'title' => xe_trans('react_board::newCommentRegistered'),
                    'contents' => sprintf(
                        '<a href="%s" target="_blank">%s</a><br/><br/><br/>%s',
                        $url,
                        $url,
                        xe_trans(
                            'react_board::newCommentRegisteredBy',
                            ['displayName' => $comment->author->getDisplayName()]
                        )
                    ),
                ];

                Mail::send('emails.notice', $data, function ($m) use ($board) {
                    $writer = $board->user;
                    if ($writer->email != '') {
                        $fromEmail = app('config')->get('mail.from.address');
                        $applicationName = xe_trans(app('xe.site')->getSiteConfig()->get('site_title'));

                        $menuItem = app('xe.menu')->getItem($board->instanceId);
                        $subject = sprintf('Re:[%s] %s', xe_trans($menuItem->title), $board->title);

                        $m->from($fromEmail, $applicationName);
                        $m->to($writer->email, $writer->getDisplayName());
                        $m->subject($subject);
                    }
                });

                return $comment;
            }
        );
    }

    /**
     * register intercept for manager alarm
     *
     * @return void
     */
    public static function registerManagerAlarmIntercept()
    {
        intercept(
            sprintf('%s@add', BoardHandler::class),
            static::class .'-manager-board-alarm',
            function ($func, $args, $user, $config) {
                $board = $func($args, $user, $config);

                /** @var UrlHandler $urlHandler */
                $urlHandler = app('xe.board.url');
                $urlHandler->setConfig($config);
                $url = $urlHandler->getShow($board);
                $data = [
                    'title' => xe_trans('react_board::newPostsRegistered'),
                    'contents' => sprintf(
                        '<a href="%s" target="_blank">%s</a><br/><br/><br/>%s',
                        $url,
                        $url,
                        $board->pureContent
                    ),
                ];

                /** @var ConfigHandler $configHandler */
                $configHandler = app('xe.board.config');
                $config = $configHandler->get($board->instanceId);
                if ($config->get('managerEmail') === null) {
                    return $board;
                }

                $managerEmails = explode(',', trim($config->get('managerEmail')));
                if (count($managerEmails) == 0) {
                    return $board;
                }

                foreach ($managerEmails as $toMail) {
                    if (!$toMail) {
                        continue;
                    }
                    Mail::send('emails.notice', $data, function ($m) use ($toMail, $board) {
                        $fromEmail = app('config')->get('mail.from.address');
                        $applicationName = xe_trans(app('xe.site')->getSiteConfig()->get('site_title'));

                        $menuItem = app('xe.menu')->getItem($board->instanceId);
                        $subject = sprintf(
                            '[%s - %s] %s',
                            $applicationName,
                            xe_trans($menuItem->title),
                            xe_trans('react_board::newPostsRegistered')
                        );

                        $m->from($fromEmail, $applicationName);
                        $m->to($toMail, 'Board manager');
                        $m->subject($subject);
                    });

                }

                return $board;
            }
        );
    }

    /**
     * get manage URI
     *
     * @return string
     */
    public static function getSettingsURI()
    {
        return route('manage.board.board.global.edit');
    }

    /**
     * this module is route able
     *
     * @return bool
     */
    public static function isRouteAble()
    {
        return true;
    }

    /**
     * Return Create Form View
     *
     * @return string
     */
    public function createMenuForm()
    {
        $skins = XeSkin::getList(static::getId());

        return View::make('react_board::views/menuType/create', [
            'boardId' => null,
            'config' => app('xe.react_board.config')->getDefault(),
            'skins' => $skins,
            'handler' => app('xe.board.handler'),
        ])->render();

        return '';
    }

    /**
     * Process to Store
     *
     * @param string $instanceId     instance id
     * @param array  $menuTypeParams menu type parameters
     * @param array  $itemParams     item parameters
     * @return void
     */
    public function storeMenu($instanceId, $menuTypeParams, $itemParams)
    {
        $input = $menuTypeParams;
        $input['boardId'] = $instanceId;

        app('xe.react_board.instance')->create($input);
        app('xe.editor')->setInstance($instanceId, 'editor/ckeditor@ckEditor');
    }

    /**
     * Return Edit Form View
     *
     * @param string $instanceId instance id
     * @return string
     */
    public function editMenuForm($instanceId)
    {
        $skins = XeSkin::getList(static::getId());

        return View::make('react_board::views/menuType/edit', [
            'boardId' => $instanceId,
            'config' => app('xe.react_board.config')->get($instanceId),
            'skins' => $skins,
            'handler' => app('xe.board.handler'),
        ])->render();
    }

    /**
     * Process to Update
     *
     * @param string $instanceId     instance id
     * @param array  $menuTypeParams menu type parameters
     * @param array  $itemParams     item parameters
     * @return void
     */
    public function updateMenu($instanceId, $menuTypeParams, $itemParams)
    {
        $menuTypeParams['boardId'] = $instanceId;

        app('xe.react_board.instance')->updateConfig($menuTypeParams);
    }

    /**
     * Process to delete
     *
     * @param string $instanceId instance id
     * @return void
     */
    public function deleteMenu($instanceId)
    {
        app('xe.react_board.instance')->destroy($instanceId);
    }

    /**
     * summary
     *
     * @param string $instanceId instance id
     * @return string
     */
    public function summary($instanceId)
    {
        return xe_trans(
            'react_board::destroySummary',
            app('xe.react_board.instance')->summary($instanceId, app('xe.board.handler'))
        );
    }

    /**
     * Return URL about module's detail setting
     * getInstanceSettingURI
     *
     * @param string $instanceId instance id
     * @return mixed
     */
    public static function getInstanceSettingURI($instanceId)
    {
        return route('settings.react_board.edit', $instanceId);
    }

    /**
     * Get menu type's item object
     *
     * @param string $id item id of menu type
     * @return mixed
     */
    public function getTypeItem($id)
    {
        static $items = [];

        if (!isset($items[$id])) {
            $items[$id] = \Xpressengine\Plugins\Board\Models\Board::find($id);
        }

        return $items[$id];
    }
}
