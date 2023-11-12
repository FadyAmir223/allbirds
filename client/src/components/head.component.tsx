import { Helmet } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

const Head = ({ title, description }: HeadProps) => {
  return (
    <Helmet title={`${title} | allbirds`} defaultTitle='allbirds'>
      <meta name='description' content={description} />
    </Helmet>
  );
};

export default Head;
