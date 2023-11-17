import { useParams } from 'react-router-dom';

const Collections = () => {
  const { collectionName } = useParams();

  return <section className='pt'>{collectionName}</section>;
};

export default Collections;
