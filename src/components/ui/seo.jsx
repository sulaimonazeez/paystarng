import { Helmet } from "react-helmet-async";

function SEOHead({ title, description, keywords, url, image }) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title || "PayStar - Buy Airtime & Data Instantly"}</title>
      <meta name="title" content={title || "PayStar - Buy Airtime & Data Instantly"} />
      <meta name="description" content={description || "Fast, secure, and reliable platform to buy airtime, data bundles, and manage your wallet in Nigeria."} />
      <meta name="keywords" content={keywords || "PayStar, airtime, data, recharge, wallet, Nigeria, payments"} />
      <meta name="author" content="Azeez Sulaimon" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://paystarbackend.vercel.app"} />
      <meta property="og:title" content={title || "PayStar - Buy Airtime & Data Instantly"} />
      <meta property="og:description" content={description || "Fast, secure, and reliable platform to buy airtime, data bundles, and manage your wallet in Nigeria."} />
      <meta property="og:image" content={image || "https://paystarbackend.vercel.app/og-image.png"} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || "https://paystarng.vercel.app"} />
      <meta property="twitter:title" content={title || "PayStar - Buy Airtime & Data Instantly"} />
      <meta property="twitter:description" content={description || "Fast, secure, and reliable platform to buy airtime, data bundles, and manage your wallet in Nigeria."} />
      <meta property="twitter:image" content={image || "https://paystarbackend.vercel.app/og-image.png"} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Helmet>
  );
}

export default SEOHead;