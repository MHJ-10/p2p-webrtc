interface ControlItemProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  badge?: number;
  invented?: boolean;
}

export type { ControlItemProps };
