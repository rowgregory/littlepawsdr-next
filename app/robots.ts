import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth', '/member', '/api', '/checkout', '/order-confirmation']
      }
    ],
    sitemap: 'https://littlepawsdachshundrescue.com/sitemap.xml'
  }
}
