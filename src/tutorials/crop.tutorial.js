import React, { memo, useCallback, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Uploady, {
	useBatchAddListener,
	useBatchProgressListener,
	useBatchFinalizeListener,
	useItemProgressListener,
	useItemFinalizeListener,

	withRequestPreSendUpdate,
	withBatchStartUpdate,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import UploadPreview from "@rpldy/upload-preview";
import Cropper from "react-cropper";
import { Line } from "rc-progress";
import UploadCropper from "../components/UploadCropper";

const PreviewImage = styled.img`
  margin: 5px;
  max-width: 600px;
  max-height: 400px;
  height: auto;
`;

const SingleCropContainer = styled.div`
  width: 600px;
`;

const StyledCropper = styled(Cropper)`
  width: 100%;
  max-height: 400px;
  height: auto;
  margin: 20px 0;
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
	const { completed, state: itemState } = useItemProgressListener(id) || { completed: 0 };

	return (show || itemState === "uploading") &&
		<UploadProgress progress={completed}/>;
});

const ItemPreviewWithCrop = withRequestPreSendUpdate((props) => {
	const {
		id,
		url,
		updateRequest,
		requestData,
	} = props;

	const cropperRef = useRef(null);
	const [isCropped, setCropped] = useState(null);
	const [croppedImg, setCroppedImg] = useState(null);

	const onCropEnd = () => {
		setCropped(true);
	};

	const onUpload = useCallback(() => {
		const cropper = cropperRef.current.cropper;

		cropper
			.getCroppedCanvas()
			.toBlob((blob) => {
				requestData.items[0].file = blob;
				updateRequest({ items: requestData.items });
			}, requestData.items[0].file.type);

		setCroppedImg(cropper.getCroppedCanvas().toDataURL());
	}, [requestData, updateRequest]);

	return (<SingleCropContainer>
		{!croppedImg ? (
			<StyledCropper
				src={url}
				initialAspectRatio={16 / 9}
				autoCrop={false}
				cropend={onCropEnd}
				ref={cropperRef}
			/>
		) : (
			<PreviewImage src={croppedImg} alt="cropped img to upload"/>
		)}

		{isCropped && !croppedImg ?
			<button onClick={onUpload}>Upload Selection</button> : null}

		{isCropped && <ItemUploadProgress id={id}/>}
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

const ItemPreviewThumb = ({ id, url, onPreviewSelected, isCroppedSet, isFinished, isUploading }) => {
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
		</ItemPreviewContainer>);
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

	console.log("!!! RENDERING CROPPER FOR MULTICROP", {
		isCropped,
		croppingRef,
	});

	const onSaveCrop = async () => {
		const cropped = await croppingRef.current.cropImage();
		setCropForItem(item.id, cropped);
	};

	const onUnsetCrop = () => {
		croppingRef.current.removeCrop();
	};

	return (<CropperContainer>
		<UploadCropper
			ref={croppingRef}
			url={url}
			type={item.file.type}
			setCropped={setIsCropped}
		/>

		<button onClick={onSaveCrop}>Set Crop</button>
		<button onClick={onUnsetCrop}>Unset Crop</button>
	</CropperContainer>);
};

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

const BatchCrop = withBatchStartUpdate((props) => {
	const { id, updateRequest, requestData, isUploadInProgress } = props;
	const [selected, setSelected] = useState({ url: null, id: null });
	const [finishedItems, setFinishedItems] = useState([]);
	const [cropped, setCropped] = useState({});
	const hasData = !!(id && requestData);
	const selectedItem = !!selected && requestData?.items.find(({ id }) => id === selected.id);

	const setCropForItem = (id, data) => {
		setCropped((cropped) => ({ ...cropped, [id]: data }));
	};

	const onUploadAll = () => {
		if (updateRequest) {
			const readyItems = requestData.items
				.map((item) => {
					item.file = cropped[item.id] || item.file;
					return item;
				});

			updateRequest({ items: readyItems });
		}
	};

	useItemFinalizeListener(({ id }) => {
		setFinishedItems((finished) => finished.concat(id));
	});

	const getPreviewCompProps = useCallback((item) => {
		return ({
			onPreviewSelected: setSelected,
			isCroppedSet: cropped[item.id],
			isFinished: !!~finishedItems.indexOf(item.id),
			isUploading: isUploadInProgress
		});
	}, [cropped, setSelected, finishedItems, isUploadInProgress]);

	return (<MultiCropContainer>
		{hasData && !isUploadInProgress &&
			<button onClick={onUploadAll} id="upload-all-btn">Upload All</button>}

		<PreviewsContainer>
			<UploadPreview
				rememberPreviousBatches
				PreviewComponent={ItemPreviewThumb}
				previewComponentProps={getPreviewCompProps}
			/>
		</PreviewsContainer>
		{selectedItem && hasData && !isUploadInProgress &&
			<CropperForMultiCrop
				{...selected}
				item={selectedItem}
				setCropForItem={setCropForItem}
			/>}
	</MultiCropContainer>);
});

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    max-width: 300px;
  }
`;

const MultiCropQueue = () => {
	const [currentBatchId, setCurrentBatch] = useState(null);

	useBatchAddListener(({ id }) => setCurrentBatch(id));
	useBatchFinalizeListener(() => setCurrentBatch(null));

	const {
		id: inProgressId,
		completed: batchProgress,
	} = useBatchProgressListener(currentBatchId) || { };

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
