import Router from 'next/router';

export async function redirectToLogin(redirectUrl, server) {
  const reformatUrl = redirectUrl?.replace(/\?.*/gi, '');
  const login = `/login?redirected=true&redirectUrl=${reformatUrl || '/'}`;
  if (server) {
    server.writeHead(302, {
      Location: login
    });
    server.end();
  } else {
    await Router.push(login);
  }
}

export async function redirectToIndex(server) {
  const index = '/?redirected=true';
  if (server) {
    server.writeHead(302, {
      Location: index
    });
    server.end();
  } else {
    await Router.push(index);
  }
}

export async function redirectTo(url, server) {
  if (server) {
    server.writeHead(302, {
      Location: url
    });
    server.end();
  } else {
    await Router.push(url);
  }
}
