import React, { useState } from "react";
import styled from "styled-components";
import { Circle } from "rc-progress";
import {
	useItemProgressListener,
	useItemStartListener,
} from "@rpldy/uploady";

const UploadStatus = styled.p`
  font-size: 20px;
`;

const StyledCircle = styled(Circle)`
  width: 90px;
  height: 90px;
  margin-top: 20px;
`;

const ItemProgress = () => {
	const [isStarted, setStarted] = useState(false);

	useItemStartListener(() => {
		setStarted(true);
	});

	const { completed } = useItemProgressListener() || { completed: 0 };

	return (
		(isStarted || completed > 0) ?
			<StyledCircle
				strokeWidth={8}
				gapPosition="top"
				gapDegree={20}
				trailColor="rgb(175,180,176)"
				strokeColor={{
					"0%": "rgba(31,104,132,0.95)",
					"100%": "rgba(2,32,53,1)",
				}}
				percent={completed}
			/> :
			<UploadStatus>Pending</UploadStatus>
	);
};

export default ItemProgress;
