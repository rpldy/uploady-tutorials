import React from "react";
import TusUploady, {
	useClearResumableStore,
} from "@rpldy/tus-uploady";
import UploadButton from "@rpldy/upload-button";
import ItemProgress from "../components/ItemProgress";

export const FirstTutorial = () => {
	return (
		<TusUploady
			debug
			destination={{ url: "http://localhost:4000/upload" }}
			chunkSize={1e+6}
		>
			<UploadButton>Upload With Resumable</UploadButton>
			<ItemProgress/>
		</TusUploady>);
};

FirstTutorial.description = "Resumable upload with Tus";

export const SecondTutorial = () => {
	return (
		<TusUploady
			debug
			destination={{ url: "http://localhost:4000/upload" }}
			chunkSize={1e+6}
			sendDataOnCreate
			parallel={2}
		>
			<UploadButton>Upload With Resumable</UploadButton>
			<ItemProgress/>
		</TusUploady>);
};

SecondTutorial.description = "Resumable with Tus Creation With Upload"

const ClearResumableButton = () => {
	const clearResumable = useClearResumableStore();

	const onClick = () => {
		clearResumable();
		console.log("store cleared");
	};

	return <button onClick={onClick}>Clear Resumable Store</button>;
};

export const ThirdTutorial = () => {
	return (
		<TusUploady
			debug
			destination={{ url: "http://localhost:4000/upload" }}
			chunkSize={1e+6}
		>
			<UploadButton>Upload With Resumable</UploadButton>
			<ItemProgress/>
			<ClearResumableButton/>
		</TusUploady>);
};

ThirdTutorial.description = "Clear resumable store";

export default {
	title: "Tutorials/2. Intermediate/2. Resumable Uploads",
};
