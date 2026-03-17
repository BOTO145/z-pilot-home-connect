const BASE_URL = import.meta.env.VITE_SERVER_URL || 'https://6a90-117-203-153-128.ngrok-free.app';

export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(4000) });
  return res.json();
}

export async function sendChat(text: string, imageFile: File | null = null) {
  const form = new FormData();
  form.append('message', text);
  if (imageFile) form.append('image', imageFile);
  const res = await fetch(`${BASE_URL}/chat`, { method: 'POST', body: form });
  return res.json();
}

export async function getDevices() {
  const res = await fetch(`${BASE_URL}/devices`);
  return res.json();
}

export function camStreamUrl(streamPath: string) {
  return `${BASE_URL}${streamPath}`;
}
