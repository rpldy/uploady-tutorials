import React from "react";
import UploadyDecorator from "./UploadyDecorator";

export const parameters = {
	backgrounds: { disable: true },
	viewport: { disable: true },
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [UploadyDecorator];
