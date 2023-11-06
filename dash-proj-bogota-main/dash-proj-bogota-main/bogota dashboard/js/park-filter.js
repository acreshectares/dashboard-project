function shouldShowPark(park, filterTypes) {
  return filterTypes.some(type => park.properties.VOCACION === type);
}

// This function filters parks based on the search query and filter types
function filterParks(parks, searchQuery, filterTypes) {
  return parks.filter(park =>
    park.properties.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterTypes.length === 0 || shouldShowPark(park, filterTypes))
  );
}

// Dispatches a custom event with the filtered parks
function dispatchParkFilterEvent(events, filteredParks) {
  const newEvent = new CustomEvent('filter-parks', { detail: { filteredParks } });
  events.dispatchEvent(newEvent);
}

// Handles input in the search box
function handleSearchBoxInput(evt, parks, events) {
    const searchBoxValue = evt.target.value;
    const filterTypes = getFilterTypes();
    const filteredParks = filterParks(parks, searchBoxValue, filterTypes);
    dispatchParkFilterEvent(events, filteredParks);
}

// Gets the currently selected filter types
function getFilterTypes() {
  return Array.from(document.querySelectorAll('[name="filter-type"]'))
             .filter(checkbox => checkbox.checked)
             .map(checkbox => checkbox.value);
}

// Updates the displayed parks based on the current filters
function updateShownParks(parks, searchBoxValue, events) {
  const filterTypes = getFilterTypes();
  const filteredParks = filterParks(parks, searchBoxValue, filterTypes);
  dispatchParkFilterEvent(events, filteredParks);
}

// Sets up event listeners for search and filter changes
function setupFilterEvents(parks, events) {
  const searchBox = document.querySelector('#park-filter-name');
  searchBox.addEventListener('input', (evt) => handleSearchBoxInput(evt, parks, events));

  const filterInputs = document.querySelectorAll('#park-filters input');
  filterInputs.forEach(filter => {
    filter.addEventListener('change', () => updateShownParks(parks, searchBox.value, events));
  });

  events.addEventListener('addresschanged', (evt) => {
    // Handle address changed events here
    updateShownParks(parks, searchBox.value, events);
  });
}

// Export the necessary functions
export {
  setupFilterEvents,
};