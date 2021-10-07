import React, { useState } from "react";
import styled from "styled-components";
import Uploady, { useItemFinishListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import UploadPreview from "@rpldy/upload-preview";

export const FirstTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<UploadButton>Upload File(s)</UploadButton>
	</Uploady>);
};

FirstTutorial.description = "Add simple upload functionality to a React app";

const PreviewContainer = styled.div`

  margin-top: 20px;

  img {
    max-width: 90%;
  }
`;

export const SecondTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
		>
			<UploadButton>Upload File(s)</UploadButton>
			<PreviewContainer>
				<UploadPreview/>
			</PreviewContainer>
		</Uploady>
	);
};

SecondTutorial.description = "Upload with image preview";

export const ThirdTutorial = () => {
	return (
		<Uploady destination={{
			url: process.env.UPLOAD_URL,
			params: {
				foo: "bar",
			},
		}}
		>
			<UploadButton
				destination={{
					headers: {
						"X-Requested-With": "uploady"
					}
				}}>Upload File(s)</UploadButton>
			<PreviewContainer>
				<UploadPreview/>
			</PreviewContainer>
		</Uploady>
	);
};

ThirdTutorial.description = "Upload files with additional params and headers";

const UploadButtonWithDoneMessage = () => {
	const [finished, setFinished] = useState([]);

	useItemFinishListener((item) => {
		setFinished((finished) =>
		finished.concat(`${item.file.name} (${item.file.size})`));
	});

	return (
		<>
			<UploadButton>Upload File(s)</UploadButton>
			<ul>
				{finished.map((name) =>
					<li key={name}>finished: {name}</li>)}
			</ul>
		</>
	);
};

export const FourthTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
			>
			<UploadButtonWithDoneMessage />
		</Uploady>
	)
};

FourthTutorial.description = "Using Uploady's event hooks - Item Finish";

export default {
	title: "Welcome to Uploady",
};
