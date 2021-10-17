import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import Uploady, {
	useUploady,

	useItemStartListener,
	useItemFinishListener,
	useItemProgressListener,

	useBatchStartListener,
	useBatchFinishListener,
	useBatchProgressListener,
	useBatchAddListener,
	useBatchCancelledListener,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

const UploadButtonWithEvents = () => {
	useBatchAddListener(action("BATCH ADD"));
	useBatchStartListener(action("BATCH START"));
	useBatchProgressListener(action("BATCH PROGRESS"));
	useBatchFinishListener(action("BATCH FINISH"));

	useItemStartListener(action("ITEM START"));
	useItemProgressListener(action("ITEM PROGRESS"));
	useItemFinishListener(action("ITEM FINISH"));

	return (<>
		<UploadButton>Upload File(s)</UploadButton>
	</>);
};

export const FirstTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<UploadButtonWithEvents/>
	</Uploady>);
};

FirstTutorial.description = "show call order of event hooks";

const DisabledDuringUploadButton = () => {
	const [uploading, setUploading] = useState(false);

	useBatchStartListener(() => {
		setUploading(true);
	});

	useBatchFinishListener(() => {
		setUploading(false);
	});

	return <UploadButton extraProps={{ disabled: uploading }}/>;
};

export const SecondTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<DisabledDuringUploadButton/>
	</Uploady>);
};

SecondTutorial.description = "Disable upload button during upload";

const UploadButtonWithCancel = () => {
	useBatchAddListener((batch) => {
		return batch.items.length < 10;
		//return new Promise((resolve) => { resolve(batch.items.length < 10); });
	});

	useBatchStartListener(action("BATCH START"));

	useBatchCancelledListener(action("BATCH CANCEL"));

	return <UploadButton/>;
};

export const ThirdTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<UploadButtonWithCancel/>
	</Uploady>);
};

ThirdTutorial.description = "Cancel upload using useBatchAddListener";

const CustomUploadWithContext = () => {
	const uploady = useUploady();

	const onUpload = () => {
		uploady.showFileUpload({
			params: {
				foo: "bar",
			},
		});
	};

	return <button onClick={onUpload}>My Custom Upload Button</button>;
};

export const FourthTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
	>
		<CustomUploadWithContext/>
	</Uploady>);
};

FourthTutorial.description = "Custom upload button using Uploady Context API";

export default {
	title: "Tutorials/Basics/2. Uploady Hooks",
};
