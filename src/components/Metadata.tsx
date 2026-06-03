import { Helmet } from 'react-helmet-async';
import { APP_NAME, APP_DESCRIPTION, APP_KEYWORDS } from '../helpers/metadata';

export default function Metadata({
  title = APP_NAME,
  description = APP_DESCRIPTION,
  keywords = APP_KEYWORDS,
}: { title?: string; description?: string; keywords?: string }) {
  const titleWithAppName = title === APP_NAME ? APP_NAME : `${title} | ${APP_NAME}`;
  return (
    <Helmet>
      <title>{titleWithAppName}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="DANS" />
    </Helmet>
  );
}