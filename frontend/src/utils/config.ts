// Configuration utilities
// Get the backend base URL for file uploads and other resources

export const getBackendURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://smart-complaint-issue-tracking-system.onrender.com/api';
  // Remove /api suffix to get base URL
  return apiUrl.replace('/api', '');
};

export const getFileURL = (filepath: string) => {
  return `${getBackendURL()}${filepath}`;
};
