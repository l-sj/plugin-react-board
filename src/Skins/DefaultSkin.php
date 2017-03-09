<?php
/**
 * DefaultSkin
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     LGPL-2.1
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * @link        https://xpressengine.io
 */

namespace Blueng\ReactBoard\Skins;

use XePresenter;
use Xpressengine\Config\ConfigEntity;
use Xpressengine\Menu\Models\MenuItem;
use Xpressengine\Plugins\Board\Skins\DynamicField\DesignSelectSkin;
use Xpressengine\Plugins\Board\Skins\PaginationMobilePresenter;
use Xpressengine\Plugins\Board\Skins\PaginationPresenter;
use Xpressengine\Presenter\Presenter;
use Xpressengine\Routing\InstanceConfig;
use Xpressengine\Skin\AbstractSkin;
use View;
use XeFrontend;

/**
 * DefaultSkin
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 */
class DefaultSkin extends AbstractSkin
{
    protected static $skinAlias = 'react_board::views.defaultSkin';

    /**
     * @var array
     */
    protected $defaultListColumns = [
        'title', 'writer', 'assentCount', 'readCount', 'createdAt', 'updatedAt', 'dissentCount',
    ];

    protected $defaultSelectedListColumns = [
        'title', 'writer',  'assentCount', 'readCount', 'createdAt',
    ];


    /**
     * @var array
     */
    protected $defaultFormColumns = [
        'title', 'content',
    ];

    /**
     * @var array
     */
    protected $defaultSelectedFormColumns = [
        'title', 'content',
    ];

    /**
     * render
     *
     * @return \Illuminate\View\View
     */
    public function render()
    {
        // call customizer
        // view 아이디를 기준으로 Customizer 호출
        $customizer = $this->view . 'Customizer';
        if (method_exists($this, $customizer)) {
            $this->$customizer();
        }

        $this->data['skinAlias'] = static::$skinAlias;

        return View::make(sprintf('%s.container', static::$skinAlias), $this->data);
    }


    /**
     * get setting view
     *
     * @param array $config config
     * @return \Illuminate\Contracts\Support\Renderable|string
     */
    public function renderSetting(array $config = [])
    {
        if ($config === []) {
            $config = [
                'listColumns' => $this->defaultSelectedListColumns,
                'formColumns' => $this->defaultSelectedFormColumns,
            ];
        }

        $arr = explode(':', request()->get('instanceId'));
        $instanceId = $arr[1];

        return View::make(
            sprintf('%s.%s', static::$skinAlias, 'setting'),
            [
                'sortListColumns' => $this->getSortListColumns($config, $instanceId),
                'sortFormColumns' => $this->getSortFormColumns($config, $instanceId),
                'config' => $config
            ]
        );
    }

    protected function getSortListColumns(array $config, $instanceId)
    {
        /** @var \Xpressengine\Plugins\Board\ConfigHandler $configHandler */
        $configHandler = app('xe.board.config');

        if (empty($config['sortListColumns'])) {
            $sortListColumns = $this->defaultListColumns;
        } else {
            $sortListColumns = $config['sortListColumns'];
        }

        $dynamicFields = $configHandler->getDynamicFields($configHandler->get($instanceId));
        $currentDynamicFields = [];
        /**
         * @var ConfigEntity $dynamicFieldConfig
         */
        foreach ($dynamicFields as $dynamicFieldConfig) {
            if ($dynamicFieldConfig->get('use') === true) {
                $currentDynamicFields[] = $dynamicFieldConfig->get('id');
            }

            if (
                $dynamicFieldConfig->get('use') === true &&
                in_array($dynamicFieldConfig->get('id'), $sortListColumns) === false
            ) {
                $sortListColumns[] = $dynamicFieldConfig->get('id');
            }
        }

        $usableColumns = array_merge($this->defaultListColumns, $currentDynamicFields);
        foreach ($sortListColumns as $index => $column) {
            if (in_array($column, $usableColumns) === false) {
                unset($sortListColumns[$index]);
            }
        }

        return $sortListColumns;
    }

    protected function getSortFormColumns(array $config, $instanceId)
    {
        /** @var \Xpressengine\Plugins\Board\ConfigHandler $configHandler */
        $configHandler = app('xe.board.config');

        if (empty($config['sortFormColumns'])) {
            $sortFormColumns = $this->defaultFormColumns;
        } else {
            $sortFormColumns = $config['sortFormColumns'];
        }
        $dynamicFields = $configHandler->getDynamicFields($configHandler->get($instanceId));
        $currentDynamicFields = [];
        /**
         * @var ConfigEntity $dynamicFieldConfig
         */
        foreach ($dynamicFields as $dynamicFieldConfig) {
            if ($dynamicFieldConfig->get('use') === true) {
                $currentDynamicFields[] = $dynamicFieldConfig->get('id');
            }

            if (
                $dynamicFieldConfig->get('use') === true &&
                in_array($dynamicFieldConfig->get('id'), $sortFormColumns) === false
            ) {
                $sortFormColumns[] = $dynamicFieldConfig->get('id');
            }
        }

        $usableColumns = array_merge($this->defaultFormColumns, $currentDynamicFields);
        foreach ($sortFormColumns as $index => $column) {
            if (in_array($column, $usableColumns) === false) {
                unset($sortFormColumns[$index]);
            }
        }

        return $sortFormColumns;
    }
}
