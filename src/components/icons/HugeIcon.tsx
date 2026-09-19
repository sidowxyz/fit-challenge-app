import React from 'react';
import { Icon, IconProps, addCollection } from '@iconify/react';
import hugeiconsSubset from './hugeicons-subset.json';

// Register offline Hugeicons icon subset locally with zero network latency
addCollection(hugeiconsSubset as any);

export interface HugeIconProps extends Omit<IconProps, 'icon'> {
  name: string;
  className?: string;
  size?: number | string;
}

export const HugeIcon: React.FC<HugeIconProps> = ({ name, className = '', size = 20, ...props }) => {
  const iconName = name.startsWith('hugeicons:') ? name : `hugeicons:${name}`;
  return (
    <Icon 
      icon={iconName} 
      className={className} 
      width={size} 
      height={size} 
      {...props} 
    />
  );
};

// Official Hugeicons presets from https://icon-sets.iconify.design/hugeicons/
export const Icons = {
  Fire: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="fire" {...props} />,
  Dumbbell: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="dumbbell-01" {...props} />,
  Calendar: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="calendar-03" {...props} />,
  Dashboard: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="dashboard-square-01" {...props} />,
  History: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="time-02" {...props} />,
  TrendingUp: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="trade-up" {...props} />,
  Users: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="user-group" {...props} />,
  User: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="user-circle-02" {...props} />,
  Settings: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="settings-02" {...props} />,
  CheckCircle: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="checkmark-circle-02" {...props} />,
  Check: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="tick-02" {...props} />,
  Plus: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="add-01" {...props} />,
  Trash: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="delete-02" {...props} />,
  Copy: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="copy-01" {...props} />,
  ArrowRight: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="arrow-right-01" {...props} />,
  ArrowLeft: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="arrow-left-01" {...props} />,
  ChevronRight: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="arrow-right-02" {...props} />,
  ChevronLeft: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="arrow-left-02" {...props} />,
  Clock: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="clock-01" {...props} />,
  Activity: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="pulse-02" {...props} />,
  Database: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="database-01" {...props} />,
  Bell: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="notification-01" {...props} />,
  Lock: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="lock-password" {...props} />,
  Mail: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="mail-01" {...props} />,
  LogOut: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="logout-01" {...props} />,
  Close: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="cancel-01" {...props} />,
  Info: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="information-circle" {...props} />,
  Alert: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="alert-circle" {...props} />,
  Key: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="key-01" {...props} />,
  Reload: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="reload" {...props} />,
  ShieldCheck: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="shield-check" {...props} />,
  Football: (props: Omit<HugeIconProps, 'name'>) => <HugeIcon name="football" {...props} />
};
