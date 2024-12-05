const token = 'app-FCXd1cJRTNX7NlIAXf9tbvfj';

interface FetchConf extends RequestInit {
  timeout?: number;
  abortSignal?: AbortSignal;
}

const fetchSSE = (url: string, conf: FetchConf) => {
  const { timeout = 3000, abortSignal, ...fetchConf } = conf;
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), timeout);

  fetch(url, {
    ...fetchConf,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal: abortSignal || ac.signal,
  })
    .then((response) => {
      if (response.ok) {
        const reader = response.body!.getReader();

        return new ReadableStream({
          start(controller) {
            (function read() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  } else {
                    controller.enqueue(value);
                    read();
                  }
                })
                .catch((error) => {
                  console.error('SSE stream error ' + error);
                  controller.error(error);
                });
            })();
          },
        });
      } else {
        throw new Error('Http Error! Status: ' + response.status);
      }
    })
    .then((stream) => new Response(stream))
    .then((response) => {
      const reader = response.body!.getReader();
      (function listen() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              console.log('sse stream closed');
              return;
            }
            console.log('vvvvvvv', value);
            const text = new TextDecoder().decode(value);
            console.log('received sse data:', text);
            listen();
          })
          .catch((error) => {
            console.log('sse listen error');
          });
      })();
    })
    .catch((error) => {
      console.log('sse fetch error: ', error);
    });
};

export default fetchSSE;
