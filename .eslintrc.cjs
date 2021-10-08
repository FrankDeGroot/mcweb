module.exports = {
	'env': {
		'es2021': true,
		'node': true
	},
	'overrides': [
		{
			'files': [
				'web/**/*.js'
			],
			'env': {
				'browser': true,
				'node': false
			},
			'globals': {
				'io': true,
				'uhtml': true
			}
		}
	],
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 13,
		'sourceType': 'module'
	},
	'rules': {
		'array-bracket-newline': 'off',
		'array-bracket-spacing': [
			'error',
			'never'
		],
		'array-callback-return': 'error',
		'array-element-newline': 'off',
		'arrow-body-style': 'off',
		'arrow-parens': [
			'error',
			'as-needed'
		],
		'arrow-spacing': [
			'error',
			{
				'after': true,
				'before': true
			}
		],
		'block-scoped-var': 'error',
		'block-spacing': [
			'error',
			'always'
		],
		'brace-style': [
			'error',
			'1tbs',
			{
				'allowSingleLine': true
			}
		],
		'camelcase': 'error',
		'capitalized-comments': [
			'error',
			'always'
		],
		'class-methods-use-this': 'off',
		'comma-dangle': 'off',
		'comma-spacing': [
			'error',
			{
				'after': true,
				'before': false
			}
		],
		'comma-style': [
			'error',
			'last'
		],
		'complexity': 'error',
		'computed-property-spacing': [
			'error',
			'never'
		],
		'consistent-return': 'off',
		'consistent-this': 'error',
		'curly': 'off',
		'default-case': 'off',
		'default-case-last': 'error',
		'default-param-last': 'error',
		'dot-location': [
			'error',
			'property'
		],
		'dot-notation': 'error',
		'eol-last': 'error',
		'eqeqeq': 'off',
		'func-call-spacing': 'error',
		'func-name-matching': 'error',
		'func-names': 'error',
		'func-style': [
			'error',
			'declaration',
			{
				'allowArrowFunctions': true
			}
		],
		'function-paren-newline': 'error',
		'generator-star-spacing': 'error',
		'grouped-accessor-pairs': 'error',
		'guard-for-in': 'error',
		'id-denylist': 'error',
		'id-length': 'off',
		'id-match': 'error',
		'implicit-arrow-linebreak': 'off',
		'indent': 'off',
		'init-declarations': 'error',
		'jsx-quotes': 'error',
		'key-spacing': 'error',
		'keyword-spacing': [
			'error',
			{
				'after': true,
				'before': true
			}
		],
		'line-comment-position': 'error',
		'linebreak-style': [
			'error',
			'unix'
		],
		'lines-around-comment': 'error',
		'lines-between-class-members': 'off',
		'max-classes-per-file': 'error',
		'max-depth': 'error',
		'max-len': 'off',
		'max-lines': 'error',
		'max-lines-per-function': 'off',
		'max-nested-callbacks': 'error',
		'max-params': 'error',
		'max-statements': 'off',
		'max-statements-per-line': 'error',
		'multiline-comment-style': 'error',
		'multiline-ternary': [
			'error',
			'always-multiline'
		],
		'new-cap': 'error',
		'new-parens': 'error',
		'newline-per-chained-call': 'error',
		'no-alert': 'error',
		'no-array-constructor': 'error',
		'no-await-in-loop': 'error',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-confusing-arrow': 'off',
		'no-console': 'off',
		'no-constructor-return': 'error',
		'no-continue': 'error',
		'no-div-regex': 'off',
		'no-duplicate-imports': 'error',
		'no-else-return': 'error',
		'no-empty-function': 'off',
		'no-eq-null': 'error',
		'no-eval': 'error',
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-extra-label': 'error',
		'no-extra-parens': 'off',
		'no-floating-decimal': 'error',
		'no-implicit-globals': 'error',
		'no-implied-eval': 'error',
		'no-inline-comments': 'error',
		'no-invalid-this': [
			'error',
			{
				'capIsConstructor': true
			}
		],
		'no-iterator': 'error',
		'no-label-var': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-lonely-if': 'error',
		'no-loop-func': 'error',
		'no-magic-numbers': 'off',
		'no-mixed-operators': 'error',
		'no-multi-assign': 'error',
		'no-multi-spaces': 'error',
		'no-multi-str': 'error',
		'no-multiple-empty-lines': 'error',
		'no-negated-condition': 'off',
		'no-nested-ternary': 'off',
		'no-new': 'error',
		'no-new-func': 'error',
		'no-new-object': 'error',
		'no-new-wrappers': 'error',
		'no-octal-escape': 'error',
		'no-param-reassign': 'error',
		'no-plusplus': 'error',
		'no-promise-executor-return': 'off',
		'no-proto': 'error',
		'no-restricted-exports': 'error',
		'no-restricted-globals': 'error',
		'no-restricted-imports': 'error',
		'no-restricted-properties': 'error',
		'no-restricted-syntax': 'error',
		'no-return-assign': 'error',
		'no-return-await': 'off',
		'no-script-url': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-shadow': 'off',
		'no-tabs': [
			'error',
			{
				'allowIndentationTabs': true
			}
		],
		'no-template-curly-in-string': 'error',
		'no-ternary': 'off',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-undef-init': 'error',
		'no-undefined': 'off',
		'no-underscore-dangle': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unneeded-ternary': 'error',
		'no-unreachable-loop': 'error',
		'no-unused-expressions': 'error',
		'no-unused-private-class-members': 'off',
		'no-use-before-define': 'off',
		'no-useless-call': 'error',
		'no-useless-computed-key': 'error',
		'no-useless-concat': 'error',
		'no-useless-constructor': 'error',
		'no-useless-rename': 'error',
		'no-useless-return': 'off',
		'no-var': 'error',
		'no-void': 'error',
		'no-warning-comments': 'error',
		'no-whitespace-before-property': 'error',
		'nonblock-statement-body-position': 'error',
		'object-curly-newline': 'error',
		'object-curly-spacing': [
			'error',
			'always'
		],
		'object-shorthand': 'off',
		'one-var': 'off',
		'one-var-declaration-per-line': 'error',
		'operator-assignment': 'error',
		'operator-linebreak': [
			'error',
			null
		],
		'padded-blocks': 'off',
		'padding-line-between-statements': 'error',
		'prefer-arrow-callback': 'error',
		'prefer-const': 'error',
		'prefer-destructuring': 'off',
		'prefer-exponentiation-operator': 'error',
		'prefer-named-capture-group': 'error',
		'prefer-numeric-literals': 'error',
		'prefer-object-spread': 'error',
		'prefer-promise-reject-errors': [
			'error',
			{
				'allowEmptyReject': true
			}
		],
		'prefer-regex-literals': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'prefer-template': 'off',
		'quote-props': 'off',
		'quotes': [
			'error',
			'single'
		],
		'radix': [
			'error',
			'always'
		],
		'require-atomic-updates': 'error',
		'require-await': 'off',
		'require-unicode-regexp': 'off',
		'rest-spread-spacing': [
			'error',
			'never'
		],
		'semi': 'off',
		'semi-spacing': 'error',
		'semi-style': 'error',
		'sort-keys': 'off',
		'sort-vars': 'error',
		'space-before-blocks': 'error',
		'space-before-function-paren': 'off',
		'space-in-parens': [
			'error',
			'never'
		],
		'space-infix-ops': 'error',
		'space-unary-ops': 'error',
		'spaced-comment': [
			'error',
			'always'
		],
		'strict': 'error',
		'switch-colon-spacing': [
			'error',
			{
				'after': true,
				'before': false
			}
		],
		'symbol-description': 'error',
		'template-curly-spacing': [
			'error',
			'never'
		],
		'template-tag-spacing': [
			'error',
			'never'
		],
		'unicode-bom': [
			'error',
			'never'
		],
		'vars-on-top': 'error',
		'wrap-iife': 'error',
		'wrap-regex': 'error',
		'yield-star-spacing': 'error',
		'yoda': [
			'error',
			'never'
		]
	}
};
