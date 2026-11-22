import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { Service } from "@/types"

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EFECE6] bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Service Image with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md">
          {service.category}
        </span>

        {/* Duration Badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#2D241E] backdrop-blur-md">
          <Clock className="h-3 w-3 text-[#9E5739]" />
          <span>{service.duration} mins</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-serif text-lg font-bold text-[#2D241E]">
            {service.serviceName}
          </h3>
          <span className="font-serif text-xl font-bold whitespace-nowrap text-[#9E5739]">
            ${service.price}
          </span>
        </div>

        {/* Description cut to 2 lines */}
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#2D241E]/70">
          {service.description}
        </p>

        {/* View Details Button */}
        <Link
          href={`/services/${service._id}`}
          className="mt-auto w-full rounded-xl bg-[#9E5739] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#8B4A2F]"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
