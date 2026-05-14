const LeftChevronIcon = ({
  width = 24,
  height = 24,
  fill = "#111111",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.998 19L7.99805 12L14.998 5"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeftChevronIcon;
