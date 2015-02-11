jsx src/Golovnya/TrackBundle/Resources/public/js/src/ src/Golovnya/TrackBundle/Resources/public/js/build/ || return;
jsx src/Golovnya/TrackBundle/Resources/public/js/spec/ src/Golovnya/TrackBundle/Resources/public/js/build/ || return;
php app/console assets:install
php app/console cache:clear --env=dev
