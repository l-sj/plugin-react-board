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

namespace Blueng\XpressenginePlugin\ReactBoard\Models;

use Xpressengine\Counter\Models\CounterLog;
use Xpressengine\Document\Models\Document;
use Xpressengine\Http\Request;
use Xpressengine\Media\MediaManager;
use Xpressengine\Media\Models\Media;
use Xpressengine\Plugins\Comment\CommentUsable;
use Xpressengine\Routing\InstanceRoute;
use Xpressengine\Seo\SeoUsable;
use Xpressengine\Storage\File;
use Xpressengine\Tag\Tag;
use Xpressengine\User\Models\Guest;
use Xpressengine\User\Models\UnknownUser;
use Xpressengine\User\Models\User;

/**
 * Board
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 */
class Board extends Document implements CommentUsable, SeoUsable
{
    /**
     * get user id
     *
     * @return string
     */
    public function getUserId()
    {
        $userId = $this->getAttribute('userId');
        if ($this->getAttribute('userType') === self::USER_TYPE_ANONYMITY) {
            $userId = '';
        }

        return $userId;
    }

    /**
     * Return is new
     *
     * @param int $hour hour config value
     * @return bool
     */
    public function isNew($hour)
    {
        return strtotime($this->getAttribute(static::CREATED_AT)) + ($hour * 86400) > time();
    }

    /**
     * get assent counter log
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function assents()
    {
        return $this->hasMany(CounterLog::class, 'targetId')->where('counterName', 'vote')->where('counterOption', 'assent');
    }

    /**
     * get board data
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function boardData()
    {
        return $this->hasOne('Xpressengine\Plugins\Board\Models\BoardData', 'targetId');
    }

    /**
     * get slug
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function boardSlug()
    {
        return $this->hasOne('Xpressengine\Plugins\Board\Models\BoardSlug', 'targetId');
    }

    /**
     * get slug
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function boardCategory()
    {
        return $this->hasOne('Xpressengine\Plugins\Board\Models\BoardCategory', 'targetId');
    }

    /**
     * get files
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function files()
    {
        return $this->belongsToMany(File::class, 'fileables', 'fileableId', 'fileId');
    }

    /**
     * get users
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        return $this->hasOne('Xpressengine\User\Models\User', 'id', 'userId');
    }

    /**
     * get comments
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany('Xpressengine\Comment\Models\Comment', 'targetId');
    }

    /**
     * get tags
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'taggables', 'taggableId', 'tagId');
    }

    /**
     * get slug
     *
     * @return string
     */
    public function getSlug()
    {
        $slug = $this->boardSlug;
        return $slug === null ? '' : $slug->slug;
    }

    /**
     * get file ids
     *
     * @return array
     */
    public function getFileIds()
    {
        $files = $this->files;
        $ids = [];
        foreach ($files as $file) {
            $ids[] = $file->id;
        }
        return $ids;
    }

    /**
     * get favorite
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function favorite()
    {
        return $this->belongsTo('Xpressengine\Plugins\Board\Models\BoardFavorite', 'id', 'targetId');
    }

    /**
     * get slug
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function slug()
    {
        return $this->belongsTo('Xpressengine\Plugins\Board\Models\BoardSlug', 'id', 'targetId');
    }

    /**
     * get slug
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function data()
    {
        return $this->belongsTo('Xpressengine\Plugins\Board\Models\BoardData', 'id', 'targetId');
    }

    /**
     * 비회원이 작성 글 여부 반환
     *
     * @return bool
     */
    public function isGuest()
    {
        return $this->getAttribute('userType') === self::USER_TYPE_GUEST;
    }

    /**
     * Returns unique identifier
     *
     * @return string
     */
    public function getUid()
    {
        return $this->getAttribute('id');
    }

    /**
     * Returns instance identifier
     *
     * @return mixed
     */
    public function getInstanceId()
    {
        return $this->getAttribute('instanceId');
    }

    /**
     * Returns author
     *
     * @return \Xpressengine\User\UserInterface
     */
    public function getAuthor()
    {
        if ($this->user !== null) {
            return $this->user;
        } elseif ($this->isGuest() === true) {
            return new Guest;
        } else {
            return new UnknownUser;
        }
    }

    /**
     * has user
     *
     * @return bool
     */
    public function hasAuthor()
    {
        return $this->user !== null;
    }

    /**
     * Returns the link
     *
     * @param InstanceRoute $route route instance
     * @return string
     */
    public function getLink(InstanceRoute $route)
    {
        return $route->url . '/show/' . $this->getKey();
    }

    /**
     * visible
     *
     * @param $query
     */
    public function scopeVisible($query)
    {
        $query->where('status', Document::STATUS_PUBLIC)
            ->whereIn('display', [Document::DISPLAY_VISIBLE, Document::DISPLAY_SECRET])
            ->where('published', Document::PUBLISHED_PUBLISHED);
    }

    /**
     * notice
     *
     * @param $query
     */
    public function scopeNotice($query)
    {
        $query->where('status', Document::STATUS_NOTICE)
            ->whereIn('display', [Document::DISPLAY_VISIBLE, Document::DISPLAY_SECRET])
            ->where('published', Document::PUBLISHED_PUBLISHED);
    }

    /**
     * Returns title
     *
     * @return string
     */
    public function getTitle()
    {
        $title = $this->getAttribute('title');

        return $title;
    }

    /**
     * Returns description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->getAttribute('pureContent');
    }

    /**
     * Returns keyword
     *
     * @return string|array
     */
    public function getKeyword()
    {
        return [];
    }

    /**
     * Returns url
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->getSlug();
    }

    /**
     * Returns image url list
     *
     * @return array
     */
    public function getImages()
    {
        $files = File::getByFileable($this->getKey());

        /** @var MediaManager $mediaManager */
        $mediaManager = app('xe.media');
        $imageHandler = $mediaManager->getHandler(Media::TYPE_IMAGE);

        $images = [];
        foreach ($files as $file) {
            if ($mediaManager->getFileType($file) === Media::TYPE_IMAGE) {
                $images[] = $imageHandler->make($file);
            }
        }
        return $images;
    }

    /**
     * get array
     *
     * @return array
     */
    public function toArray()
    {
        /** @var Request $request */
        $request = app('request');
        $this->attributes['links'] = [
            'rel' => 'self',
            'href' => app('Xpressengine\Plugins\Board\UrlHandler')->getShow($this, $request->query->all()),
        ];
        $this->attributes['user'] = $this->user;
        $this->attributes['tags'] = $this->tags;
        $this->attributes['category'] = $this->boardCategory;

        return parent::toArray();
    }
}
