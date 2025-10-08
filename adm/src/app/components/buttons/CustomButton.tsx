import React, { CSSProperties, ReactNode, MouseEventHandler } from 'react';
import { Button, ButtonProps } from 'antd';

export interface CustomButtonProps extends ButtonProps {
  /** Teks di dalam tombol */
  text: string;
  /** Ikon dari react-icons atau komponen lain */
  icon?: ReactNode;
  /** Fungsi yang dijalankan ketika tombol diklik */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Jenis button (primary, default, link, dll) */
  type?: ButtonProps['type'];
  /** Ukuran button (small, middle, large) */
  size?: ButtonProps['size'];
  /** Styling tambahan */
  style?: CSSProperties;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  icon = null,
  onClick = () => {},
  type = 'primary',
  size = 'middle',
  style = {},
  ...rest
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      size={size}
      style={style}
      icon={icon}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
