import RemoteApi from '@byte-code/lm-remote-api';
import world from './world';
import weather from './weather.json';
import configDev from '../config.dev';
import { isDebugMode } from '../app/CommandLineOptions';

const { apiConfig } = isDebugMode ? configDev : process.env.config;

export function fetchWorld() {
  return new Promise(resolve => {
    process.nextTick(() => resolve(world));
  });
}

export function fetchWeather() {
  return new Promise(resolve => {
    process.nextTick(() => resolve(weather));
  });
}

export const apiClient = new RemoteApi(apiConfig);
