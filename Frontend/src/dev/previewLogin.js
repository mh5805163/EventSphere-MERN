import { setPreviewAccount } from './previewSession';

export function signInToPreview({ email, password }) {
  if (email !== 'admin@gmail.com' || password !== 'admin@123') {
    throw new Error('Use the development Admin preview credentials.');
  }

  const account = {
    _id: 'preview-admin',
    name: 'Preview Admin',
    email,
    role: 'admin',
  };
  setPreviewAccount(account);
  return account;
}
