<?php

namespace Golovnya\TrackBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{

    protected function getJsonContent($method, $uri)
    {
        $client = static::createClient();

        $crawler = $client->request($method, $uri);
        $jsonString = $client->getResponse()->getContent();
        return json_decode($jsonString);
    }

    public function testPlaylist()
    {
        $json = $this->getJsonContent('GET', '/playlist');
        $this->assertObjectHasAttribute('playlists', $json);
        $this->assertNotEmpty($json->playlists);
    }

    public function testTrackByPlaylist()
    {
        $json = $this->getJsonContent('GET', '/trackByPlaylist/54d9cf9a46115f5f677a5b8f');
        $this->assertObjectHasAttribute('tracks', $json);
        $this->assertNotEmpty($json->tracks);
    }

    public function testTrackByPlaylistEmpty()
    {
        $json = $this->getJsonContent('GET', '/trackByPlaylist');
        $this->assertObjectHasAttribute('tracks', $json);
        $this->assertEmpty($json->tracks);
    }
}
