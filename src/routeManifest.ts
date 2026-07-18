import routes from './data/route-manifest.json'

export interface RouteEntry {
  canonical: string
  description: string
  ogImage?: string
  ogImageAlt?: string
  page: string
  path: string
  robots?: string
  title: string
}

export const routeManifest = routes as RouteEntry[]
const routesByPath = new Map(routeManifest.map((route) => [route.path, route]))

export function getRouteEntry(pathname: string) {
  return routesByPath.get(pathname)
}
