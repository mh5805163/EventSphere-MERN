import useWebsiteLogo from '@/hooks/useWebsiteLogo';

export default function WebsiteMark({ useCustomLogo = true }) {
  const logo = useWebsiteLogo();
  return useCustomLogo && logo
    ? <img className="celebration-brand-mark" src={logo} alt="" />
    : <img className="eventsphere-brand-symbol" src="/favicon.svg" width="34" height="34" alt="" />;
}
