import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { opacify } from "polished";
import { uploadyThemeDark } from "./uploady.theme";
import Logo from "./text-logo-light.png";

const StyledLogo = styled.img`
  width: 270px;
  margin: 0 20px 10px 0;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 40px;
  box-sizing: border-box;
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: ${({ theme }) => theme.textColorSemiSub};
`;

const Divider = styled.hr`
  width: 100%;
  margin: 20px 0 10px;
  border-color: ${({ theme }) => theme.colorPrimary};
  transform: translateX(-50%);
  position: relative;
  left: 50%;
`;

const StoryName = styled.h2`
  margin: 0 6px 0 0;
`;

const StoryDescription = styled.span`
  font-size: 1.2rem;
`;

const StoryDetails = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-bottom: 25px;
  width: 100%;
  background-color: #2d343b6e;
  padding: 4px 0;
`;

const StoryGlobalStyle = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.textColor};
  }

  button {
    background-color: ${({ theme }) => theme.actionBackground};
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => opacify(0.5, theme.colorPrimary)};
    border-style: groove;
    box-shadow: 0 0 5px 0 ${({ theme }) => theme.colorSecondary};
    min-width: 200px;
    padding: 10px 10px;
    font-size: 1.2rem;
    cursor: pointer;

    &:disabled {
      background-color: ${({ theme }) => theme.disabledActionBackground};
      color: ${({ theme }) => theme.colorDisabled};
      cursor: progress;
    }
  }
`;

const StoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UploadyDecorator = (Story, context) => {
	const { story: storyName, originalStoryFn: orgStory } = context;

	return (
		<ThemeProvider theme={uploadyThemeDark}>
			<StoryGlobalStyle/>
			<Container>
				<Intro>
					<StyledLogo src={Logo}/>
					<Title>Modern file uploading - components & hooks for React</Title>
				</Intro>
				<Divider/>
				<StoryDetails>
					<StoryName>{storyName} - </StoryName>
					{orgStory.description &&
						<StoryDescription>{orgStory.description}</StoryDescription>}
				</StoryDetails>
				<StoryWrapper>
					<Story/>
				</StoryWrapper>
			</Container>
		</ThemeProvider>
	);
};

export default UploadyDecorator;

