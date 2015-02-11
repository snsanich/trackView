"user strict";

/**
 * React and FilterableTable available
 */
var TestUtils = null;
var filterableTrackTable = null;

describe("selected playlist", function() {

  it("open mock ajax", function() {
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest("app_dev.php/testPlaylist").andReturn({
      responseText: '{"playlists":[{"id":1,"name":"Playlist1"},{"id":2,"name":"Playlist2"}]}',
      status: 200,
      contentType: 'application/json'
    });
    jasmine.Ajax.stubRequest("app_dev.php/testTrackByPlaylist").andReturn({
      responseText: '{"tracks":[]}',
      status: 200,
      contentType: 'application/json'
    });
    jasmine.Ajax.stubRequest("app_dev.php/testTrackByPlaylist/1").andReturn({
      responseText: '{"tracks":[{"id":"1", "name":"name1","duration":null,"producer":null,"genres":null},{"id":"2", "name":"name2","duration":"ve2","producer":null,"genres":null},{"id":"3", "name":"name3","duration":"ve3","producer":null,"genres":null}]}',
      status: 200,
      contentType: 'application/json'
    });
    jasmine.Ajax.stubRequest("app_dev.php/testTrackByPlaylist/2").andReturn({
      responseText: '{"tracks":[{"id":"4", "name":"name1","duration":null,"producer":null,"genres":null},{"id":"5", "name":"name4","duration":"ve4","producer":null,"genres":null},{"id":"6", "name":"name5","duration":"ve5","producer":null,"genres":null},{"id":"7", "name":"name2","duration":"ve2","producer":null,"genres":null}]}',
      status: 200,
      contentType: 'application/json'
    });

    TestUtils = React.addons.TestUtils;
    filterableTrackTable = TestUtils.renderIntoDocument(
      React.createElement(FilterableTrackTable, {
        playlistUrl: "app_dev.php/testPlaylist", 
        trackByPlaylistUrl: "app_dev.php/testTrackByPlaylist"})
    );

    expect(true).toBe(true);
  });

  it("is table empty after initialization", function() {
    var classNameToBeHide = 'sr-only';
    var playlist = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'select');
    playlist.getDOMNode().value = '';
    TestUtils.Simulate.change(playlist);

    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'tbody');
    var rowCount = tbody.getDOMNode().children.length;
    expect(rowCount).toBe(0);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    expect(nav.props.className).toEqual(classNameToBeHide);
  });

  it("has list 'playlist' got options", function() {
    var playlist = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'select');
    expect(playlist.getDOMNode().options.length).toBeGreaterThan(1);
  });

  it("does decreasing from 4 to 1 work correctly", function() {
    var playlist = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'select');
    playlist.getDOMNode().value = '2';
    TestUtils.Simulate.change(playlist);

    var inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'input');
    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');

    var rowsOnPageIndex = 1,
      prev = 1,
      next = 1;
    var rowsOnPage = inputs[rowsOnPageIndex];

    rowsOnPage.getDOMNode().value = 4;
    TestUtils.Simulate.change(rowsOnPage);
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(nav, 'a');
    expect(hrefArr.length).toBe(prev + 1 + next);

    rowsOnPage.getDOMNode().value = 3;
    TestUtils.Simulate.change(rowsOnPage);
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(nav, 'a');
    expect(hrefArr.length).toBe(prev + 2 + next);

    rowsOnPage.getDOMNode().value = 2;
    TestUtils.Simulate.change(rowsOnPage);
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(nav, 'a');
    expect(hrefArr.length).toBe(prev + 2 + next);

    rowsOnPage.getDOMNode().value = 1;
    TestUtils.Simulate.change(rowsOnPage);
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(nav, 'a');
    expect(hrefArr.length).toBe(prev + 4 + next);
  });

  it("does 'filter playlist' work with existing options", function() {
    var classNameToBeHide = 'sr-only',
      rowsInPlaylistTable = 2,
      hrefPrevNextAnd4Elem = 6;

    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'tbody');
    var rowCount = tbody.getDOMNode().children.length;
    expect(rowCount).toEqual(rowsInPlaylistTable);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    expect(nav.props.className).not.toEqual(classNameToBeHide);

    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(
      nav, 'a');
    expect(hrefArr.length).toEqual(hrefPrevNextAnd4Elem);

    var trackOrder = TestUtils.findRenderedComponentWithType(
      filterableTrackTable, TrackOrder);
    var activeOrderButtons = TestUtils.scryRenderedDOMComponentsWithClass(
      trackOrder, 'active');
    expect(activeOrderButtons.length).toBe(1);
  });

  it("does sorting and pagination work", function() {
    var orderButtons = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'button');

    var descNameButtonIndex = 1;
    var descNameButton = orderButtons[descNameButtonIndex];
    TestUtils.Simulate.click(descNameButton);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(
      nav, 'a');

    var page3Index = 3;
    var page3 = hrefArr[page3Index];
    TestUtils.Simulate.click(page3);

    var row = TestUtils.findRenderedComponentWithType(
      filterableTrackTable, TrackRow);
    expect(row.props.track.name).toBe('name4');
  });

  it("does 'filter track' work with existing track", function() {
    var countRowsAfterFilter = 2,
      hrefPrevNextAnd1Elem = 3;

    var inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'input');

    var filterTrackIndex = 0;
    var filterTrack = inputs[filterTrackIndex]; 
    filterTrack.getDOMNode().value = 'name2';
    TestUtils.Simulate.change(filterTrack);

    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'tbody');
    var rowCount = tbody.getDOMNode().children.length;
    expect(rowCount).toEqual(countRowsAfterFilter);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(
      nav, 'a');
    expect(hrefArr.length).toEqual(hrefPrevNextAnd1Elem);
  });

  it("does 'filter track' work with not existing track", function() {
    var classNameToBeHide = 'sr-only', countRowsAfterFilter = 0;

    var inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'input');

    var filterTrackIndex = 0;
    var filterTrack = inputs[filterTrackIndex]; 
    filterTrack.getDOMNode().value = 'name0';
    TestUtils.Simulate.change(filterTrack);

    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'tbody');
    var rowCount = tbody.getDOMNode().children.length;
    expect(rowCount).toEqual(countRowsAfterFilter);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    expect(nav.props.className).toEqual(classNameToBeHide);
  });

  it("does 'cleanup filter track' work", function() {
    var classNameToBeHide = 'sr-only',
      countRowsAfterFilter = 2,
      hrefPrevNextAnd4Elem = 6;

    var inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'input');

    var filterTrackIndex = 0;
    var filterTrack = inputs[filterTrackIndex]; 
    filterTrack.getDOMNode().value = '';
    TestUtils.Simulate.change(filterTrack);

    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'tbody');
    var rowCount = tbody.getDOMNode().children.length;
    expect(rowCount).toEqual(countRowsAfterFilter);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    expect(nav.props.className).not.toEqual(classNameToBeHide);

    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(
      nav, 'a');
    expect(hrefArr.length).toEqual(hrefPrevNextAnd4Elem);
  });

  it("close mock ajax", function() {
    jasmine.Ajax.uninstall();
    expect(true).toBe(true);
  });
}); 
