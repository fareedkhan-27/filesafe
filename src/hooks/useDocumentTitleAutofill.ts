// Custom hook for document title auto-fill logic
// Ensures consistent behavior across add/edit forms

import { useEffect, useRef } from 'react';
import { DocumentType } from '../types/vault';
import { getDefaultTitle } from '../config/documentTypes';

/**
 * Hook to manage automatic title population when document type changes.
 *
 * Auto-fill rules:
 * 1. Only auto-fills when creating a new document (not editing)
 * 2. Auto-fills when:
 *    - Title is empty, OR
 *    - Title matches the previous document type's default title (user hasn't customized)
 * 3. Does NOT overwrite user-customized titles
 *
 * @param documentType - Current document type
 * @param title - Current title value
 * @param setTitle - State setter for title
 * @param isEditing - Whether in edit mode (true) or create mode (false)
 */
export const useDocumentTitleAutofill = (
  documentType: DocumentType,
  title: string,
  setTitle: (title: string) => void,
  isEditing: boolean
) => {
  // Track the previous document type to detect changes
  const previousDocumentType = useRef<DocumentType | null>(null);
  // Track the current title to detect user customization
  const previousTitle = useRef<string>('');

  // Effect that ONLY runs when documentType changes
  useEffect(() => {
    // Don't auto-fill in edit mode
    if (isEditing) {
      return;
    }

    // Get the default title for the current document type
    const newDefaultTitle = getDefaultTitle(documentType);

    // Initial mount - first time the hook runs
    if (previousDocumentType.current === null) {
      console.log('🔷 Initial mount - document type:', documentType, '→ title:', newDefaultTitle);
      setTitle(newDefaultTitle);
      previousDocumentType.current = documentType;
      previousTitle.current = newDefaultTitle;
      return;
    }

    // Check if document type actually changed
    if (previousDocumentType.current !== documentType) {
      // Get the default title for the PREVIOUS document type
      const previousDefaultTitle = getDefaultTitle(previousDocumentType.current);

      // Determine if user customized the title
      // User customized if current title doesn't match the previous default
      const userCustomizedTitle =
        title !== previousDefaultTitle &&
        title !== previousTitle.current;

      console.log('🔍 Document Type Changed:', {
        from: previousDocumentType.current,
        to: documentType,
        currentTitle: title,
        previousDefaultTitle,
        previousTitleRef: previousTitle.current,
        newDefaultTitle,
        userCustomizedTitle
      });

      // Only auto-fill if user hasn't customized the title
      if (!userCustomizedTitle) {
        console.log('✅ Auto-filling title to:', newDefaultTitle);
        setTitle(newDefaultTitle);
        previousTitle.current = newDefaultTitle;
      } else {
        console.log('❌ User customized title - keeping:', title);
        previousTitle.current = title;
      }

      // Update the tracking ref
      previousDocumentType.current = documentType;
    }
  }, [documentType, isEditing]); // NOTE: Intentionally NOT including 'title' or 'setTitle'

  // Separate effect to track when user manually changes the title
  useEffect(() => {
    if (!isEditing && previousTitle.current && title !== previousTitle.current) {
      console.log('📝 User manually changed title from', previousTitle.current, 'to', title);
      previousTitle.current = title;
    }
  }, [title, isEditing]);
};
