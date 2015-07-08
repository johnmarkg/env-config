include node_modules/make-lint/index.mk


MOCHA=./node_modules/.bin/_mocha
REPORTER = spec

test: lint;
	$(MOCHA) \
		--reporter $(REPORTER)

test-w: 
	nodemon -V -w ./  --exec "make test"

.PHONY: test test-w		