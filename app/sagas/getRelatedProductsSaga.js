import { call, put, takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import { apiV1 } from '../../mocks/apiMock';
import * as actionTypes from '../actions/actionTypes';
import * as productActions from '../actions/productActions';
import { requestFetchProductList } from '../actions/catalogueActions';

export function* callFetchRelatedProducts({ productCode }) {
  try {
    const products = yield call(apiV1.getRelatedProducts.bind(apiV1), productCode);
    const groups = fromJS(products).getIn(['content', 0, 'RelatedProducts']);
    if (!groups) {
      yield put(productActions.requestFetchXSellProducts(productCode));
    } else {
      // HACK doesn't work with immutable list
      yield groups.toJS().map(g => put(requestFetchProductList(
        fromJS(g.products),
        productActions.successFetchRelatedProducts,
        [productCode, g.name]
      )));
    }
  } catch (error) {
    yield put(productActions.requestFetchXSellProducts(productCode));
    yield put(productActions.failureFetchRelatedProducts(error));
  }
}

export default function* getRelatedProductsSaga() {
  yield takeEvery(
    actionTypes.REQUEST_FETCH_RELATEDPRODUCTS,
    callFetchRelatedProducts
  );
}
