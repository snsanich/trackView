<?php

namespace Golovnya\TrackBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="playlist")
 */
class Playlist
{

    /**
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @MongoDB\String
     */
    protected $name;

    /**
     * @MongoDB\Hash
     */
    protected $tracks;
    public function __construct()
    {
        $this->track = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set tracks
     *
     * @param hash $tracks
     * @return self
     */
    public function setTracks($tracks)
    {
        $this->tracks = $tracks;
        return $this;
    }

    /**
     * Get tracks
     *
     * @return hash $tracks
     */
    public function getTracks()
    {
        return $this->tracks;
    }
}
