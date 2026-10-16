/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Access key of the hosted form service that delivers the contact message. */
  readonly VITE_WEB3FORMS_KEY?: string
  /** Endpoint of your own that receives the contact form as multipart form data. */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Absolute production origin, used for canonical, Open Graph and sitemap URLs. */
  readonly VITE_SITE_URL?: string
}
