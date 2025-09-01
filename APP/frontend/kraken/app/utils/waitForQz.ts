// utils/waitForQz.ts
export async function waitForQzWebsocket(timeout = 5000) {
  const interval = 200;
  const maxTries = Math.ceil(timeout / interval);
  let tries = 0;

  return new Promise<void>((resolve, reject) => {
    const check = () => {
      if (window.qz?.websocket) {
        return resolve();
      }
      if (++tries >= maxTries) {
        return reject(new Error("QZ Tray websocket not available"));
      }
      setTimeout(check, interval);
    };
    check();
  });
}
