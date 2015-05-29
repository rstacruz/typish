nom := ./node_modules/.bin
sass := compile_sass() { echo "  $$1 -> $$2"; echo "@import 'typish.scss'; $$1" | ${nom}/node-sass --output-style compact | grep "$$2" >/dev/null; }; compile_sass

test: test-js test-sass

test-js: node_modules
	${nom}/mocha

README.md: index.js node_modules
	${nom}/mdextract -u README.md

test-sass: node_modules typish.scss
	@${sass} "@include typish-keyframes;" "10% { opacity: 1; }"
	@${sass} "@include typish-keyframes;" "40% { opacity: 1; }"
	@${sass} "@include typish-keyframes;" "50% { opacity: 0; }"
	@${sass} "@include typish-keyframes(\$$fade: 5%);" "5% { opacity: 1; }"
	@${sass} "@include typish-keyframes(\$$fade: 5%);" "35% { opacity: 1; }"
	@${sass} "@include typish-keyframes(\$$fade: 5%);" "40% { opacity: 0; }"
	@${sass} ".x { @include typish-code; }" "white-space: pre-wrap"
	@${sass} ".x { @include typish-code; }" "white-space: pre-wrap"
	@${sass} ".x { @include typish-cursor; }" ".x:after"
	@${sass} ".x { @include typish-cursor; }" " animation: typish-blink 500ms linear infinite"
	@${sass} ".x { @include typish-cursor; }" " -webkit-animation:"
	@${sass} ".x { @include typish-cursor(\$$color: #c0ffe3); }" "background: #c0ffe3"
	@${sass} ".x { @include typish-cursor(\$$top: 3px); }" "top: 3px"
	@${sass} ".x { @include typish-cursor(\$$speed: 890ms); }" "animation: typish-blink 890ms linear"
	@${sass} ".x { @include typish-cursor(\$$blinkontype: false); }" ".-typish-typing:after"

node_modules:
	if [ ! -d node_modules ]; then npm install; fi

.PHONY: test
