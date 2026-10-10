import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { Item, Order, Offer } from '../types';
import { INITIAL_ITEMS } from '../data/mockData';

export async function initializeMarketplaceData() {
  const itemsCollection = collection(db, 'items');
  try {
    const snap = await getDocs(itemsCollection);
    // If database already contains items, live catalog is ready
    if (!snap.empty) {
      return;
    }

    // If empty and current user is logged in, seed under current auth UID
    if (auth.currentUser) {
      for (const item of INITIAL_ITEMS) {
        try {
          await setDoc(doc(db, 'items', item.id), {
            ...item,
            sellerId: auth.currentUser.uid,
          });
        } catch (e) {
          console.warn('Seeding item skipped:', e);
        }
      }
    }
  } catch (err) {
    console.warn('Marketplace cloud connection check:', err);
  }
}

export function subscribeToItems(
  onData: (items: Item[]) => void,
  onError?: (error: unknown) => void
) {
  const itemsCollection = collection(db, 'items');
  return onSnapshot(
    itemsCollection,
    (snapshot) => {
      const itemsList: Item[] = [];
      snapshot.forEach((d) => {
        itemsList.push(d.data() as Item);
      });
      if (itemsList.length > 0) {
        onData(itemsList);
      }
    },
    (err) => {
      if (onError) onError(err);
      console.warn('Firestore subscription status:', err.message);
    }
  );
}

export async function saveItemToFirestore(item: Item) {
  if (!auth.currentUser) {
    console.info('Item saved to local state. Sign in with Google to sync directly to cloud.');
    return;
  }
  try {
    await setDoc(doc(db, 'items', item.id), item);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `items/${item.id}`);
  }
}

export async function updateItemInteraction(itemId: string, likes: number, shares: number) {
  if (!auth.currentUser) {
    // Guest likes remain reactive in local state
    return;
  }
  try {
    await updateDoc(doc(db, 'items', itemId), { likes, shares });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `items/${itemId}`);
  }
}

export async function saveOrderToFirestore(order: Order) {
  if (!auth.currentUser) {
    console.info('Order recorded in local escrow ledger.');
    return;
  }
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `orders/${order.id}`);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order['status'],
  additionalFields: Partial<Order> = {}
) {
  if (!auth.currentUser) return;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      ...additionalFields
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
  }
}

export async function saveOfferToFirestore(offer: Offer) {
  if (!auth.currentUser) return;
  try {
    await setDoc(doc(db, 'offers', offer.id), offer);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `offers/${offer.id}`);
  }
}

export async function updateOfferStatusInFirestore(offerId: string, status: Offer['status']) {
  if (!auth.currentUser) return;
  try {
    await updateDoc(doc(db, 'offers', offerId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `offers/${offerId}`);
  }
}
