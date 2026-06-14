/** GWR-inspired bullet train palette */
const GWR_GREEN = '#0d6b52'
const GWR_GREEN_DARK = '#064a38'
const GWR_CREAM = '#f4efe6'
const GWR_CHARCOAL = '#1e3048'

const BULLET_SIDE_INNER = `
  <path d="M3 13.5C3 9.5 6 6.5 11 6.5H38C46 6.5 53 8.5 55 11C55 13.5 53 15.5 46 15.5H11C6 15.5 3 13.5 3 13.5V13.5Z" fill="${GWR_GREEN}"/>
  <path d="M40 6.5H46C51 6.5 55 8.5 55 11C55 13.5 51 15.5 46 15.5H40C44 14 44 8 40 6.5Z" fill="${GWR_GREEN_DARK}"/>
  <path d="M54 11C54 9 51 7.5 48 7.5C51.5 9 52.5 10.5 52.5 11C52.5 11.5 51.5 13 48 14.5C51 14.5 54 13 54 11Z" fill="${GWR_CREAM}" opacity="0.9"/>
  <rect x="10" y="8.5" width="32" height="3.5" rx="1" fill="${GWR_CREAM}" opacity="0.9"/>
  <rect x="12" y="9.25" width="5" height="2" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.25"/>
  <rect x="19" y="9.25" width="5" height="2" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.25"/>
  <rect x="26" y="9.25" width="5" height="2" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.25"/>
  <rect x="33" y="9.25" width="5" height="2" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.25"/>
  <path d="M10 8.5L14 7.5" stroke="${GWR_CREAM}" stroke-width="0.75" opacity="0.5"/>
  <circle cx="14" cy="15.5" r="1.75" fill="${GWR_CHARCOAL}"/>
  <circle cx="28" cy="15.5" r="1.75" fill="${GWR_CHARCOAL}"/>
  <circle cx="40" cy="15.5" r="1.75" fill="${GWR_CHARCOAL}"/>
`

const BULLET_BIRDSEYE_INNER = `
  <path d="M9 1.5C13 1.5 15.5 4 15.5 8V38C15.5 42 13 44.5 9 44.5C5 44.5 2.5 42 2.5 38V8C2.5 4 5 1.5 9 1.5Z" fill="${GWR_GREEN}"/>
  <path d="M9 1.5C11 2.5 12 5 12 8V10H6V8C6 5 7 2.5 9 1.5Z" fill="${GWR_GREEN_DARK}"/>
  <ellipse cx="9" cy="3.5" rx="1.2" ry="2" fill="${GWR_CREAM}" opacity="0.85"/>
  <rect x="7.25" y="12" width="3.5" height="26" rx="1.25" fill="${GWR_CREAM}" opacity="0.85"/>
  <rect x="7.75" y="15" width="2.5" height="4" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.2"/>
  <rect x="7.75" y="22" width="2.5" height="4" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.2"/>
  <rect x="7.75" y="29" width="2.5" height="4" rx="0.5" fill="${GWR_CHARCOAL}" opacity="0.2"/>
  <rect x="1" y="14" width="2.5" height="6" rx="1" fill="${GWR_CHARCOAL}" opacity="0.7"/>
  <rect x="14.5" y="14" width="2.5" height="6" rx="1" fill="${GWR_CHARCOAL}" opacity="0.7"/>
  <rect x="1" y="30" width="2.5" height="6" rx="1" fill="${GWR_CHARCOAL}" opacity="0.7"/>
  <rect x="14.5" y="30" width="2.5" height="6" rx="1" fill="${GWR_CHARCOAL}" opacity="0.7"/>
  <path d="M9 40C7 40 6 39 6 38" stroke="${GWR_CREAM}" stroke-width="0.75" opacity="0.35"/>
`

interface TrainSpriteProps {
  className?: string
}

export function TrainSprite({ className = '' }: TrainSpriteProps) {
  return (
    <svg
      viewBox="0 0 56 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: BULLET_SIDE_INNER }}
    />
  )
}

export function BulletTrainIcon({ className = '' }: TrainSpriteProps) {
  return (
    <svg
      viewBox="0 0 56 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block shrink-0 ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: BULLET_SIDE_INNER }}
    />
  )
}

export function trainBirdseyeMarkup(): string {
  return `<svg viewBox="0 0 18 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${BULLET_BIRDSEYE_INNER}</svg>`
}

export function routeBearingDegrees(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
  const lat1 = (fromLat * Math.PI) / 180
  const lat2 = (toLat * Math.PI) / 180
  const dLng = ((toLng - fromLng) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180) / Math.PI
}
