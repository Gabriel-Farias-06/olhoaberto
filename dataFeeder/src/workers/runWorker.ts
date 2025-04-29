import { Worker } from "worker_threads";

export default function runWorker<Result>(
  filename: string,
  data: unknown
): Promise<Result> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filename, {
      workerData: data,
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker finalizou com código ${code}`));
    });
  });
}
