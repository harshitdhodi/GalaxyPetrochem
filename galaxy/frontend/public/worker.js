self.onmessage = (e) => {
    const result = heavyComputation(e.data);
    self.postMessage(result);
  };