import Image from 'next/image';

export default function LinkedIn() {
  return (
    <Image
      src="/icons/linkedin.png"
      className="invert dark:invert-0"
      width={24}
      height={24}
      alt="linkedin"
    />
  );
}
