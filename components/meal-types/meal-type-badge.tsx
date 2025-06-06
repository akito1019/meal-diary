interface MealTypeBadgeProps {
  name: string;
  className?: string;
}

export function MealTypeBadge({ name, className = '' }: MealTypeBadgeProps) {
  const getColorClasses = (typeName: string) => {
    const lowerName = typeName.toLowerCase();
    
    if (lowerName.includes('朝') || lowerName.includes('breakfast')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (lowerName.includes('昼') || lowerName.includes('lunch')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerName.includes('夕') || lowerName.includes('夜') || lowerName.includes('dinner')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (lowerName.includes('間食') || lowerName.includes('snack')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
        border ${getColorClasses(name)} ${className}
      `}
    >
      {name}
    </span>
  );
}