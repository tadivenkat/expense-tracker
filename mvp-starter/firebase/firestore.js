/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore'; 
import { db } from './firebase';
import { getDownloadURL } from './storage';

// Name of receipt collection in Firestore
const RECEIPT_COLLECTION = 'receipts';

export const addReceipt = async (receipt) => {
  const receiptRef = await addDoc(collection(db, RECEIPT_COLLECTION), receipt);
  return receiptRef.id;
};

export const getReceipts = async (uid) => {
  return new Promise(async (resolve, reject) => {
    const receiptsQuery = query(collection(db, RECEIPT_COLLECTION), orderBy("date", "desc"));
    const receiptsSnapshot = await getDocs(receiptsQuery);
    const receipts = [];
    receiptsSnapshot.docs.forEach(async (doc, index) => { 
      const imageUrl = await getDownloadURL(doc.data().imageUrl);
      receipts.push({...doc.data(), id: doc.id, imageUrl});
      if (index === receiptsSnapshot.docs.length - 1) {
        resolve(receipts);
      } 
    });
  });
};