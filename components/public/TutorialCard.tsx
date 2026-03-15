import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getYouTubeThumbnail } from "@/lib/utils";

interface TutorialCardProps {
  title: string;
  slug: string;
  description: string;
  youtubeId: string;
  categoryName: string;
}

export function TutorialCard({
  title,
  slug,
  description,
  youtubeId,
  categoryName,
}: TutorialCardProps) {
  const thumbnail = getYouTubeThumbnail(youtubeId, "hqdefault");

  return (
    <Link href={`/${slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-[--border] bg-[--card] transition-all duration-200 hover:shadow-md hover:border-neutral-300">
        <div className="relative aspect-video w-full bg-[--muted] overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 space-y-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {categoryName}
          </Badge>
          <h2 className="font-semibold text-[--foreground] leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-[--muted-foreground] line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
