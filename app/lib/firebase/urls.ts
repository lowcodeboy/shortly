import { db } from './config';
import { 
  collection, 
  addDoc,
  query, 
  where, 
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { generateShortId } from '../utils/urlUtils';

export interface UrlMapping {
  shortId: string;
  longUrl: string;
  userId: string;
  createdAt: Date;
  clicks: number;
}

const URLS_COLLECTION = 'urls';

export async function createShortUrl(longUrl: string, userId: string): Promise<UrlMapping | null> {
  try {
    const shortId = generateShortId();
    
    const urlData = {
      shortId,
      longUrl,
      userId,
      createdAt: serverTimestamp(),
      clicks: 0
    };

    await addDoc(collection(db, URLS_COLLECTION), urlData);
    
    return {
      ...urlData,
      createdAt: new Date(),
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