var PlaylistRow = React.createClass({
  render: function(){
    return (
      <tr><th colSpan="4">{this.props.name}</th></tr>
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
      return;
    }
    e.preventDefault();
    this.props.onChangeOrder(
      orderPattern
    );
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
          key={orderPattern}
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
          key={orderPattern}
          type="button"
          className={buttonClassName}
          data-order-pattern={orderPattern}
          onClick={this.handleOrder}>desc<span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
        </button>
      );

      columns.push(
        <th key={fieldname}>
          <div className="columnOrderButtons">
            <span>{field.descr} </span>
            {buttons}
          </div>
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
      <li key="prev" className={className}>
        <a href="#" aria-label="Previous" onClick={this.handlePage} data-page-number="1">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    );

    className = this.props.page == maxPage ? "disabled" : "";
    var navNext = (
      <li key="next" className={className}>
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
          <li key={i} className="active">
            <a href="#" aria-label={pageAriaName} onClick={this.handlePage} data-page-number={i}>
              <span> {i} </span><span className="sr-only">(current)</span>
            </a>
          </li>
        );
      } else {
        navItem = (
          <li key={i}>
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
    options.push(<option key={0} value="">Choose Playlist</option>);

    this.props.playlists.forEach(function(playlist){
      options.push(<option key={playlist.id} value={playlist.id}>{playlist.name}</option>);
    }.bind(this));

    return (
      <form>
        <div className="form-group">
          <label className="control-label" htmlFor="filterPlaylist">Filter Playlist</label>
          <select
            className="form-control"
            type="text"
            value={this.props.playlistId}
            id="filterPlaylist"
            ref="filterPlaylist"
            onChange={this.handleChange}>{options}</select>
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="filterTrack">Filter Tracks</label>
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
          <label className="control-label" htmlFor="rowsOnPage">Rows On Page</label>
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
          rows.push(<TrackRow key={track.id} track={track} />);
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
        return orderDest;
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
      rows.splice(0, 0, <PlaylistRow key={this.props.playlist.id} name={this.props.playlist.name} />);
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
      playlist: { id: 0, name: '' },
      filterTrack: '',
      rowsOnPage: 10,
      playlists: [],
      tracks: []
    }
  },
  getInitialProps: function(){
    return {
      playlistUrl: '',
      trackByPlaylistUrl: ''
    };
  },
  componentDidMount: function(){

    $.ajax({
      url: this.props.playlistUrl,
      dataType: 'json',
      success: function(data) {
        this.getTracks(this.state.playlist.id, {playlists: data.playlists});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.playlistUrl, status, err.toString());
      }.bind(this)
    }); 
  },
  getTracks: function(playlistId, nextState){

    var url = this.props.trackByPlaylistUrl;
    if (playlistId != "0"){
      url = url + '/' + playlistId;
    }

    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        nextState['tracks'] = data.tracks;
        this.setState(nextState);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    }); 
  },
  minRowsOnPage: 1,
  maxRowsOnPage: 300,
  handleUserInput: function(playlistId, filterTrack, rowsOnPage){

    var rowsOnPageInt = Number.parseInt(rowsOnPage);
    if (isNaN(rowsOnPageInt) || rowsOnPageInt < this.minRowsOnPage){
      rowsOnPageInt = this.minRowsOnPage;
    }
    if (rowsOnPageInt > this.maxRowsOnPage){
      rowsOnPageInt = this.maxRowsOnPage;
    }

    var selectedPlaylist = { id: 0, name: '' };
    this.state.playlists.forEach(function(playlist){
      if (playlist.id == playlistId){
        selectedPlaylist = playlist;
      }
    });

    var nextState = {
      playlist: selectedPlaylist,
      filterTrack: filterTrack,
      rowsOnPage: rowsOnPageInt
    };

    this.getTracks(selectedPlaylist.id, nextState);
  },
  render: function(){
    return (
      <div className="filterableTrackTable">
        <FilterForm 
          playlistId={this.state.playlist.id}
          filterTrack={this.state.filterTrack}
          rowsOnPage={this.state.rowsOnPage}
          minRowsOnPage={this.minRowsOnPage}
          maxRowsOnPage={this.maxRowsOnPage}
          playlists={this.state.playlists}
          onUserInput={this.handleUserInput} />
        <TrackTable
          playlist={this.state.playlist}
          filterTrack={this.state.filterTrack}
          rowsOnPage={this.state.rowsOnPage}
          tracks={this.state.tracks} />
      </div>
    );
  }
});

React.render(
  <FilterableTrackTable
      playlistUrl="app_dev.php/playlist"
      trackByPlaylistUrl="app_dev.php/trackByPlaylist" />,
  document.getElementById('content')
);