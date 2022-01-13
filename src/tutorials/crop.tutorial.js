import React, { memo, useCallback, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Uploady, {
	useBatchAddListener,
	useBatchFinalizeListener,
	useBatchProgressListener,
	useItemFinalizeListener,
	useItemProgressListener,
	withBatchStartUpdate,
	withRequestPreSendUpdate,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import UploadPreview from "@rpldy/upload-preview";
import { Line } from "rc-progress";
import UploadCropper from "../components/UploadCropper";

const SingleCropContainer = styled.div`
    width: 600px;
    display: flex;  
    flex-direction: column;
    align-items: center;
`;

const PreviewImage = styled.img`
  margin: 5px;
  max-width: 600px;
  max-height: 400px;
  height: auto;
`;

const StyledProgressLine = styled(Line)`
  width: 100%;
  margin: 10px 0;
`;

const UploadProgress = ({ progress }) => {
	return <StyledProgressLine
		strokeWidth={1}
		percent={progress}
		trailColor={"rgba(54,56,56)"}
		strokeColor={"rgb(41,117,169)"}
	/>;
};

const ItemUploadProgress = memo(({ id, show = false }) => {
	const { completed: progress, state: itemState } =
		useItemProgressListener(id) || { completed: 0 };

	return (show || itemState === "uploading") &&
		<UploadProgress progress={progress} />;
});

const ItemPreviewWithCrop = withRequestPreSendUpdate(({
	id,
	url,
	type,
	name,
	updateRequest,
	requestData,
}) => {
	const croppingRef = useRef(null);
	const [isCropped, setCropped] = useState(null);
	const [croppedImg, setCroppedImg] = useState(null);

	const onUpload = useCallback(async () => {
		requestData.items[0].file = await croppingRef.current.cropImage();
		updateRequest({ items: requestData.items });
		setCroppedImg(croppingRef.current.getDataUrl());
	}, [requestData, updateRequest]);

	return (<SingleCropContainer>
		{!croppedImg ?
			<UploadCropper
				ref={croppingRef}
				url={url}
				type={type}
				name={name}
				setCropped={setCropped}
			/> :
			<PreviewImage src={croppedImg} alt="cropped img to upload" />
		}

		{isCropped && !croppedImg ?
			<button onClick={onUpload}>Upload selection</button> : null}

		{isCropped && <ItemUploadProgress id={id} />}
	</SingleCropContainer>);
});

export const FirstTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
		multiple={false}
	>
		<UploadButton>Select File</UploadButton>
		<UploadPreview
			PreviewComponent={ItemPreviewWithCrop}
			/>
	</Uploady>);
};

FirstTutorial.description = "Crop single image before uploading";


const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    max-width: 300px;
  }
`;

const MultiCropContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PreviewsContainer = styled.div`
  display: flex;
  margin: 20px 0;
	width: 100%;
	justify-content: center;
`;

const ItemPreviewContainer = styled.div`
	width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
	
	${StyledProgressLine} {
		margin-top: 6px;
	}
`;

const dotCss = css`
  &:before {
    content: "";
    width: 12px;
    height: 12px;
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #3fbdce;
    border: 1px solid #eeeeee;
    border-radius: 100%;
  }
`;

const ItemPreviewImgWrapper = styled.div`
  width: auto;
  max-height: 120px;
  position: relative;
  cursor: ${({ $isClickable }) => $isClickable ? "pointer" : "default"};
  display: flex;
  justify-content: center;
	
  ${({ $isCropped }) => $isCropped ? dotCss : ""}
`;

const ItemPreviewImg = styled.img`
  max-height: 100%;
  max-width: 100%;

  transition: box-shadow 0.5s;

  &:hover {
    box-shadow: 0 0 1px 2px #222222;
  }
