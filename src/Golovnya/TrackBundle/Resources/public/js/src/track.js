var PlayListRow = React.createClass({
  render: function(){
    return (
      <tr><th colspan="4">{this.props.name}</th></tr>
    );
  }
});

var TrackRow = React.createClass({
  render: function(){
    return (
      <tr>
        <td>{this.props.track.name}</td>
        <td>{this.props.track.duration}</td>
        <td>{this.props.track.producer}</td>
        <td>{this.props.track.genres}</td>
      </tr>
    );
  }
});

var FilterableTrackTable = React.createClass({
  getInitialState: function(){
    return {
      filterPlaylist: '',
      filterTrack: ''
    }
  },
  getTracks: function(filterPlaylist){

    var PLAYLISTS = [
      { "name": "Playlist1", "tracks": [
        { "name": "name1", "duration": null, "producer": null, genres: null },
        { "name": "name2", "duration": "ve2", "producer": null, genres: null },
        { "name": "name3", "duration": "ve3", "producer": null, genres: null }
      ] },
      { "name": "Playlist2", "tracks": [
        { "name": "name1", "duration": null, "producer": null, genres: null },
        { "name": "name4", "duration": "ve4", "producer": null, genres: null },
        { "name": "name5", "duration": "ve5", "producer": null, genres: null },
        { "name": "name2", "duration": "ve2", "producer": null, genres: null }
      ] }
    ];

    var tracks = [];
    PLAYLISTS.forEach(function(playlist){
      if (filterPlaylist == playlist.name){
        tracks = playlist.tracks;
        return;
      }
    }.bind(this));

    return tracks;
  },
  handleUserInput: function(filterPlaylist, filterTrack){

    var tracksArr = this.getTracks(filterPlaylist);

    this.setState({
      filterPlaylist: filterPlaylist,
      filterTrack: filterTrack,
      tracks: tracksArr
    });
  },
  componentDidMount: function() {

    var tracksArr = this.getTracks(this.state.filterPlaylist);
    this.setState({
      tracks: tracksArr
    });
  },
  render: function(){
    return (
      <div className="filterableTrackTable">
        <FilterForm 
          filterPlaylist={this.state.filterPlaylist}
          filterTrack={this.state.filterTrack}
          playlists={this.props.playlists}
          onUserInput={this.handleUserInput} />
        <TrackTable
          filterPlaylist={this.state.filterPlaylist}
          filterTrack={this.state.filterTrack}
          rowsInPage={this.props.rowsInPage}
          tracks={this.state.tracks} />
      </div>
    );
  }
});

var FilterForm = React.createClass({
  handleChange: function(){
    this.props.onUserInput(
      this.refs.filterPlaylist.getDOMNode().value,
      this.refs.filterTrack.getDOMNode().value
    );
  },
  render: function(){

    var options = [];
    options.push(<option value="">Choose Playlist</option>);

    this.props.playlists.forEach(function(playlist){
      options.push(<option value={playlist.name}>{playlist.name}</option>);
    }.bind(this));

    return (
      <form>
        <div className="form-group">
          <label className="control-label" for="filterPlaylist">Filter Playlist</label>
          <select
            className="form-control"
            type="text"
            value={this.props.filterPlaylist}
            id="filterPlaylist"
            ref="filterPlaylist"
            onChange={this.handleChange}>{options}</select>
        </div>
        <div className="form-group">
          <label className="control-label" for="filterTrack">Filter Tracks</label>
          <input
            className="form-control"
            type="text"
            placeholder="Filter track..."
            value={this.props.filterTrack}
            id="filterTrack"
            ref="filterTrack"
            onChange={this.handleChange} />
        </div>
      </form>
    );
  }
});

