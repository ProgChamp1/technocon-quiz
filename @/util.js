const utils = {
  arrayBufferToBase64: function arrayBufferToBase64(buffer) {
    return new Promise((resolve, _) => {
      const blob = new Blob([buffer], {
        type: "application/octet-binary"
      });
      const reader = new FileReader();
      reader.onload = evt => {
        const dataurl = evt.target.result;
        resolve(dataurl.substr(dataurl.indexOf(",") + 1));
      };
      reader.readAsDataURL(blob);
    });
  },
  base64ToArrayBuffer: async function base64ToArrayBuffer(b64) {
    const data = await fetch(`data:application/octect-stream;base64,${b64}`);
    return await data.arrayBuffer();
  }
};
self.utils = utils;
