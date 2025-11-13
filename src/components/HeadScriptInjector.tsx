import { Helmet } from 'react-helmet-async';
import { useCustomScripts } from '@/hooks/useCustomScripts';

export const HeadScriptInjector = () => {
  const { data: scripts } = useCustomScripts('head');

  if (!scripts || scripts.length === 0) {
    return null;
  }

  return (
    <Helmet>
      {scripts.map((script) => (
        <script
          key={script.id}
          data-script-name={script.name}
          dangerouslySetInnerHTML={{ __html: script.code }}
        />
      ))}
    </Helmet>
  );
};
