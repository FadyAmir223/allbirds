import { useParams } from 'react-router-dom';

const Collections = () => {
  const { collectionName } = useParams();

  return <div>{collectionName}</div>;
};

export default Collections;
