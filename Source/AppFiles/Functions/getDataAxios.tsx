// @ts-ignore
import axios from 'axios';

const getDataAxios = (method: string, route: string, data: {} = {}, headers: [] = []) => {
  //@ts-ignore
  return axios({
    method,
    url: route,
    data,
    headers
  });
};

export default getDataAxios;
