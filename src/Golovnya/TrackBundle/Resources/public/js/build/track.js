var PlaylistRow = React.createClass({displayName: "PlaylistRow",
  render: function(){
    return (
      React.createElement("tr", null, React.createElement("th", {colSpan: "4"}, this.props.name))
    );
  }
});

var TrackRow = React.createClass({displayName: "TrackRow",
  render: function(){
    return (
      React.createElement("tr", null, 
        React.createElement("td", null, this.props.track.name), 
        React.createElement("td", null, this.props.track.duration), 
        React.createElement("td", null, this.props.track.producer), 
        React.createElement("td", null, this.props.track.genres)
      )
    );
  }
});

var TrackOrder = React.createClass({displayName: "TrackOrder",
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
    return;
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
        React.createElement("button", {
          key: orderPattern, 
          type: "button", 
          className: buttonClassName, 
          "data-order-pattern": orderPattern, 
          onClick: this.handleOrder}, "asc", React.createElement("span", {className: "glyphicon glyphicon-chevron-up", "aria-hidden": "true"}))
      );

      buttonClassName = "btn btn-default btn-xs";
      orderPattern = fieldname + ':DESC';
      if (this.props.orderPattern === orderPattern){
        buttonClassName = "active " + buttonClassName;
      }
      buttons.push(
        React.createElement("button", {
          key: orderPattern, 
          type: "button", 
          className: buttonClassName, 
          "data-order-pattern": orderPattern, 
          onClick: this.handleOrder}, "desc", React.createElement("span", {className: "glyphicon glyphicon-chevron-down", "aria-hidden": "true"})
        )
      );

      columns.push(
        React.createElement("th", {key: fieldname}, 
          React.createElement("div", {className: "columnOrderButtons"}, 
            React.createElement("span", null, field.descr, " "), 
            buttons
          )
        )
      );
    }.bind(this));

    return (
      React.createElement("tr", null, columns)
    );
  }
});

var NavigationWheel = React.createClass({displayName: "NavigationWheel",
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
      React.createElement("li", {key: "prev", className: className}, 
        React.createElement("a", {href: "#", "aria-label": "Previous", onClick: this.handlePage, "data-page-number": "1"}, 
          React.createElement("span", {"aria-hidden": "true"}, "«")
        )
      )
    );

    className = this.props.page == maxPage ? "disabled" : "";
    var navNext = (
      React.createElement("li", {key: "next", className: className}, 
        React.createElement("a", {href: "#", "aria-label": "Next", onClick: this.handlePage, "data-page-number": maxPage}, 
          React.createElement("span", {"aria-hidden": "true"}, "»")
        )
      )
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
          React.createElement("li", {key: i, className: "active"}, 
            React.createElement("a", {href: "#", "aria-label": pageAriaName, onClick: this.handlePage, "data-page-number": i}, 
              React.createElement("span", null, " ", i, " "), React.createElement("span", {className: "sr-only"}, "(current)")
            )
          )
        );
      } else {
        navItem = (
          React.createElement("li", {key: i}, 
            React.createElement("a", {href: "#", "aria-label": pageAriaName, onClick: this.handlePage, "data-page-number": i}, i)
          )
        );
      }

      navItems.push(navItem);
    }
    return (
      React.createElement("nav", {className: navClass}, 
        React.createElement("ul", {className: "pagination"}, 
          navPrev, 
          navItems, 
          navNext
        )
      )
    );
  }
});

var FilterForm = React.createClass({displayName: "FilterForm",
  handleChange: function(){
    this.props.onUserInput(
      this.refs.filterPlaylist.getDOMNode().value,
      this.refs.filterTrack.getDOMNode().value,
      this.refs.rowsOnPage.getDOMNode().value
    );
  },
  render: function(){

    var options = [];
    options.push(React.createElement("option", {key: 0, value: ""}, "Choose Playlist"));

    this.props.playlists.forEach(function(playlist){
      options.push(React.createElement("option", {key: playlist.id, value: playlist.id}, playlist.name));
    }.bind(this));

    return (
      React.createElement("form", null, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {className: "control-label", htmlFor: "filterPlaylist"}, "Filter Playlist"), 
          React.createElement("select", {
            className: "form-control", 
            type: "text", 
            value: this.props.playlistId, 
            id: "filterPlaylist", 
            ref: "filterPlaylist", 
            onChange: this.handleChange}, options)
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {className: "control-label", htmlFor: "filterTrack"}, "Filter Tracks"), 
          React.createElement("input", {
            className: "form-control", 
            type: "text", 
            placeholder: "Filter track...", 
            value: this.props.filterTrack, 
            id: "filterTrack", 
            ref: "filterTrack", 
            onChange: this.handleChange})
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {className: "control-label", htmlFor: "rowsOnPage"}, "Rows On Page"), 
          React.createElement("input", {
            className: "form-control", 
            type: "number", 
            min: this.props.minRowsOnPage, 
            max: this.props.maxRowsOnPage, 
            placeholder: "Enter rows' count...", 
            value: this.props.rowsOnPage, 
            id: "rowsOnPage", 
            ref: "rowsOnPage", 
            onChange: this.handleChange})
        )
      )
    );
  }
});

var TrackTable = React.createClass({displayName: "TrackTable",
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
          rows.push(React.createElement(TrackRow, {key: track.id, track: track}));
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
      rows.splice(0, 0, React.createElement(PlaylistRow, {key: this.props.playlist.id, name: this.props.playlist.name}));
    }

    return (
      React.createElement("div", null, 
        React.createElement("table", {className: "table trackTable"}, 
          React.createElement("thead", null, 
            React.createElement(TrackOrder, {
              fields: this.fields, 
              orderPattern: this.state.orderPattern, 
              onChangeOrder: this.handleChangeOrder})
          ), 
          React.createElement("tbody", null, rows)
        ), 
        React.createElement(NavigationWheel, {
          rowsOnPage: this.props.rowsOnPage, 
          rowsCount: rowsCount, 
          onChangePage: this.handleChangePage, 
          page: this.state.page})
      )
    );
  }
});

var FilterableTrackTable = React.createClass({displayName: "FilterableTrackTable",
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
      success: function(data, textStatus, jqXHR) {
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
      success: function(data, textStatus, jqXHR) {
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
      React.createElement("div", {className: "filterableTrackTable"}, 
        React.createElement(FilterForm, {
          playlistId: this.state.playlist.id, 
          filterTrack: this.state.filterTrack, 
          rowsOnPage: this.state.rowsOnPage, 
          minRowsOnPage: this.minRowsOnPage, 
          maxRowsOnPage: this.maxRowsOnPage, 
          playlists: this.state.playlists, 
          onUserInput: this.handleUserInput}), 
        React.createElement(TrackTable, {
          playlist: this.state.playlist, 
          filterTrack: this.state.filterTrack, 
          rowsOnPage: this.state.rowsOnPage, 
          tracks: this.state.tracks})
      )
    );
  }
});

React.render(
  React.createElement(FilterableTrackTable, {
      playlistUrl: "app_dev.php/playlist", 
      trackByPlaylistUrl: "app_dev.php/trackByPlaylist"}),
  document.getElementById('content')
);
