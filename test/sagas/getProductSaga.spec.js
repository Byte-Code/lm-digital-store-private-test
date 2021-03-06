import { call, put } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import { apiClient } from '../../mocks/apiMock';
import { callFetchProduct } from '../../app/sagas/getProductSaga';
import * as productActions from '../../app/actions/productActions';

jest.mock('../../app/CommandLineOptions', () => ({
  isDebugMode: jest.fn()
}));

const validResponse = {
  content: {
    name: 'foo',
    code: '23'
  },
  status: 'OK'
};
const invalidResponse = {
  content: {
    description: 'not found'
  },
  status: 'KO'
};
const genericError = new Error('Generic Error');
const notFoundError = new Error('Not Found Error');

describe('getProductSaga', () => {
  describe("Scenario1: input is fine, doesn't throw", () => {
    const input = { productCode: '21847689' };
    const gen = callFetchProduct(input);

    it('should call the api first', () => {
      expect(gen.next().value).toEqual(call(apiClient.fetchProductDisplay, input.productCode));
    });

    it('should dispatch a SUCCESS_FETCH_PRODUCT action with the transformed result', () => {
      const transformedResult = fromJS(validResponse).get('content');
      expect(gen.next(validResponse).value).toEqual(
        put(productActions.successFetchProduct(input.productCode, transformedResult))
      );
    });

    it('should then dispatch a REQUEST_FETCH_RELATEDPRODUCTS action', () => {
      expect(gen.next().value).toEqual(
        put(productActions.requestFetchRelatedProducts(input.productCode))
      );
    });

    it('and dispatch a REQUEST_FETCH_STORESTOCK action', () => {
      expect(gen.next().value).toEqual(
        put(productActions.requestFetchStoreStock(input.productCode))
      );
    });

    it('and then nothing', () => {
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('Scenario2: input is invalid, throws an exception', () => {
    const input = { productCode: '' };
    const gen = callFetchProduct(input);

    it('should call the api first', () => {
      expect(gen.next().value).toEqual(call(apiClient.fetchProductDisplay, input.productCode));
    });

    it('should dispatch a FAILURE_FETCH_PRODUCT action with the error message', () => {
      expect(gen.throw(genericError).value).toEqual(
        put(productActions.failureFetchProduct(genericError))
      );
    });

    it('and then nothing', () => {
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('Scenario3: no result found, throws an exception', () => {
    const input = { productCode: 'FAKEPRODUCT123' };
    const gen = callFetchProduct(input);

    it('should call the api first', () => {
      expect(gen.next().value).toEqual(call(apiClient.fetchProductDisplay, input.productCode));
    });

    it('should dispatch a FAILURE_FETCH_PRODUCT action with the error message', () => {
      expect(gen.next(invalidResponse).value).toEqual(
        put(productActions.failureFetchProduct(notFoundError))
      );
    });
  });
});
