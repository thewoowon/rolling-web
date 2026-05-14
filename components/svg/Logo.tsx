import styled from "@emotion/styled";
import LogoIcon from "./LogoIcon";
import LogoText from "./LogoText";

const Logo = ({
  fontColor = "#FFFFFF", // Default color
}: {
  fontColor?: string;
}) => {
  return (
    <Container
      onClick={() => {
        window.location.href = "/";
      }}
    >
      <LogoIcon width={36} height={36}/>
      <LogoText width={100} height={22} fill={fontColor} />
    </Container>
  );
};

export default Logo;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;
