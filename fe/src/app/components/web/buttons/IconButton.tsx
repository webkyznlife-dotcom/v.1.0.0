import React, { CSSProperties, ReactNode, MouseEventHandler } from 'react';
import { Button, ButtonProps } from 'antd';

export interface IconButtonProps extends ButtonProps {
  /** Icon yang ditampilkan dalam tombol */
  icon: ReactNode;
  /** Tipe button (primary, default, link, dll) */
  type?: ButtonProps['type'];
  /** Ukuran button (small, middle, large) */
  size?: ButtonProps['size'];
  /** Fungsi untuk menangani event click */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Styling tambahan */
  style?: CSSProperties;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  type = 'primary',
  size = 'middle',
  onClick,
  style = {},
  ...props
}) => {
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
      style={style}
      {...props}
      icon={icon}
    />
  );
};

export default IconButton;
