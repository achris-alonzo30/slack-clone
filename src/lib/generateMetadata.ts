import { Metadata } from "next"

export function generateMetadata({
  title = "Slack Clone",
  description = "This project is a Slack Clone from CodeWithAntonio YouTube Videos.",
  image = "/thumbnail.png",
  icons = "/logo.svg",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  const fullImageUrl = new URL(image, 'https://slack-clone-ruddy-nine.vercel.app').toString()
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://slack-clone-ruddy-nine.vercel.app',
      siteName: 'Slack Clone',
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: 'Slack Clone',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@SlackHQ",
      site: "@SlackHQ"
    },
    icons,
    metadataBase: new URL('https://slack-clone-ruddy-nine.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
