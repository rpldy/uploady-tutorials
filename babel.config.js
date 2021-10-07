const config =  {
    presets: [
        [
            "@babel/env",
            {
//                 // "loose":  true,
//                 "modules": env === "esm" ? false : "commonjs"
            },
        ],
        "@babel/react",
    ],
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-nullish-coalescing-operator",
	      "babel-plugin-styled-components",
        "lodash",
        ["module-resolver", {
            "root": ["./src"],
            // "alias": {}
        }]
    ],
    env: {

        test: {
            plugins: [
                "@babel/plugin-transform-runtime",
            ],
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {
                            node: true,
                        },
                    },
                ],
            ],
        },
    }
};

module.exports = config;

