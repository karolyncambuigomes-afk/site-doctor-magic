import { useCustomScripts } from '@/hooks/useCustomScripts';

interface ScriptInjectorProps {
  position: 'head' | 'body_start' | 'body_end' | 'footer';
}

export const ScriptInjector = ({ position }: ScriptInjectorProps) => {
  const { data: scripts } = useCustomScripts(position);

  if (!scripts || scripts.length === 0) {
    return null;
  }

  return (
    <>
      {scripts.map((script) => (
        <div
          key={script.id}
          data-script-name={script.name}
          data-script-position={position}
          dangerouslySetInnerHTML={{ __html: script.code }}
        />
      ))}
    </>
  );
};
