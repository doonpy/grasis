import { ServerResponse } from 'http';
import Router from 'next/router';

export async function redirectToLogin(server?: ServerResponse): Promise<void> {
  const login = '/login?redirected=true';
  if (server) {
    server.writeHead(302, {
      Location: login
    });
    server.end();
  } else {
    await Router.push(login);
  }
}
