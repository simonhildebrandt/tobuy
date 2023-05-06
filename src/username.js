import { useFirestoreDocument } from './firebase';

export default function({uid}) {
  const { data, loaded } = useFirestoreDocument(`users/${uid}`);

  if (loaded) {
    return data.email;
  } else {
    return '';
  }
}
