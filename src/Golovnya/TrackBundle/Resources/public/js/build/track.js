var PlayListRow = React.createClass({displayName: "PlayListRow",
  render: function(){
    return (
      React.createElement("tr", null, React.createElement("th", {colspan: "4"}, this.props.name))
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

var FilterableTrackTable = React.createClass({displayName: "FilterableTrackTable",
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
      React.createElement("div", {className: "filterableTrackTable"}, 
        React.createElement(FilterForm, {
          filterPlaylist: this.state.filterPlaylist, 
          filterTrack: this.state.filterTrack, 
          playlists: this.props.playlists, 
          onUserInput: this.handleUserInput}), 
        React.createElement(TrackTable, {
          filterPlaylist: this.state.filterPlaylist, 
          filterTrack: this.state.filterTrack, 
          rowsInPage: this.props.rowsInPage, 
          tracks: this.state.tracks})
      )
    );
  }
});

var FilterForm = React.createClass({displayName: "FilterForm",
  handleChange: function(){
    this.props.onUserInput(
      this.refs.filterPlaylist.getDOMNode().value,
      this.refs.filterTrack.getDOMNode().value
    );
  },
  render: function(){

    var options = [];
    options.push(React.createElement("option", {value: ""}, "Choose Playlist"));

    this.props.playlists.forEach(function(playlist){
      options.push(React.createElement("option", {value: playlist.name}, playlist.name));
    }.bind(this));

    return (
      React.createElement("form", null, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {className: "control-label", for: "filterPlaylist"}, "Filter Playlist"), 
          React.createElement("select", {
            className: "form-control", 
            type: "text", 
            value: this.props.filterPlaylist, 
            id: "filterPlaylist", 
            ref: "filterPlaylist", 
            onChange: this.handleChange}, options)
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {className: "control-label", for: "filterTrack"}, "Filter Tracks"), 
          React.createElement("input", {
            className: "form-control", 
            type: "text", 
            placeholder: "Filter track...", 
            value: this.props.filterTrack, 
            id: "filterTrack", 
            ref: "filterTrack", 
            onChange: this.handleChange})
        )
      )
    );
  }
});

var TrackTable = React.createClass({displayName: "TrackTable",
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
          rows.push(React.createElement(TrackRow, {track: track}));
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
      rows.splice(0, 0, React.createElement(PlayListRow, {name: this.props.filterPlaylist}));
    }

    return (
      React.createElement("div", null, 
        React.createElement("table", {className: "table trackTable"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement(TrackOrder, {name: "Playlist/Track's name", field: "name"}), 
              React.createElement(TrackOrder, {name: "duration", field: "duration"}), 
              React.createElement(TrackOrder, {name: "Producer", field: "producer"}), 
              React.createElement(TrackOrder, {name: "Genres", field: "genres"})
            )
          ), 
          React.createElement("tbody", null, rows)
        ), 
        React.createElement(NavigationWheel, {
          rowsInPage: this.props.rowsInPage, 
          rowsCount: rowsCount, 
          onChangePage: this.handleChangePage, 
          page: this.state.page})
      )
    );
  }
});

var NavigationWheel = React.createClass({displayName: "NavigationWheel",
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
      React.createElement("li", {className: className}, 
        React.createElement("a", {href: "#", "aria-label": "Previous", onClick: this.handlePage, "data-page-number": "1"}, 
          React.createElement("span", {"aria-hidden": "true"}, "«")
        )
      )
    );

    className = this.props.page == maxPage ? "disabled" : "";
    var navNext = (
      React.createElement("li", {className: className}, 
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
          React.createElement("li", {className: "active"}, 
            React.createElement("a", {href: "#", "aria-label": pageAriaName, onClick: this.handlePage, "data-page-number": i}, 
              React.createElement("span", null, " ", i, " "), React.createElement("span", {className: "sr-only"}, "(current)")
            )
          )
        );
      } else {
        navItem = (
          React.createElement("li", null, 
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


var TrackOrder = React.createClass({displayName: "TrackOrder",
  render: function(){
    return (
      React.createElement("th", null, React.createElement("span", null, this.props.name, " "), 
        React.createElement("div", {className: "columnOrderButtons"}, 
          React.createElement("button", {type: "button", className: "active btn btn-default btn-xs"}, "asc", React.createElement("span", {className: "glyphicon glyphicon-chevron-up", "aria-hidden": "true"})), 
          React.createElement("button", {type: "button", className: "btn btn-default btn-xs"}, "desc", React.createElement("span", {className: "glyphicon glyphicon-chevron-down", "aria-hidden": "true"}))
        )
      )
    );
  }
});

var PLAYLISTS = [
  { "name": "Playlist1"},
  { "name": "Playlist2"}
];

React.render(
  React.createElement(FilterableTrackTable, {
    playlists: PLAYLISTS, 
    rowsInPage: "1"}),
  document.getElementById('content')
);
