const BigXIcon = ({
  width = 40,
  height = 40,
  fill = "white",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33203 31.666L31.6654 8.33879"
        stroke={fill}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33203 8.33203L31.6654 31.6593"
        stroke={fill}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BigXIcon;
