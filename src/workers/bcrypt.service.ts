// bcrypt 작업 워커스레드로 대리
import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { join } from 'path';

@Injectable()
export class BcryptWorkerService {
  private readonly workerPath = join(__dirname, 'bcrypt.worker.js');

  private runWorker(type: 'hash' | 'compare', payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.workerPath, {
        workerData: { type, payload },
      });

      worker.on('message', (msg) => {
        if (msg.error) reject(new Error(msg.error));
        else resolve(msg.result);
      });

      worker.on('error', reject);
    });
  }

  hash(password: string): Promise<string> {
    return this.runWorker('hash', { password });
  }

  compare(password: string, hash: string): Promise<boolean> {
    return this.runWorker('compare', { password, hash });
  }
}
