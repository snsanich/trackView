<?php

namespace Golovnya\TrackBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Golovnya\TrackBundle\Document\Playlist;

use Symfony\Component\HttpFoundation\Response;

class TrackController extends Controller
{

    /**
     * @Route("/trackByPlaylist/{id}", defaults={"id" = ""})
     * @Method("GET")
     * @Template()
     * @param $id string
     * @return Response
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

        $trackIds = array_map(function(\MongoId $track){
            $list = (array)$track;
            return $list['$id'];
        }, $playlist->getTracks());

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
     * @Method("GET")
     * @Template()
     */
    public function playlistAction()
    {
        $playlists = $this->get('doctrine_mongodb')
            ->getRepository("GolovnyaTrackBundle:Playlist")
            ->findAll();

        $mappedPlaylists = array_map(function(Playlist $playlist){
            return array(
              "id" => $playlist->getId(),
              "name" => $playlist->getName()
            );
        }, $playlists);

        $response = new Response(json_encode(array('playlists' => $mappedPlaylists)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
}
