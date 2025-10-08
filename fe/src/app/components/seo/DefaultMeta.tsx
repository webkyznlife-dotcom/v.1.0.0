import { Title, Meta } from "react-head";

const DefaultMeta = () => (
  <>
    <Title>KYZN Life</Title>
    <Meta name="description" content="Portal berita dan event terbaru KYZN Life." />
    <Meta property="og:type" content="website" />
    <Meta property="og:title" content="KYZN Life" />
    <Meta property="og:description" content="Portal berita dan event terbaru KYZN Life." />
    <Meta property="og:image" content="/default.jpg" />
    <Meta property="og:url" content={window.location.href} />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" content="KYZN Life" />
    <Meta name="twitter:description" content="Portal berita dan event terbaru KYZN Life." />
    <Meta name="twitter:image" content="/default.jpg" />
  </>
);

export default DefaultMeta;