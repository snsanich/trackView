<?php

namespace Golovnya\TrackBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Golovnya\TrackBundle\Document\Track;
use Golovnya\TrackBundle\Document\Playlist;

use Symfony\Component\HttpFoundation\Response;

class TrackController extends Controller
{

    /**
     * @Route("/trackByPlaylist/{id}", defaults={"id" = ""})
     * @Template()
     */
    public function trackAction($id)
    {
        $playlist = $this->get('doctrine_mongodb')
            ->getRepository("GolovnyaTrackBundle:Playlist")
            ->findOneById($id);

        if (!$playlist){
            $response = new Response(json_encode(array('tracks' => [])));
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $trackIds = array_map(function($track){
            $list = (array)$track;
            return $list['$id'];
        }, $playlist->getTrack());

        $qb = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder("GolovnyaTrackBundle:Track")
            ->field('id')->in($trackIds);

        $tracks = $qb->getQuery()->execute();
        $mappedTracks = array();
        foreach ($tracks as $track){
          $mappedTracks[] = array(
              "id" => $track->getId(),
              "name" => $track->getName(),
              "duration" => $track->getDuration(),
              "producer" => $track->getProducer(),
              "genres" => $track->getGenres()
            );
        }

        $response = new Response(json_encode(array('tracks' => $mappedTracks)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    /**
     * @Route("/playlist")
     * @Template()
     */
    public function playlistAction()
    {
        $playlists = $this->get('doctrine_mongodb')
            ->getRepository("GolovnyaTrackBundle:Playlist")
            ->findAll();

        $mappedPlaylists = array_map(function($playlist){
            return array(
              "id" => $playlist->getId(),
              "name" => $playlist->getName()
            );
        }, $playlists);

        $response = new Response(json_encode(array('playlists' => $mappedPlaylists)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    /**
     * @Route("/testTrackByPlaylist/{id}", defaults={"id" = ""})
     * @Template()
     *
    public function testTrackAction($id)
    {
        $playlists = [
          1 => [
            [ "name" => "name1", "duration" => null, "producer" => null, "genres" => null ],
            [ "name" => "name2", "duration" => "ve2", "producer" => null, "genres" => null ],
            [ "name" => "name3", "duration" => "ve3", "producer" => null, "genres" => null ]
          ],
          2 => [
            [ "name" => "name1", "duration" => null, "producer" => null, "genres" => null ],
            [ "name" => "name4", "duration" => "ve4", "producer" => null, "genres" => null ],
            [ "name" => "name5", "duration" => "ve5", "producer" => null, "genres" => null ],
            [ "name" => "name2", "duration" => "ve2", "producer" => null, "genres" => null ]
          ]
        ];

        $mappedTracks = [];
        if (isset($playlists[$id])){
            $mappedTracks = $playlists[$id];
        }

        $response = new Response(json_encode(array('tracks' => $mappedTracks)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    **
     * @Route("/testPlaylist")
     * @Template()
     *
    public function testPlaylistAction()
    {
        $mappedPlaylists = [
          [ "id" => 1, "name" => "Playlist1"],
          [ "id" => 2, "name" => "Playlist2"]
        ];

        $response = new Response(json_encode(array('playlists' => $mappedPlaylists)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
*/
}
