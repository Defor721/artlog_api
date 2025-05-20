import { parentPort, workerData } from 'worker_threads';
import * as bcrypt from 'bcrypt';

const { type, payload } = workerData;

(async () => {
  try {
    if (type === 'hash') {
      const hashed = await bcrypt.hash(payload.password, 10);
      //parentPort는 반드시 존재
      parentPort!.postMessage({ result: hashed });
    } else if (type === 'compare') {
      const match = await bcrypt.compare(payload.password, payload.hash);
      parentPort!.postMessage({ result: match });
    }
  } catch (error) {
    parentPort!.postMessage({ error: error.message });
  }
})();
