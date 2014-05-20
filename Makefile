MOCHA_OPTS = --check-leaks
MOCHA_REPORTER = spec
SPECS = `find . -name *.specs.js`

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		--check-leaks \
		$(MOCHA_OPTS) \
		./test/setup.js $(SPECS)

cover:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover -x $(SPECS) ./node_modules/.bin/_mocha -- \
		--reporter $(MOCHA_REPORTER) \
		--check-leaks \
		$(MOCHA_OPTS) \
		./test/setup.js $(SPECS)
	open coverage/lcov-report/index.html

bench:
	@NODE_ENV=bench node perf/encode.js
	@NODE_ENV=bench node perf/decode.js
	@echo '* Note that JSON is provided as an indicative comparison only as it doesn't correctly encode all values'

.PHONY: test cover bench
