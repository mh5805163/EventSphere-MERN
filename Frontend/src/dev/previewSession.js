export const adminPreviewEnabled = import.meta.env.DEV && import.meta.env.MODE === 'admin-preview';

let previewAccount = null;

export function setPreviewAccount(account) {
  if (!adminPreviewEnabled) return;
  previewAccount = account;
  window.dispatchEvent(new Event('auth-changed'));
}

export function readAuthValue(key) {
  if (!adminPreviewEnabled) return localStorage.getItem(key);
  if (!previewAccount) return null;

  switch (key) {
    case 'token': return 'preview-session';
    case 'user': return JSON.stringify(previewAccount);
    case 'userId': return previewAccount._id;
    case 'userName': return previewAccount.name;
    case 'userEmail': return previewAccount.email;
    case 'userRole': return previewAccount.role;
    default: return null;
  }
}
