import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const StyledCropper = styled(Cropper)`
  max-height: 500px;
  margin: 20px 0;
`;

const cropImage = (cropper, type, name) =>
	new Promise((resolve) => {
		cropper
			.getCroppedCanvas()
			.toBlob((blob) => {
				blob.name = name;
				resolve(blob);
			}, type);
	});

const UploadCropper = forwardRef(({ url, type, name }, ref) => {
	const cropperRef = useRef(null);

	useImperativeHandle(ref, () => ({
		cropImage: () => cropImage(cropperRef.current.cropper, type, name),
		removeCrop: () => {
			cropperRef.current.cropper.clear();
		},
	}));

	return <StyledCropper
		src={url}
		initialAspectRatio={16 / 9}
		autoCrop={false}
		background={false}
		modal={false}
		viewMode={1}
		zoomable={false}
		ref={cropperRef}
	/>;
});

export default UploadCropper;
