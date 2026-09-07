interface PageHeroProps {
  image: string;
  title: string;
  backgroundPosition?: string;
}

export default function PageHero({
  image,
  title,
  backgroundPosition = 'center',
}: PageHeroProps) {
  return (
    <section
      className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})`, backgroundPosition }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-4 bg-navy/65">
        <h1 className="font-display text-white text-center leading-none text-[clamp(1.75rem,8vw,4.5rem)]">
          {title}
        </h1>
      </div>
    </section>
  );
}
