import { HTMLAttributes } from 'react';

interface SidebarButtonPropTypes extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  content?: string;
}

export default function SidebarButton({
  icon,
  content,
  isActive = false,
  className,
  children,
  rightIcon,
  ...props
}: SidebarButtonPropTypes) {
  return (
    <div
      className={
        className
          ? className
          : 'px-[10px] py-2 bg-transparent w-full flex gap-[10px] rounded-[10px] cursor-pointer hover:opacity-100 opacity-80 hover:bg-[#ffffff1a]' +
            (isActive ? ' bg-[#ffffff1a]' : ' bg-transparent')
      }
      {...props}
    >
      <div>{icon && icon}</div>
      <div className="text-[16px] font-bold">
        {content}
        {children}
      </div>
      <div>{rightIcon && rightIcon}</div>
    </div>
  );
}
