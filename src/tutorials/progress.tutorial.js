import React, { useState } from "react";
import styled from "styled-components";
import Uploady, {
	useItemProgressListener,
	useItemFinishListener, useItemStartListener,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { Circle } from "rc-progress";

const UploadStatus = styled.p`
  font-size: 20px;
`;

const TextualItemProgress = () => {
	const [status, setStatus] = useState("Pending");

	useItemProgressListener((item) => {
		setStatus(() => `${item.completed}%`);
	});

	useItemFinishListener(() => {
		setStatus("Finished");
	});

	return <UploadStatus>Upload Status: {status}</UploadStatus>;
};

export const FirstTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
		>
			<UploadButton>Upload File(s)</UploadButton>
			<TextualItemProgress/>
		</Uploady>
	);
};

FirstTutorial.description = "Textual item upload progress";

const StyledCircle = styled(Circle)`
  width: 90px;
  height: 90px;
  margin-top: 20px;
`;

const VisualItemProgress = () => {
	const [progress, setProgress] = useState(0);

	useItemStartListener(() => {
		setProgress(() => 1);
	});

	useItemProgressListener((item) => {
		setProgress(() => item.completed);
	});

	return progress ?
		<StyledCircle
			strokeWidth={8}
			percent={progress}
			gapPosition="top"
			gapDegree={20}
			trailColor="rgb(175,180,176)"
			strokeColor={{
				"0%": "rgba(31,104,132,0.95)",
				"100%": "rgba(2,32,53,1)",
			}}
		/> :
		<UploadStatus>Pending</UploadStatus>;
};

export const SecondTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
		>
			<UploadButton>Upload File(s)</UploadButton>
			<VisualItemProgress/>
		</Uploady>
	);
};

SecondTutorial.description = "Visual item upload progress";

export default {
	title: "Tutorials/1. Basics/3. Upload Progress",
};


