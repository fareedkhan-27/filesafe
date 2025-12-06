/**
 * Cross-browser clipboard copy utility
 * Works on iOS Safari, Android, and Desktop browsers
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern Clipboard API first (works on HTTPS and localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for iOS Safari and non-HTTPS contexts
    // This method works reliably on iOS
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still functional
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // For iOS, we need to select the text with a range
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, textArea.value.length);
    } else {
      textArea.select();
    }
    
    // Try to copy using execCommand (works on iOS)
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    return false;
  }
};

/**
 * Trigger haptic feedback if available
 */
export const triggerHapticFeedback = (duration: number = 50) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