`;

const ItemPreviewThumb =
	({
		 id,
		 url,
		 onPreviewSelected,
		 isCroppedSet,
		 isFinished,
		 isUploading,
	 }) => {
		const isClickable = !isFinished && !isUploading;

		const onPreviewClick = () => {
			if (isClickable) {
				onPreviewSelected({ id, url });
			}
		};

		return (
			<ItemPreviewContainer>
				<ItemPreviewImgWrapper
					$isCropped={isCroppedSet}
					$isClickable={isClickable}
				>
					<ItemPreviewImg
						onClick={onPreviewClick}
						src={url}
						/>
				</ItemPreviewImgWrapper>
				<ItemUploadProgress id={id} show />
			</ItemPreviewContainer>
		);
	};

const CropperContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  align-items: center;
`;

const CropperForMultiCrop = ({ item, url, setCropForItem }) => {
	const [isCropped, setIsCropped] = useState(false);
	const croppingRef = useRef(null);

	const onSaveCrop = async () => {
		const cropped = await croppingRef.current.cropImage();
		setCropForItem(item.id, cropped);
	};

	const onUnsetCrop = () => {
		croppingRef.current.removeCrop();
		setCropForItem(item.id, null);
	};

	return (<CropperContainer>
		<UploadCropper
			ref={croppingRef}
			url={url}
			type={item.file.type}
			name={item.file.name}
			setCropped={setIsCropped}
			/>

		<button onClick={onSaveCrop}>Set Crop</button>
		<button onClick={onUnsetCrop}>Unset Crop</button>
	</CropperContainer>);
};

const BatchCrop = withBatchStartUpdate((
	{
		id,
		updateRequest,
		requestData,
		isUploadingInProgress
	}) => {

	const [selected, setSelected] = useState({ url: null, id: null});
	const [finishedItems, setFinishedItems] = useState([]);
	const [cropped, setCropped] = useState({});
	const hasData = !!(id && requestData);
	const selectedItem = !!selected &&
		requestData?.items.find(({ id }) => id === selected.id);

	useItemFinalizeListener(({ id }) => {
		setFinishedItems((finished) => finished.concat(id));
	});

	const getPreviewCompProps = useCallback((item) => ({
		onPreviewSelected: setSelected,
		isCroppedSet: !!cropped[item.id],
		isFinished: finishedItems.includes(item.id),
		isUploading: isUploadingInProgress,
	}), [cropped, setSelected, finishedItems, isUploadingInProgress]);

	const onUploadAll = () => {
		const readyItems = requestData.items
			.map((item) => {
				item.file = cropped[item.id] || item.file;
				return item;
			});

		updateRequest({ items: readyItems });
	};

	const setCropForItem = (id, data) => {
		setCropped((cropped) => ({ ...cropped, [id]: data }));
	};

	return (
		<MultiCropContainer>
			{hasData && !isUploadingInProgress &&
			<button onClick={onUploadAll}>Upload All</button>}

			<PreviewsContainer>
				<UploadPreview
					rememberPreviousBatches
					PreviewComponent={ItemPreviewThumb}
					previewComponentProps={getPreviewCompProps} />
			</PreviewsContainer>

			{selectedItem && hasData && !isUploadingInProgress &&
				<CropperForMultiCrop
					{...selected}
					item={selectedItem}
					setCropForItem={setCropForItem}
				/>}
		</MultiCropContainer>
	);
});

const MultiCropQueue = () => {
	const [currentBatchId, setCurrentBatch] = useState(null);

	useBatchAddListener(({ id }) => setCurrentBatch(id));
	useBatchFinalizeListener(() => setCurrentBatch(null));

	const {
		id: inProgressId,
		completed: batchProgress
	} = useBatchProgressListener(currentBatchId) || {};

	const isInProgress = !!inProgressId && inProgressId === currentBatchId;

	return (
		<QueueContainer>
			{!!currentBatchId &&
			<UploadProgress progress={isInProgress ? batchProgress : 0}/>}

			{!currentBatchId &&
			<UploadButton>Select Files</UploadButton>}

			<BatchCrop
				id={currentBatchId}
				isUploadInProgress={isInProgress}
				/>
		</QueueContainer>
	);
};

export const SecondTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<MultiCropQueue/>
	</Uploady>);
};

SecondTutorial.description = "Crop multiple images before uploading";

export default {
	title: "Tutorials/3. Advanced/1. Crop",
};
