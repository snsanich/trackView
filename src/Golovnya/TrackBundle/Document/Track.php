<?php

namespace Golovnya\TrackBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="track")
 */
class Track
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
     * @MongoDB\String
     */
    protected $duration;

    /**
     * @MongoDB\String
     */
    protected $producer;

    /**
     * @MongoDB\String
     */
    protected $genres;

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
     * Set duration
     *
     * @param string $duration
     * @return self
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
        return $this;
    }

    /**
     * Get duration
     *
     * @return string $duration
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set producer
     *
     * @param string $producer
     * @return self
     */
    public function setProducer($producer)
    {
        $this->producer = $producer;
        return $this;
    }

    /**
     * Get producer
     *
     * @return string $producer
     */
    public function getProducer()
    {
        return $this->producer;
    }

    /**
     * Set genres
     *
     * @param string $genres
     * @return self
     */
    public function setGenres($genres)
    {
        $this->genres = $genres;
        return $this;
    }

    /**
     * Get genres
     *
     * @return string $genres
     */
    public function getGenres()
    {
        return $this->genres;
    }
}
