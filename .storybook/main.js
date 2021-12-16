module.exports = {
  "stories": [
	  "../src/tutorials/*.tutorial.js"
  ],
  "addons": [
    "@storybook/addon-links",
	  {
			name: "@storybook/addon-essentials",
		  options: {
	      "docs": false,
		  }
	  },
  ],

	features: {
		postcss: false,
		babelModeV7: true,
		storyStoreV7: true
	},

	core: {
		builder: "webpack5"
	},

	framework: "@storybook/react"
}
