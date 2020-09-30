import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const axiosBaseConfigs = {
  baseURL: publicRuntimeConfig.API_SERVER,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};
