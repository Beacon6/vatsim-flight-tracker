import { existsSync } from 'node:fs';

export default function assertPathExists(path: string, message: string): void {
  if (!path || !existsSync(path)) {
    throw new Error(message);
  }
}
