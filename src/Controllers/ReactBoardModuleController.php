<?php
namespace Xpressengine\Plugins\ReactBoard\Controllers;

use Auth;
use Gate;
use XePresenter;
use App\Http\Controllers\Controller;

use Xpressengine\Http\Request;
use Xpressengine\Permission\Instance;
use Xpressengine\Plugins\Board\Exceptions\HaveNoWritePermissionHttpException;
use Xpressengine\Plugins\Board\Exceptions\NotFoundDocumentException;
use Xpressengine\Plugins\Board\Exceptions\NotFoundFavoriteHttpException;
use Xpressengine\Plugins\Board\Handler;
use Xpressengine\Plugins\ReactBoard\ReactBoardModule;
use Xpressengine\Plugins\ReactBoard\ReactBoardConfigHandler;
use Xpressengine\Plugins\ReactBoard\ReactBoardPermissionHandler;
use Xpressengine\Plugins\Board\IdentifyManager;
use Xpressengine\Plugins\Board\Models\Board;
use Xpressengine\Plugins\Board\Models\BoardFavorite;
use Xpressengine\Plugins\Board\Services\BoardService;
use Xpressengine\Plugins\Board\Validator;
use Xpressengine\Routing\InstanceConfig;
use Xpressengine\Support\Exceptions\AccessDeniedHttpException;

class ReactBoardModuleController extends Controller
{
    protected $isManager = false;

    protected $instanceId;

    protected $config;

    protected $configHandler;

    protected $handler;

    public function __construct(
        Handler $handler,
        ReactBoardConfigHandler $configHandler,
        ReactBoardPermissionHandler $boardPermission
    ) {
        $instanceConfig = InstanceConfig::instance();
        $this->instanceId = $instanceConfig->getInstanceId();

        $this->handler = $handler;
        $this->configHandler = $configHandler;

        $this->config = $configHandler->get($this->instanceId);
        if ($this->config !== null) {
            $this->isManager = false;
            if (Gate::allows(
                ReactBoardPermissionHandler::ACTION_MANAGE,
                new Instance($boardPermission->name($this->instanceId))
            )) {
                $this->isManager = true;
            };
        }

        // set Skin
        XePresenter::setSkinTargetId(ReactBoardModule::getId());
        XePresenter::share('handler', $handler);
        XePresenter::share('configHandler', $configHandler);
        XePresenter::share('isManager', $this->isManager);
        XePresenter::share('instanceId', $this->instanceId);
        XePresenter::share('config', $this->config);
        XePresenter::share('instanceConfig', $instanceConfig);
    }

    public function container()
    {
        return XePresenter::makeAll('container', [

        ]);
    }

    /**
     * @param BoardService $service
     * @param Request $request
     * @return mixed
     * @todo notice 는 어떻게 할까?
     */
    public function articles(BoardService $service, Request $request)
    {
//        $notices = $service->getNoticeItems($request, $this->config, Auth::user()->getId());
        $paginate = $service->getItems($request, $this->config);

        return XePresenter::makeApi([
//            'notices' => $notices,
            'paginate' => $paginate,
        ]);
    }

    public function show(
        BoardService $service,
        Request $request,
        ReactBoardPermissionHandler $boardPermission,
        $menuUrl,
        $id
    ) {
        if (Gate::denies(
            ReactBoardPermissionHandler::ACTION_READ,
            new Instance($boardPermission->name($this->instanceId))
        )) {
            throw new AccessDeniedHttpException;
        }

        $item = $service->getItem($id, Auth::user(), $this->config, $this->isManager);

        // 글 조회수 증가
        if ($item->display == Board::DISPLAY_VISIBLE) {
            $this->handler->incrementReadCount($item, Auth::user());
        }

        return XePresenter::makeApi([
            'item' => $item,
        ]);
    }

