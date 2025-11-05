export default class WorkerFactory {
    constructor(workerFunction) {
      const workerCode = workerFunction.toString();
      debugger
      const workerBlob = new Blob([`(${workerCode})(${import("jszip")})`]);
      return new Worker(URL.createObjectURL(workerBlob));
    }
  }