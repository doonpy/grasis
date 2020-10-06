import RequestApi from '../api/request.api';
import { JwtService } from './jwt.service';

export async function postLogin(inputs) {
  const request = new RequestApi();
  const data = await request.post('/login', inputs).catch(({ response }) => response);

  if (!data) {
    return 'Kết nối thất bại!';
  }

  if (data.error) {
    return data.message;
  }

  await JwtService.storeToken(data.accessToken);
}

export async function logout() {
  await JwtService.deleteToken();
}