var TrackTable = React.createClass({
  getInitialState: function(){
    return {
      page: 1
    }
  },
  handleChangePage: function(page){
    this.setState({
      page: page
    });
  },
/**
 * Filter all rows
 */
  getFilteredRows: function(){
    var rows = [];

    if (this.props.tracks && this.props.tracks.length > 0) {
      this.props.tracks.forEach(function(track){
        if (track.name.indexOf(this.props.filterTrack) !== -1){
          rows.push(<TrackRow track={track} />);
        }
      }.bind(this));
    }

    return rows;
  },
  orderRows: function(rows){
    return rows;
  },
  filterByPage: function(rows){
    var rowsInPageInt = Number.parseInt(this.props.rowsInPage);
    var minRow = (this.state.page - 1) * rowsInPageInt;
    if (minRow < 0){
      minRow = 0;
    }
    if (rows.length <= minRow){
      this.state.page = 1;
      minRow = 0;
    }
    var start = minRow;
    var finish = (minRow + rowsInPageInt);
    if (finish > rows.length){
      finish = rows.length;
    }
    return rows.slice(start, finish);
  },
  render: function(){
    var filteredRows = this.getFilteredRows();
    var orderedRows = this.orderRows(filteredRows);
    var rows = this.filterByPage(filteredRows);
    var rowsCount = filteredRows.length;
    
    if (rows.length){
      rows.splice(0, 0, <PlayListRow name={this.props.filterPlaylist} />);
    }

    return (
      <div>
        <table className="table trackTable">
          <thead>
            <tr>
              <TrackOrder name="Playlist/Track's name" field="name" />
              <TrackOrder name="duration" field="duration" />
              <TrackOrder name="Producer" field="producer" />
              <TrackOrder name="Genres" field="genres" />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <NavigationWheel
          rowsInPage={this.props.rowsInPage}
          rowsCount={rowsCount}
          onChangePage={this.handleChangePage}
          page={this.state.page} />
      </div>
    );
  }
});

var NavigationWheel = React.createClass({
  getInitialProps: function(){
    return {
      rowsCount: 0,
      rowsInPage: 10,
      page: 1
    };
  },
  handlePage: function(e){
    e.preventDefault();
    var pageStr = e.target.getAttribute('data-page-number');
    var pageInt = Number.parseInt(pageStr);
    this.props.onChangePage(
      pageInt
    );
    return false;
  },
  render: function(){
    var navClass = this.props.rowsCount === 0 ? "sr-only" : "";
    var maxPage = Math.round(this.props.rowsCount/this.props.rowsInPage);
    if (maxPage === 0){
      maxPage = 1;
    }

    var className = "";
    var navItems = [];

    className = this.props.page == 1 ? "disabled" : "";
    var navPrev = (
      <li className={className}>
        <a href="#" aria-label="Previous" onClick={this.handlePage} data-page-number="1">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    );

    className = this.props.page == maxPage ? "disabled" : "";
    var navNext = (
      <li className={className}>
        <a href="#" aria-label="Next" onClick={this.handlePage} data-page-number={maxPage}>
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    );


/**
 * @TODO: Where put <li className="disabled"><a href="#">...</a></li>
 */
    var pageAriaName = null,
      navItem = null;
    for (var i = 1; i <= maxPage; i++){
      pageAriaName = "page" + i;
      if (i == this.props.page){
        navItem = (
          <li className="active">
            <a href="#" aria-label={pageAriaName} onClick={this.handlePage} data-page-number={i}>
              <span> {i} </span><span className="sr-only">(current)</span>
            </a>
          </li>
        );
      } else {
        navItem = (
          <li>
            <a href="#" aria-label={pageAriaName} onClick={this.handlePage} data-page-number={i}>{i}</a>
          </li>
        );
      }

      navItems.push(navItem);
    }
    return (
      <nav className={navClass}>
        <ul className="pagination">
          {navPrev}
          {navItems}
          {navNext}
        </ul>
      </nav>
    );
  }
});


var TrackOrder = React.createClass({
  render: function(){
    return (
      <th><span>{this.props.name} </span>
        <div className="columnOrderButtons">
          <button type="button" className="active btn btn-default btn-xs">asc<span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>
          <button type="button" className="btn btn-default btn-xs">desc<span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button>
        </div>
      </th>
    );
  }
});

var PLAYLISTS = [
  { "name": "Playlist1"},
  { "name": "Playlist2"}
];

React.render(
  <FilterableTrackTable
    playlists={PLAYLISTS}
    rowsInPage="1" />,
  document.getElementById('content')
);
