import React from 'react';
import type { Priority } from '../../types/task.types';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ priority, className = '' }) => {
  const styles = {
    high: 'badge badge-high',
    medium: 'badge badge-medium',
    low: 'badge badge-low',
  };

  return (
    <span className={`${styles[priority]} ${className}`}>
      {priority.toUpperCase()}
    </span>
  );
};

export default Badge;
