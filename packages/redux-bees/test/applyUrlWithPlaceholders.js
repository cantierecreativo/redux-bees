import test from 'tape';
import applyUrlWithPlaceholders from '../src/applyUrlWithPlaceholders';

test('applyUrlWithPlaceholders', (t) => {

  t.equal(
    applyUrlWithPlaceholders(
      '/posts/:id',
      {
        id: 12,
        'page[offset]': 10,
      }
    ),
    '/posts/12?page%5Boffset%5D=10'
  );

  t.equal(
    applyUrlWithPlaceholders(
      '/posts/:id',
      {
        id: 12,
      }
    ),
    '/posts/12'
  );

  t.end();
});


