interface SQLIconProps {
  className?: string;
  size?: number;
}

export default function SQLIcon({ className = '', size = 24 }: SQLIconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
    >
      <path fill="#336791" d="M64 4C30.5 4 4 30.5 4 64s26.5 60 60 60 60-26.5 60-60S97.5 4 64 4z"/>
      <path fill="#fff" d="M44.5 48h-8v32h8V48zm23 0h-8v32h8V48zm23 0h-8v32h8V48z"/>
      <path fill="#fff" d="M36.5 56v8h32v-8h-32zm0 16v8h32v-8h-32z"/>
      <text x="64" y="95" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">SQL</text>
    </svg>
  );
}
