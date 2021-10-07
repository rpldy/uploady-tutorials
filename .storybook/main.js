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
  ]
}
