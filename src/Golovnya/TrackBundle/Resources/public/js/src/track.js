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

var TrackOrder = React.createClass({
  getInitialProps: function(){
    return {
      fields: {},
      orderPattern: ""
    };
  },
  handleOrder: function(e){
    var orderPattern = e.currentTarget.getAttribute('data-order-pattern');
    if (!orderPattern || orderPattern === null){
      return true;
    }
    e.preventDefault();
    this.props.onChangeOrder(
      orderPattern
    );
    return false;
  },
  render: function(){
    var columns = [];
    this.props.fields.forEach(function(field){

      var buttons = [];

      var buttonClassName = "btn btn-default btn-xs";
      var fieldname = field.name;
      var orderPattern = fieldname + ':ASC';
      if (this.props.orderPattern === orderPattern){
        buttonClassName = "active " + buttonClassName;
      }
      buttons.push(
        <button
          type="button"
          className={buttonClassName}
          data-order-pattern={orderPattern}
          onClick={this.handleOrder}>asc<span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>
      );

      buttonClassName = "btn btn-default btn-xs";
      orderPattern = fieldname + ':DESC';
      if (this.props.orderPattern === orderPattern){
        buttonClassName = "active " + buttonClassName;
      }
      buttons.push(
        <button
          type="button"
          className={buttonClassName}
          data-order-pattern={orderPattern}
          onClick={this.handleOrder}>desc<span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
        </button>
      );

      columns.push(
        <th><span>{field.descr} </span>
          <div className="columnOrderButtons">{buttons}</div>
        </th>
      );
    }.bind(this));

    return (
      <tr>{columns}</tr>
    );
  }
});

var NavigationWheel = React.createClass({
  getInitialProps: function(){
    return {
      rowsCount: 0,
      rowsOnPage: 10,
      page: 1
    };
  },
  handlePage: function(e){
    e.preventDefault();
    var pageStr = e.currentTarget.getAttribute('data-page-number');
    var pageInt = Number.parseInt(pageStr);
    this.props.onChangePage(
      pageInt
    );
    return false;
  },
  render: function(){
    var navClass = this.props.rowsCount === 0 ? "sr-only" : "";
    var maxPage = Math.ceil(this.props.rowsCount/this.props.rowsOnPage);
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

var FilterForm = React.createClass({
  handleChange: function(){
    this.props.onUserInput(
      this.refs.filterPlaylist.getDOMNode().value,
      this.refs.filterTrack.getDOMNode().value,
      this.refs.rowsOnPage.getDOMNode().value
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
        <div className="form-group">
          <label className="control-label" for="rowsOnPage">Rows On Page</label>
          <input
            className="form-control"
            type="number"
            min={this.props.minRowsOnPage}
            max={this.props.maxRowsOnPage}
            placeholder="Enter rows' count..."
            value={this.props.rowsOnPage}
            id="rowsOnPage"
            ref="rowsOnPage"
            onChange={this.handleChange} />
        </div>
      </form>
    );
  }
});

var TrackTable = React.createClass({
  getInitialState: function(){
    return {
      page: 1,
      orderPattern: 'name:ASC'
    }
  },
  handleChangeOrder: function(orderPattern){
    this.setState({
      orderPattern: orderPattern
    });
  },
  handleChangePage: function(page){
    this.setState({
      page: page
    });
  },
  fields: [
    { descr:"Playlist/Track's name", name:"name" },
    { descr:"duration", name:"duration" },
    { descr:"Producer", name:"producer" },
    { descr:"Genres", name:"genres" }
  ],
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
    var orderParts = this.state.orderPattern.split(':');
    var orderName = orderParts[0];
    var orderDest = orderParts[1] === 'ASC' ? 1 : -1;
    rows.sort(function(a, b){
      if (a.props.track[orderName] < b.props.track[orderName]){
        return -1 * orderDest;
      }
      if (a.props.track[orderName] > b.props.track[orderName]){
        return 1 * orderDest;
      }
      return 0;
    });
    return rows;
  },
  filterByPage: function(rows){
    var rowsOnPageInt = Number.parseInt(this.props.rowsOnPage);
    var minRow = (this.state.page - 1) * rowsOnPageInt;
    if (minRow < 0){
      minRow = 0;
    }
    if (rows.length <= minRow){
      this.state.page = 1;
      minRow = 0;
    }
    var start = minRow;
    var finish = (minRow + rowsOnPageInt);
    if (finish > rows.length){
      finish = rows.length;
    }
    return rows.slice(start, finish);
  },
  render: function(){
    var filteredRows = this.getFilteredRows();
    var orderedRows = this.orderRows(filteredRows);
    var rows = this.filterByPage(orderedRows);
    var rowsCount = filteredRows.length;
    
    if (rows.length){
      rows.splice(0, 0, <PlayListRow name={this.props.filterPlaylist} />);
    }

    return (
      <div>
        <table className="table trackTable">
          <thead>
            <TrackOrder
              fields={this.fields}
              orderPattern={this.state.orderPattern}
              onChangeOrder={this.handleChangeOrder} />
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <NavigationWheel
          rowsOnPage={this.props.rowsOnPage}
          rowsCount={rowsCount}
          onChangePage={this.handleChangePage}
          page={this.state.page} />
      </div>
    );
  }
});

var FilterableTrackTable = React.createClass({
  getInitialState: function(){
    return {
      filterPlaylist: '',
      filterTrack: '',
      rowsOnPage: 10
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
  minRowsOnPage: 1,
  maxRowsOnPage: 300,
  handleUserInput: function(filterPlaylist, filterTrack, rowsOnPage){

    var tracksArr = this.getTracks(filterPlaylist);

    var rowsOnPageInt = Number.parseInt(rowsOnPage);
    if (isNaN(rowsOnPageInt) || rowsOnPageInt < this.minRowsOnPage){
      rowsOnPageInt = this.minRowsOnPage;
    }
    if (rowsOnPageInt > this.maxRowsOnPage){
      rowsOnPageInt = this.maxRowsOnPage;
    }

    this.setState({
      filterPlaylist: filterPlaylist,
      filterTrack: filterTrack,
      rowsOnPage: rowsOnPageInt,
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
          rowsOnPage={this.state.rowsOnPage}
          minRowsOnPage={this.minRowsOnPage}
          maxRowsOnPage={this.maxRowsOnPage}
          onUserInput={this.handleUserInput} />
        <TrackTable
          filterPlaylist={this.state.filterPlaylist}
          filterTrack={this.state.filterTrack}
          rowsOnPage={this.state.rowsOnPage}
          tracks={this.state.tracks} />
      </div>
    );
  }
});


var PLAYLISTS = [
  { "name": "Playlist1"},
  { "name": "Playlist2"}
];

React.render(
  <FilterableTrackTable
    playlists={PLAYLISTS} />,
  document.getElementById('content')
);
