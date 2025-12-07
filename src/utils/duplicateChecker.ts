// Duplicate Checker Utility
// Checks for duplicate documents before creation
//
// DUPLICATE RULE: Document titles must be unique PER PROFILE (case-insensitive)
// - Different profiles CAN have documents with the same title
// - Same profile CANNOT have two documents with the same title
// - Comparison is case-insensitive ("Passport" === "passport")
// - Whitespace is trimmed before comparison

import { getAllDocuments } from '../services/vaultStorage';
import { Document } from '../types/vault';

/**
 * Checks if a document with the same title already exists for a specific profile.
 *
 * **Uniqueness Rule:** Titles must be unique per profile (case-insensitive).
 *
 * Example:
 * - John can have "Passport" and "Visa"
 * - John CANNOT have "Passport" and "passport" (duplicate)
 * - Mary CAN also have "Passport" (different profile)
 *
 * @param title - The title of the document to check
 * @param profileId - The profile ID the document belongs to
 * @param excludeId - Optional document ID to exclude from check (for updates)
 * @returns Promise<boolean> - true if duplicate exists, false otherwise
 */
export const checkDuplicateDocument = async (
  title: string,
  profileId: string,
  excludeId?: string
): Promise<boolean> => {
  const allDocuments = await getAllDocuments();

  const duplicate = allDocuments.find(doc =>
    doc.title.toLowerCase().trim() === title.toLowerCase().trim() &&
    doc.profileId === profileId &&
    doc.id !== excludeId
  );

  return !!duplicate;
};

/**
 * Gets the duplicate document if it exists
 * @param title - The title of the document to check
 * @param profileId - The profile ID the document belongs to
 * @param excludeId - Optional document ID to exclude from check (for updates)
 * @returns Promise<Document | null> - The duplicate document or null
 */
export const getDuplicateDocument = async (
  title: string,
  profileId: string,
  excludeId?: string
): Promise<Document | null> => {
  const allDocuments = await getAllDocuments();
  
  const duplicate = allDocuments.find(doc => 
    doc.title.toLowerCase().trim() === title.toLowerCase().trim() &&
    doc.profileId === profileId &&
    doc.id !== excludeId
  );
  
  return duplicate || null;
};
