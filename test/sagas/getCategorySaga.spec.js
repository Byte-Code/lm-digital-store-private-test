import { call, put } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import { apiV1 } from '../../mocks/apiMock';
import { callFetchCategory } from '../../app/sagas/getCategorySaga';
import { successFetchCategory, failureFetchCategory } from '../../app/actions/categoryActions';
import { requestFetchProducts } from '../../app/actions/catalogueActions';

const validResponse = {
  content: {
    orderedProducts: [
      { code: '0' },
      { code: '1' },
      { code: '2' }
    ]
  },
  status: 'OK'
};
const invalidResponse = {
  content: {
    description: 'The category does not exists or is not visible',
    code: 'not.found'
  },
  status: 'KO'
};
const genericError = new Error('Generic Error');
const notFoundError = new Error('Not Found Error');

describe('getCategorySaga', () => {
  describe('Scenario1: input is fine, doesn\'t throw', () => {
    const input = { categoryCode: 'CAT4231' };
    const gen = callFetchCategory(input);

    // HACK(ish) need to serialize otherwise test doesn't pass, bound functions
    it('should call the api first', () => {
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(call(apiV1.getCategoryDisplay.bind(apiV1), input.categoryCode))
      );
    });

    it('should dispatch a SUCCESS_FETCH_CATEGORY action with the transformed result', () => {
      const transformedResult = fromJS(validResponse).get('content');
      expect(gen.next(validResponse).value)
      .toEqual(put(successFetchCategory(input.categoryCode, transformedResult)));
    });

    it('should then dispatch a REQUEST_FETCH_PRODUCTS action with the ids', () => {
      const productIDList = fromJS(['0', '1', '2']);
      expect(gen.next().value)
      .toEqual(put(requestFetchProducts(input.categoryCode, productIDList)));
    });

    it('and then nothing', () => {
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('Scenario2: input is invalid, throws an exception', () => {
    const input = { categoryCode: 'CAT4231' };
    const gen = callFetchCategory(input);

    it('should call the api first', () => {
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(call(apiV1.getCategoryDisplay.bind(apiV1), input.categoryCode))
      );
    });

    it('should dispatch a FAILURE_FETCH_CATEGORY action with the error message', () => {
      expect(gen.throw(genericError).value)
      .toEqual(put(failureFetchCategory(genericError)));
    });

    it('and then nothing', () => {
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('Scenario3: no result found, throws an exception', () => {
    const input = { categoryCode: 'FAKECAT123' };
    const gen = callFetchCategory(input);

    it('should call the api first', () => {
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(call(apiV1.getCategoryDisplay.bind(apiV1), input.categoryCode))
      );
    });

    it('should dispatch a FAILURE_FETCH_CATEGORY action with the error message', () => {
      expect(gen.next(invalidResponse).value)
      .toEqual(put(failureFetchCategory(notFoundError)));
    });
  });
});