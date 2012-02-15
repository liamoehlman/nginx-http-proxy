REPORTER = list
MOCHA = node_modules/mocha/bin/mocha

test:
	$(MOCHA) --reporter $(REPORTER) test/routes.js

.PHONY: test