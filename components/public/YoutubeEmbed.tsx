"use client";

interface YoutubeEmbedProps {
  youtubeId: string;
  title: string;
}

export function YoutubeEmbed({ youtubeId, title }: YoutubeEmbedProps) {
  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-xl"
      />
    </div>
  );
}
