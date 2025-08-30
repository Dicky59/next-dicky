export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return { success: false, error: 'Failed to copy to clipboard' };
  }
};
