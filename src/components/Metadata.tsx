import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../helpers/consts';

export default function Metadata({
  title = APP_NAME,
  description = `${APP_NAME} is a platform for discovering and sharing tools related to the EOSC Data Commons.`,
  keywords = "EOSC, Data Commons, Tools, Research, Open Science",
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