import Image from "next/image";

interface PartnerLogoProps {
  name: string;
  className?: string;
}

export function PartnerLogo({ name, className }: PartnerLogoProps) {
  switch (name) {
    case "SLAP":
      return (
        <div className={`relative h-12 w-32 ${className}`}>
          <Image
            src="/partners/slap-v4.png"
            alt="SLAP Logo"
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    case "BOGOOK":
      return (
        <div className={`relative h-12 w-32 ${className}`}>
          <Image
            src="/partners/boogook-v2.png"
            alt="BOGOOK Logo"
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    case "SUPREME":
      return (
        <div className={`relative h-12 w-32 ${className}`}>
          <Image
            src="/partners/supreme.png"
            alt="SUPREME Logo"
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    case "ACT":
      return (
        <div className={`relative h-16 w-32 ${className}`}>
          <Image
            src="/partners/act-v3.png"
            alt="ACT Logo"
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    case "SWIFT SUPPORT SERVICE": // Keeping SVG for now as no image was identified as Swift (Image 2 was KIA)
      return (
        <div className={`relative h-16 w-32 ${className}`}>
          <Image
            src="/partners/swift.png"
            alt="Swift Support Service Logo"
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    default:
      return <span className={`font-bold text-xl ${className}`}>{name}</span>;
  }
}
