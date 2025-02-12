import { db } from './config';
import { 
  collection, 
  addDoc,
  query, 
  where, 
  getDocs,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { generateShortId } from '../utils/urlUtils';

export interface UrlMapping {
  shortId: string;
  longUrl: string;
  userId: string;
  createdAt: Date;
  clicks: number;
  validated: boolean;
  pendingShortId?: string;
}

const URLS_COLLECTION = 'urls';

export async function createShortUrl(longUrl: string, userId: string): Promise<UrlMapping | null> {
  try {
    const shortId = generateShortId();
    
    // Just return the data without saving to Firestore
    return {
      shortId,
      longUrl,
      userId,
      createdAt: new Date(),
      clicks: 0,
      validated: false
    };
  } catch (error) {
    console.error('Error creating short URL:', error);
    return null;
  }
}

export async function getLongUrl(shortId: string): Promise<string | null> {
  try {
    console.log('Fetching URL for shortId:', shortId); // Debug log
    
    const urlQuery = query(
      collection(db, URLS_COLLECTION),
      where('shortId', '==', shortId)
    );
    
    const querySnapshot = await getDocs(urlQuery);
    
    if (querySnapshot.empty) {
      console.log('No URL found'); // Debug log
      return null;
    }

    const longUrl = querySnapshot.docs[0].data().longUrl;
    console.log('Found longUrl:', longUrl); // Debug log
    return longUrl;
    
  } catch (error) {
    console.error('Error getting long URL:', error);
    return null;
  }
}

export async function getUserUrls(userId: string): Promise<UrlMapping[]> {
  try {
    const urlQuery = query(
      collection(db, URLS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(urlQuery);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    } as UrlMapping));
  } catch (error) {
    console.error('Error getting user URLs:', error);
    return [];
  }
}

export async function validateAndSaveUrl(shortId: string, urlData: Partial<UrlMapping>): Promise<UrlMapping | null> {
  try {
    // Now we save to Firestore only when validating
    const finalUrlData = {
      ...urlData,
      shortId,
      validated: true,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, URLS_COLLECTION), finalUrlData);
    
    return {
      ...finalUrlData,
      createdAt: new Date(),
    } as UrlMapping;
  } catch (error) {
    console.error('Error validating URL:', error);
    return null;
  }
}

export async function deleteUrl(shortId: string): Promise<boolean> {
  try {
    const urlQuery = query(
      collection(db, URLS_COLLECTION),
      where('shortId', '==', shortId)
    );
    
    const querySnapshot = await getDocs(urlQuery);
    
    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting URL:', error);
    return false;
  }
} 