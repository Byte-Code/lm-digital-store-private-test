import { fork } from 'redux-saga/effects';

import getWorldSaga from './getWorldSaga';
import getWeatherSaga from './getWeatherSaga';
import getCategorySaga from './getCategorySaga';
import getProductSaga from './getProductSaga';
import idleTimerSaga from './idleTimerSaga';

export default function* root() {
  yield [
    fork(getWorldSaga),
    fork(getWeatherSaga),
    fork(getCategorySaga),
    fork(getProductSaga),
    fork(idleTimerSaga)
  ];
}
