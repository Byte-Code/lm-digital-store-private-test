import { fromJS, List } from 'immutable';
import * as actionTypes from '../../actions/actionTypes';

function toggleFilter(state, newFilter) {
  const filters = state.get('filters');
  if (filters.includes(newFilter)) {
    return filters.filterNot(f => f === newFilter);
  }
  return filters.push(newFilter);
}

function toggleAid(state, newAid) {
  return state.get('aid') === newAid ? '' : newAid;
}

function resetFilters(state) {
  return state.set('availability', false).set('filters', List()).set('aid', '');
}

const initialFilters = fromJS({
  availability: false,
  filters: [],
  aid: '',
  categoryCode: ''
});

const initialState = fromJS({
  active: initialFilters,
  temp: initialFilters
});

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_AID:
      return state.setIn(['active', 'aid'], toggleAid(state.get('active'), action.newAid));
    case actionTypes.TOGGLE_FILTER:
      return state.setIn(
        ['active', 'filters'],
        toggleFilter(state.get('active'), action.newFilter)
      );
    case actionTypes.TOGGLE_AVAILABILITY:
      return state.setIn(['active', 'availability'], !state.getIn(['active', 'availability']));
    case actionTypes.TOGGLE_TEMP_FILTER:
      return state.setIn(['temp', 'filters'], toggleFilter(state.get('temp'), action.newFilter));
    case actionTypes.TOGGLE_TEMP_AVAILABILITY:
      return state.setIn(['temp', 'availability'], !state.getIn(['temp', 'availability']));
    case actionTypes.APPLY_TEMP_FILTERS:
      return state.set('active', state.get('temp'));
    case actionTypes.INIT_FILTERS:
      return initialState;
    case actionTypes.INIT_TEMP_FILTERS:
      return state.set('temp', state.get('active'));
    case actionTypes.RESET_FILTERS:
      return resetFilters(state.get('active'));
    case actionTypes.RESET_TEMP_FILTERS:
      return resetFilters(state.get('temp'));
    case actionTypes.SUCCESS_FETCH_CATEGORY:
      return state.setIn(['active', 'categoryCode'], action.categoryCode);
    default:
      return state;
  }
}