    public function store(
        BoardService $service,
        Request $request,
        Validator $validator,
        ReactBoardPermissionHandler $boardPermission,
        IdentifyManager $identifyManager
    ) {
        if (Gate::denies(
            ReactBoardPermissionHandler::ACTION_CREATE,
            new Instance($boardPermission->name($this->instanceId))
        )) {
            throw new AccessDeniedHttpException;
        }

        // 유표성 체크
        $this->validate($request, $validator->getCreateRule(Auth::user(), $this->config));

        // 공지 등록 권한 확인
        if ($request->get('status') == Board::STATUS_NOTICE && $this->isManager === false) {
            throw new HaveNoWritePermissionHttpException(['name' => xe_trans('xe::notice')]);
        }

        $item = $service->store($request, Auth::user(), $this->config, $identifyManager);

        return XePresenter::makeApi([
            'item' => $item
        ]);
    }

    public function update(
        BoardService $service,
        Request $request,
        Validator $validator,
        IdentifyManager $identifyManager,
        $menuUrl,
        $id
    ) {
        $item = Board::division($this->instanceId)->find($request->get('id'));

        // 비회원이 작성 한 글 인증
        if ($this->isManager !== true &&
            $item->isGuest() === true &&
            $identifyManager->identified($item) === false &&
            Auth::user()->getRating() != 'super') {
            // 지원 안함?
            throw new \Exception('비회원 글 쓰기 지원 안함');
//            return $this->guestId($menuUrl, $item->id, $this->urlHandler->get('edit', ['id' => $item->id]));
        }

        $this->validate($request, $validator->getEditRule(Auth::user(), $this->config));

        if ($service->hasItemPerm($item, Auth::user(), $identifyManager, $this->isManager) == false) {
            throw new AccessDeniedHttpException;
        }

        // 공지 등록 권한 확인
        if ($request->get('status') == Board::STATUS_NOTICE && $this->isManager === false) {
            throw new HaveNoWritePermissionHttpException(['name' => xe_trans('xe::notice')]);
        }

        $item = $service->update($item, $request, Auth::user(), $this->config, $identifyManager);

        return XePresenter::makeApi([
            'item' => $item
        ]);

    }

    public function destroy(
        BoardService $service,
        Request $request,
        Validator $validator,
        IdentifyManager $identifyManager,
        $menuUrl,
        $id
    ) {
        /** @var Board $item */
        $item = Board::division($this->instanceId)->find($id);

        if ($item === null) {
            throw new NotFoundDocumentException;
        }

        // 비회원이 작성 한 글 인증
        if ($item->isGuest() === true &&
            $identifyManager->identified($item) === false &&
            Auth::user()->getRating() != 'super') {
            // 글 보기 페이지에서 삭제하기 다시 누르면 삭제 됨
            // 지원 안함?
            throw new \Exception('비회원 글 쓰기 지원 안함');
//            return $this->guestId($validator, $menuUrl, $item->id, $this->urlHandler->get('show', ['id' => $item->id]));
        }

        if ($service->hasItemPerm($item, Auth::user(), $identifyManager, $this->isManager) == false) {
            throw new AccessDeniedHttpException;
        }

        $service->destroy($item, $this->config, $identifyManager);

        return XePresenter::makeApi([
            'item' => $item,
        ]);
    }

    public function createFavorite($menuUrl, $id)
    {
        if (Auth::check() === false) {
            throw new AccessDeniedHttpException;
        }
        $item = Board::division($this->instanceId)->find($id);

        $userId = Auth::user()->getId();
        if (BoardFavorite::where('targetId', $item->id)->where('userId', $userId)->exists() === true) {
            throw new \Exception('이미 처리되었습니다.');
        }
        $favorite = $this->handler->addFavorite($item->id, $userId);

        return XePresenter::makeApi(['favorite' => $favorite]);
    }

    public function destroyFavorite($menuUrl, $id)
    {
        if (Auth::check() === false) {
            throw new AccessDeniedHttpException;
        }
        $item = Board::division($this->instanceId)->find($id);

        $userId = Auth::user()->getId();
        $favorite = BoardFavorite::where('targetId', $item->id)->where('userId', $userId)->first();
        if ($favorite === null) {
            throw new NotFoundFavoriteHttpException;
        }
        $favorite->delete();

        return XePresenter::makeApi(['favorite' => $favorite]);
    }

    public function category(BoardService $service)
    {
        $categories = $service->getCategoryItems($this->config);

        foreach ($categories as $key => $category) {
            $categories[$key]['text'] = xe_trans($category['text']);
        }

        return XePresenter::makeApi([
            'categories' => $categories,
        ]);
    }
}
