import { join } from 'path';
export const protoPaths = {
  user: join(__dirname, './protos/user-profile.proto'),
};
export * from './generated';
