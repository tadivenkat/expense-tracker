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

import { format } from 'date-fns';
import { deleteObject, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from './firebase';

const BUCKET_URL = "gs://expenses-tracker-dev-2648c.firebasestorage.app";

export async function uploadImage(image, uid) {
  const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"); // ISO 8601
  const path = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;
  const reference = ref(storage, path);
  await uploadBytes(reference, image);
  return path;
}

export async function deleteImage(path) {
  await deleteObject(ref(storage, path));
}

export async function replaceImage(image, path) {
  console.log("Replacing image: ", path);
  const reference = ref(storage, path);
  await uploadBytes(reference, image);
  return path;
}

export async function getDownloadURL(path) {
  return await getStorageDownloadURL(ref(storage, path));
}