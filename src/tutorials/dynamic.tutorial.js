import React from "react";
import Uploady, {
	useRequestPreSend,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

const UploadButtonWithDynamicValues = () => {
	useRequestPreSend(({ items, options }) =>
		Promise.resolve({
			options: {
				params: {
					batchSize: items.length,
					overrideMethod: options.method === "POST" ?
						"PUT" : options.method,
				},
			},
		}));

	return <UploadButton>Upload File(s)</UploadButton>;
};

export const FirstTutorial = () => {
	return (<Uploady
		destination={{ url: process.env.UPLOAD_URL }}
		grouped
		groupSize={3}
	>
		<UploadButtonWithDynamicValues/>
	</Uploady>);
};

FirstTutorial.description = "Set upload params dynamically";

export default {
	title: "Tutorials/2. Intermediate/1. Dynamic Params",
};
