"user strict";

/**
 * React and FilterableTable available
 */
var TestUtils = null;

describe("selected playlist", function() {

  TestUtils = React.addons.TestUtils;

  var PLAYLISTS = [
    { "name": "Playlist1"},
    { "name": "Playlist2"}
  ];

  var filterableTrackTable = TestUtils.renderIntoDocument(
    React.createElement(FilterableTrackTable, {
      playlists: PLAYLISTS, 
      rowsInPage: "1"})
  );

  it("table empty after initialization", function() {
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

  it("list 'playlist' has options", function() {
    var playlist = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'select');
    expect(playlist.getDOMNode().options.length).toBeGreaterThan(1);
  });

  it("select second option - then table is not empty", function() {
    var classNameToBeHide = 'sr-only',
      rowsInPlaylistTable = 2,
      opacityElemHidden = '',
      hrefPrevNextAnd4Elem = 6;

    var playlist = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'select');
    playlist.getDOMNode().value = 'Playlist2';
    TestUtils.Simulate.change(playlist);

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

  it("filter existing track", function() {
    var orderButtons = TestUtils.scryRenderedDOMComponentsWithTag(
      filterableTrackTable, 'button');

    var descNameButtonNumber = 1;
    var descNameButton = orderButtons[descNameButtonNumber];
    TestUtils.Simulate.click(descNameButton);

    var nav = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'nav');
    var hrefArr = TestUtils.scryRenderedDOMComponentsWithTag(
      nav, 'a');

    var page3Number = 3;
    var page3 = hrefArr[page3Number];
    TestUtils.Simulate.click(page3);

    var row = TestUtils.findRenderedComponentWithType(
      filterableTrackTable, TrackRow);
    expect(row.props.track.name).toBe('name4');
  });

  it("filter existing track", function() {
    var classNameToBeHide = 'sr-only',
      countRowsAfterFilter = 2,
      hrefPrevNextAnd1Elem = 3;

    var filterTrack = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'input');
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

  it("filter not existing track", function() {
    var classNameToBeHide = 'sr-only', countRowsAfterFilter = 0;

    var filterTrack = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'input');
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

  it("cleanup filter", function() {
    var classNameToBeHide = 'sr-only',
      countRowsAfterFilter = 2,
      hrefPrevNextAnd4Elem = 6;

    var filterTrack = TestUtils.findRenderedDOMComponentWithTag(
      filterableTrackTable, 'input');
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
}); 
