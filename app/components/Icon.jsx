//I saw that the icons used on the figma were pro font awesome icons
//and I did not want to use the free versions (filled) for the main menu items, so I made them into svgs to transition states comfortably

const Icon = ({ name, isActive, className = "w-5 h-5" }) => {
  const strokeColor = isActive ? '#F59D0E' : '#8C93A1';
  const fillColor = isActive ? '#F59D0E' : '#8C93A1';

  const icons = {
    info: (
      <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.95835 9.16667H10L10 13.5417M17.7084 10C17.7084 14.2572 14.2572 17.7083 10 17.7083C5.74283 17.7083 2.29169 14.2572 2.29169 10C2.29169 5.74281 5.74283 2.29167 10 2.29167C14.2572 2.29167 17.7084 5.74281 17.7084 10Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.0003 6.125C10.2993 6.12518 10.5413 6.36795 10.5413 6.66699C10.5411 6.96589 10.2992 7.20783 10.0003 7.20801C9.70126 7.20801 9.45849 6.966 9.45831 6.66699C9.45831 6.36784 9.70115 6.125 10.0003 6.125Z" fill={fillColor} stroke={strokeColor} strokeWidth="0.25"/>
      </svg>
    ),
    file: (
      <svg className={className} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.76585 2.67708H4.5521C4.11488 2.67708 3.76044 3.03153 3.76044 3.46875V16.5313C3.76044 16.9685 4.11488 17.3229 4.5521 17.3229H14.4479C14.8852 17.3229 15.2396 16.9685 15.2396 16.5313V8.15084C15.2396 7.94087 15.1562 7.73951 15.0077 7.59104L10.3256 2.90896C10.1772 2.76049 9.97581 2.67708 9.76585 2.67708Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.92706 10.9896H9.6979M6.92706 14.1563H12.0729" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10.0938 3.07292V7.03125C10.0938 7.46847 10.4482 7.82292 10.8854 7.82292H14.8438" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    circleCheck: (
      <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 7.91667L8.75001 12.5L7.08334 10.8333M17.7083 10C17.7083 14.2572 14.2572 17.7083 10 17.7083C5.74281 17.7083 2.29167 14.2572 2.29167 10C2.29167 5.74281 5.74281 2.29167 10 2.29167C14.2572 2.29167 17.7083 5.74281 17.7083 10Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    plus: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="5" x2="12" y2="19" stroke={strokeColor} strokeWidth="2"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth="2"/>
      </svg>
    )
  };

  return icons[name] || null;
};

export default Icon;