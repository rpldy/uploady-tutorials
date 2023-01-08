import React, { useRef, useState } from "react";
import styled from "styled-components";
import Uploady, {
	useBatchAddListener,
	useBatchStartListener,
	useItemFinishListener,
	useUploady,
} from "@rpldy/uploady";
import UploadPreview, { getUploadPreviewForBatchItemsMethod } from "@rpldy/upload-preview";
import {
	usePasteUpload,
} from "@rpldy/upload-paste";
import { BsCloudUpload } from "react-icons/bs";
import { AiOutlineFile } from "react-icons/ai";
import { GiCheckMark } from "react-icons/gi";
import ItemProgress from "../components/ItemProgress";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 600px;
  width: 300px;
  box-shadow: 0 0 5px 1px #FFF;
  padding: 10px;
  gap: 10px;
`;

const PreviewContainer = styled.div`
  border-bottom: 1px inset #868383;
  flex-grow: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: auto;
  }
`;

const PasteToUploadUi = () => {
	usePasteUpload();

	return (
		<Container>
			<PreviewContainer>
				<UploadPreview/>
			</PreviewContainer>
			<ItemProgress/>
		</Container>
	);
};

export const FirstTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
		>
			<PasteToUploadUi/>
		</Uploady>
	);
};

FirstTutorial.description = "Paste to upload";


const UploadButton = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ada7a7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 100%;

  ${({ $ready }) => $ready ? `
		  background-color: #05d4fd;
		  cursor: pointer;
		  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.6);
	` : null}
`;

const FinishedBadge = styled.div`
  width: 100px;
  height: 100px;
  background-color: #05d4fd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 100%;
`;

const PreviewComponent = ({ isFallback, url, id }) => {
	const [isFinished, setFinished] = useState(false);

	useItemFinishListener(() => {
		setFinished(true);
	}, id);

	return (
		isFinished ?
			<FinishedBadge>
				<GiCheckMark size={80}/>
			</FinishedBadge> :
			(isFallback ?
				<AiOutlineFile size={80}/> :
				<img className="preview-img" src={url}/>)
	);
};

const UploadPreviewOnAdd = getUploadPreviewForBatchItemsMethod(useBatchAddListener);

const PasteContainer = ({ children }) => {
	usePasteUpload();

	return (
		<Container>
			{children}
		</Container>
	);
};

const PastePreviewBeforeUpload = () => {
	const [isReady, setReady] = useState(false);
	const [isUploading, setUploading] = useState(false);
	const { processPending } = useUploady();

	useBatchAddListener(() => {
		setReady(true);
		setUploading(false);
	});

	useBatchStartListener(() => {
		setReady(false);
		setUploading(true);
	});

	return (
		<>
			<PreviewContainer>
				<UploadPreviewOnAdd
					PreviewComponent={PreviewComponent}
				/>
			</PreviewContainer>
			{
				!isUploading &&
				<UploadButton
					onClick={() => isReady && processPending()}
					$ready={isReady}
				>
					<BsCloudUpload size={60}/>
				</UploadButton>
			}
			<ItemProgress/>
		</>);
};

export const SecondTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
			clearPendingOnAdd
			autoUpload={false}
		>
			<PasteContainer>
				<PastePreviewBeforeUpload/>
			</PasteContainer>
		</Uploady>
	);
};

SecondTutorial.description = "Show Pasted item before upload";


const PasteContainerConfined = ({ children }) => {
	const containerRef = useRef(null);
	usePasteUpload({}, containerRef);

	return (
		<Container ref={containerRef}>
			{children}
		</Container>
	);
};

export const ThirdTutorial = () => {
	return (
		<Uploady
			destination={{ url: process.env.UPLOAD_URL }}
			clearPendingOnAdd
			autoUpload={false}
		>
			<PasteContainerConfined>
				<PastePreviewBeforeUpload/>
			</PasteContainerConfined>
		</Uploady>
	);
};

ThirdTutorial.description = "Confine paste to upload to a specific element";

export default {
	title: "Tutorials/2. Intermediate/3. Paste",
};
