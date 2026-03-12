import * as Icons from 'lucide-react';

const LucideIcon = ({ name, className, size = 18, fallback: Fallback }) => {
  // Convert kebab-case or snake_case to PascalCase
  const pascalName = name
    ? name
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
    : null;

  const IconComponent = Icons[pascalName] || Icons[name] || Fallback;

  if (!IconComponent) return null;

  return <IconComponent className={className} size={size} />;
};

export default LucideIcon;
