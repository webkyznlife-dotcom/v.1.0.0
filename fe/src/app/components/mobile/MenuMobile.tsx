import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiFillHome, AiOutlineClose } from 'react-icons/ai';
import {
  FaQuestionCircle,
  FaCalendarAlt,
  FaBars,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaSkype,
  FaFileContract,
  FaUserShield,
  FaWhatsapp,
  FaPhone,
  FaTasks,
  FaMapMarkerAlt
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import logo from '../../assets/images/logo.png';

interface MenuItem {
  label: string;
  path: string;
  icon: IconType; // Tetap gunakan IconType
  isBurger?: boolean;
}

const menus: MenuItem[] = [
  { label: 'Home', path: '/', icon: AiFillHome },
  { label: 'Programs', path: '/programs', icon: FaTasks },
  { label: 'Schedules', path: '/schedules', icon: FaCalendarAlt },
  { label: 'More', path: '#', icon: FaBars, isBurger: true },
];

const MenuMobile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSheetOpen]);

  const handleMenuClick = (path: string, isBurger?: boolean) => {
    if (isBurger) {
      setIsSheetOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleSheetNavigate = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-t justify-between border-t border-gray-200 z-20 ${
          isSheetOpen ? 'hidden' : 'flex'
        }`}
      >
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          const Icon = menu.icon;
          return (
            <button
              key={menu.label}
              onClick={() => handleMenuClick(menu.path, menu.isBurger)}
              className={`flex flex-col items-center justify-center py-2 flex-1 ${
                isActive && !menu.isBurger ? 'text-blue-600' : 'text-gray-500'
              }`}
              type="button"
            >
              {Icon && React.createElement(Icon as React.ElementType, { size: 20 })}
              <span className="text-xs mt-1">{menu.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Sheet */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-transparent flex items-end z-50"
          onClick={() => setIsSheetOpen(false)}
        >
          <div
            className="relative bg-white w-full rounded-t-xl p-4 animate-slideUp shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-7 w-5 h-5 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90"
              onClick={() => setIsSheetOpen(false)}
              type="button"
              aria-label="Close menu"
            >
              {React.createElement(AiOutlineClose as React.ElementType, { size: 12 })}
            </button>

            {/* Handle Bar */}
            <div className="w-1/2 h-2 bg-gray-300 rounded-full mx-auto mb-4"></div>

            {/* Menu Buttons */}
            <div>
              <SheetMenuButton
                icon={FaQuestionCircle}
                text="Whats is KYZN"
                onClick={() => handleSheetNavigate('/what-is-kyzn')}
                className="border-b border-gray-200"
              />
              <SheetMenuButton
                icon={FaMapMarkerAlt}
                text="Events"
                onClick={() => handleSheetNavigate('/events')}
                className="border-b border-gray-200"
              />              
              <SheetMenuButton
                icon={FaPhone}
                text="Contact Us"
                onClick={() => handleSheetNavigate('/contact-us')}
                className="border-b border-gray-200"
              />
              <SheetMenuButton
                icon={FaFileContract}
                text="Terms of Use"
                onClick={() => window.open("https://legal.kyzn.life/terms-and-conditions", "_blank")}
                className="border-b border-gray-200"
              />
              <SheetMenuButton
                icon={FaUserShield}
                text="Privacy Policy"
                onClick={() =>
                  window.open("https://legal.kyzn.life/privacy-policy", "_blank")
                }
              />
            </div>

            {/* Info Box */}
            <div className="bg-gray-100 p-3 mt-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3 text-center">
                KYZN is a family and social wellness club that helps families live
                healthier and happier lives together by embracing continuous positive
                change inspired by the "Kaizen" philosophy.
              </p>

              {/* Social Media */}
              <div className="flex justify-center gap-3">
                <SocialIcon href="https://www.facebook.com/kyzn.kuningan" bg="#1877F2" icon={FaFacebookF} />
                {/* <SocialIcon href="#" bg="#1DA1F2" icon={FaTwitter} /> */}
                <SocialIcon href="https://www.linkedin.com/in/kyzn/" bg="#0A66C2" icon={FaLinkedinIn} />
                <SocialIcon href="https://www.instagram.com/kyzn.kuningan/" bg="#E4405F" icon={FaInstagram} />
                <SocialIcon href="https://wa.me/message/MMKTL43S5AG3J1" bg="#00AFF0" icon={FaWhatsapp} /> 
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sheet Menu Button
interface SheetMenuButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  iconClassName?: string;
  className?: string;
}

const SheetMenuButton: React.FC<SheetMenuButtonProps> = ({
  icon,
  text,
  onClick,
  iconClassName = 'text-gray-600',
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left py-2 px-2 flex items-center gap-2 text-gray-600 ${className}`}
    style={{ fontFamily: 'Rubik, sans-serif', fontSize: '14px' }}
    type="button"
  >
    {React.createElement(icon as React.ElementType, { size: 16, className: iconClassName })}
    {text}
  </button>
);

// Social Icon
interface SocialIconProps {
  href: string;
  bg: string;
  icon: IconType;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, bg, icon }) => (
  <a
    href={href}
    className="w-8 h-8 flex items-center justify-center rounded-full text-white"
    style={{ backgroundColor: bg }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {React.createElement(icon as React.ElementType, { size: 16 })}
  </a>
);

export default MenuMobile;
