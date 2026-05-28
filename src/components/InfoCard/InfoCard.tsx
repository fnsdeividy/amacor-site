import { Link } from 'react-router-dom'

export interface InfoCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  image?: string
  link?: string
  linkText?: string
}

export function InfoCard({ title, description, icon, image, link, linkText }: InfoCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-warm-200 overflow-hidden group hover:shadow-card-hover hover:border-warm-300 transition-all duration-300">
      {image && (
        <div className="h-52 overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-8">
        {icon && <div className="mb-5 text-primary-600">{icon}</div>}
        <h3 className="text-[20px] font-bold text-primary-900 mb-3 leading-snug">{title}</h3>
        <p className="text-warm-600 text-[16px] leading-relaxed">{description}</p>
        {link && (
          <Link
            to={link}
            className="inline-flex items-center gap-1.5 mt-5 text-primary-600 font-semibold hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
          >
            {linkText || 'Saiba mais'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

export default InfoCard
