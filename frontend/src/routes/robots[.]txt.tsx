import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const robots = `User-agent: *
Allow: /

Sitemap: ${process.env.APP_URL ? `${process.env.APP_URL}/sitemap.xml` : 'http://localhost:3000/sitemap.xml'}
`

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
      },
    },
  },
})
