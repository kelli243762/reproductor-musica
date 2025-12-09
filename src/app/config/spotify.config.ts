export const SpotifyConfig = {
  clientId: '1bd9718abaa5470193775c04c1e95a73',
  redirectUri: 'http://127.0.0.1:4200/callback',
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scopes: [
    'user-read-private',
    'user-read-email',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
  ],
};


function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}


async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function getAuthUrl(): Promise<string> {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: SpotifyConfig.clientId,
    response_type: 'code',
    redirect_uri: SpotifyConfig.redirectUri,
    scope: SpotifyConfig.scopes.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  return `${SpotifyConfig.authEndpoint}?${params.toString()}`;
}