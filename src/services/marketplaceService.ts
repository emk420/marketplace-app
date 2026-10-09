import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { Item, Order, Offer } from '../types';
import { INITIAL_ITEMS } from '../data/mockData';

export async function initializeMarketplaceData() {
  const itemsCollection = collection(db, 'items');
  try {
    const snap = await getDocs(itemsCollection);
    if (snap.empty) {
      // Seed initial mock items to Firestore
      for (const item of INITIAL_ITEMS) {
        await setDoc(doc(db, 'items', item.id), item);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'items');
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
      onData(itemsList);
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, 'items');
    }
  );
}

export async function saveItemToFirestore(item: Item) {
  try {
    await setDoc(doc(db, 'items', item.id), item);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `items/${item.id}`);
  }
}

export async function updateItemInteraction(itemId: string, likes: number, shares: number) {
  try {
    await updateDoc(doc(db, 'items', itemId), { likes, shares });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `items/${itemId}`);
  }
}

export async function saveOrderToFirestore(order: Order) {
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
  try {
    await setDoc(doc(db, 'offers', offer.id), offer);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `offers/${offer.id}`);
  }
}

export async function updateOfferStatusInFirestore(offerId: string, status: Offer['status']) {
  try {
    await updateDoc(doc(db, 'offers', offerId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `offers/${offerId}`);
  }
}
