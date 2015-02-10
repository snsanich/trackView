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
    protected $track;
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
     * Add track
     *
     * @param Golovnya\TrackBundle\Document\Track $track
     */
    public function addTrack(\Golovnya\TrackBundle\Document\Track $track)
    {
        $this->track[] = $track;
    }

    /**
     * Remove track
     *
     * @param Golovnya\TrackBundle\Document\Track $track
     */
    public function removeTrack(\Golovnya\TrackBundle\Document\Track $track)
    {
        $this->track->removeElement($track);
    }

    /**
     * Get track
     *
     * @return Doctrine\Common\Collections\Collection $track
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     * Set track
     *
     * @param hash $track
     * @return self
     */
    public function setTrack($track)
    {
        $this->track = $track;
        return $this;
    }
}
