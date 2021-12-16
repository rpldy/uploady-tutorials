import React, { useState } from "react";
import styled from "styled-components";
import Uploady, {
	useBatchStartListener,
	useBatchProgressListener,
	useItemFinishListener,
	useItemProgressListener,
	useItemStartListener,
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
		setStatus(() => "Finished");
	});

	return (
		<UploadStatus>Upload Status = {status}</UploadStatus>
	);
};

export const FirstTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<UploadButton>Upload File(s)</UploadButton>
		<TextualItemProgress/>
	</Uploady>);
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

	return (
		progress ? <StyledCircle
			strokeWidth={8}
			gapPosition="top"
			gapDegree={20}
			trailColor="rgb(175,180,176)"
			strokeColor={{
				"0%": "rgba(31,104,132,0.95)",
				"100%": "rgba(2,32,53,1)",
			}}
			percent={progress}
		/> : <UploadStatus>Pending</UploadStatus>
	);
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

const StyledCircleWithSize = styled(Circle)`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-top: 20px;
`;

const CircleProgress = ({
	                        progress,
	                        color = {
		                        "0%": "rgba(31,104,132,0.95)",
		                        "100%": "rgba(2,32,53,1)",
	                        },
	                        size = 90,
                        }) => (
	<StyledCircleWithSize
		strokeWidth={8}
		percent={progress}
		gapPosition="top"
		gapDegree={20}
		trailColor="rgb(175,180,176)"
		strokeColor={color}
		$size={size}
	/>
);

const BatchCircleProgress = ({ progress }) =>
	<CircleProgress
		progress={progress}
		color={{
			"0%": "rgba(86,144,79,0.95)",
			"100%": "rgb(11,74,18)",
		}}
		size={120}
	/>;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
`;

const CirclesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: flex-start;
  align-items: center;
  margin-right: 10px;
`;

const VisualItemAndBatchProgress = () => {
	const [batchProgress, setBatchProgress] = useState(0);
	const [itemsProgress, setItemsProgress] = useState({});

	useBatchStartListener(() => {
		setBatchProgress(() => 1);
		setItemsProgress(() => ({}));
	});

	useBatchProgressListener((batch) => {
		setBatchProgress(() => batch.completed);
	});

	useItemStartListener((item) => {
		setItemsProgress((items) =>
			({ ...items, ...{ [item.id]: item.completed } }));
	});

	useItemProgressListener((item) => {
		setItemsProgress((items) =>
			({ ...items, ...{ [item.id]: item.completed } }));
	});

	return (<ProgressContainer>
		<CirclesContainer>
			<BatchCircleProgress progress={batchProgress}/>
		</CirclesContainer>
		<CirclesContainer>
			{Object.entries(itemsProgress)
				.map(([id, progress]) =>
					<CircleProgress key={id} progress={progress}/>)}
		</CirclesContainer>
	</ProgressContainer>);
};

export const ThirdTutorial = () => {
	return (
		<Uploady
			concurrent
			destination={{ url: process.env.UPLOAD_URL }}
		>
			<UploadButton>Upload File(s)</UploadButton>
			<VisualItemAndBatchProgress/>
		</Uploady>
	);
};

ThirdTutorial.description = "Visual item & batch upload progress";

export default {
	title: "Tutorials/1. Basics/3. Upload Progress",
};


