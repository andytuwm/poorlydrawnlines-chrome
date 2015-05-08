
    var container = document.querySelector('#container');

    suite('basic', function() {

      test('id generated on creation', function() {
        var e = document.createElement('core-label');
        assert(e.id, 'core-label-0');
      });

      test('id not overwritten if given', function(done) {
        container.innerHTML = '<core-label id="explicit"></core-label>';
        flush(function() {
          assert.deepPropertyVal(container, 'firstChild.id', 'explicit');
          done();
        });
      });

      test('findScope', function() {
        var cl = document.createElement('core-label');
        assert.equal(cl._findScope(), null, 'not attached');

        var d = document.createElement('div');
        container.appendChild(d);
        d.appendChild(cl);
        assert.equal(cl._findScope(), wrap(document), 'attached in light dom');

        d.createShadowRoot();
        d.shadowRoot.appendChild(cl);
        assert.equal(cl._findScope(), d.shadowRoot, 'attached in shadow dom');
      });
    });

    suite('targeting', function() {
      function expectedTarget(targetSel, labelSel, cb) {
        flush(function() {
          flush(function() {
            var targetEl = container.querySelector(targetSel);
            var labelEl = container.querySelector(labelSel);
            assert.ok(targetEl.hasAttribute('aria-labelledby'), 'has aria labelledby');
            assert.equal(targetEl.getAttribute('aria-labelledby'), labelEl.id, 'aria-labelledby points to core-label');
            if (labelEl.hasAttribute('for')) {
              assert.equal(labelEl.for, targetSel, 'for property reflected');
            }
            cb();
          });
        }):
      }

      test('nested target', function(done) {
        container.innerHTML = '<core-label>TEXT <input for></core-label>';
        expectedTarget('core-label > [for]', 'core-label', done);
      });

      test('selected target via tagname', function(done) {
        container.innerHTML = '<core-label for="input">TEXT</core-label><input>'
        expectedTarget('input', 'core-label', done);
      });

      test('selected target via class', function(done) {
        container.innerHTML = '<core-label for=".target">TEXT</core-label><input class="target">'
        expectedTarget('.target', 'core-label', done);
      });

      test('selected target via id', function(done) {
        container.innerHTML = '<core-label for="#target">TEXT</core-label><input id="target">';
        expectedTarget('#target', 'core-label', done);
      });

      test('selected target via attribute', function(done) {
        container.innerHTML = '<core-label for="[target]"></core-label><input target>';
        expectedTarget('[target]', 'core-label', done);
      });
    });

    suite('dynamic targeting', function() {
      var label, one, two;
      suiteSetup(function() {
        container.innerHTML = '<core-label id="label"><input for id="nested"></core-label><input id="one"><input id="two">'
        label = container.querySelector('#label');
        nested = label.querySelector('[for]');
        one = container.querySelector('#one');
        two = container.querySelector('#two');
      });

      test('nested is target', function() {
        assert.equal(nested.getAttribute('aria-labelledby'), label.id);
        assert.notOk(one.hasAttribute('aria-labelledby'));
        assert.notOk(one.hasAttribute('aria-labelledby'));
      });

      test('nested -> #one', function(done) {
        label.for = '#one';
        flush(function() {
          flush(function() {
            assert.equal(one.getAttribute('aria-labelledby'), label.id);
            assert.notOk(two.hasAttribute('aria-labelledby'));
            assert.notOk(nested.hasAttribute('aria-labelledby'));
            done();
          });
        });
      });

      test('#one -> #two', function(done) {
        label.for = '#two';
        flush(function() {
          flush(function() {
            assert.equal(two.getAttribute('aria-labelledby'), label.id);
            assert.notOk(one.hasAttribute('aria-labelledby'));
            assert.notOk(nested.hasAttribute('aria-labelledby'));
            done();
          });
        });
      });

    });

  