all: regpacked.js

minified.js: index.js
	@sed -e "/DEBUG/d" -e "/\/\//d" -e "s/^ *//" $< | \
	tr -d "\n" | \
	sed -e "s/version 300 es/version 300 es\\\n/g" | \
	npx --quiet terser \
		--mangle toplevel \
		--compress booleans_as_integers,drop_console,ecma=6,passes=3,pure_getters,toplevel,unsafe,unsafe_math \
	> $@

regpacked.js: minified.js
	@npx --quiet regpack $< \
		--crushGainFactor 2 \
		--crushLengthFactor 1 \
		--crushCopiesFactor 1 \
		--withMath 0 \
		--contextType 1 \
		--contextVariableName g \
		--hashWebGLContext 1 \
		--hashAudioContext 1 \
		--wrapInSetInterval 1 \
	> $@

clean:
	@rm minified.js regpacked.js
