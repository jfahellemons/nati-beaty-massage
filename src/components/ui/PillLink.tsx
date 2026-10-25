import Link from "next/link";
import { PillContent, pillClass, type PillSize, type PillVariant } from "./pill";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
  external?: boolean;
};

export function PillLink({ href, children, variant = "bronze", size = "md", className, external }: Props) {
  const cls = pillClass(variant, size, className);
  const content = (
    <PillContent variant={variant} size={size}>
      {children}
    </PillContent>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
