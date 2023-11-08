import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export const loader = ({ request }: LoaderFunctionArgs) => {
  const user = '';
  if (!user) {
    const pathname = new URL(request.url).pathname;
    const redirectPath = pathname ? `redirectTo=${pathname}` : '';
    return redirect(`login?${redirectPath}`);
  }

  return null;
};
