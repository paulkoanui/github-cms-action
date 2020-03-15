const fs = require('fs')
  , fm = require('front-matter')

test('When NO front matter, attributes is empty', () => {
  expect(getContent('./no-front-matter.md')).resolves.toMatchObject({
    attributes: {},
    body: expect.any(String)
  })
})
test('When ONLY front matter, body is empty', () => {
  expect(getContent('./no-body.md')).resolves.toMatchObject({
    attributes: expect.any(Object),
    body: ''
  })
})
test('Has body and front matter', () => {
  expect(getContent('./the-movies-project.md')).resolves.toMatchObject({
    attributes: expect.any(Object),
    body: expect.any(String)
  })
})

function getContent(filename){
  return new Promise((resolve, reject) => {
    fs.readFile(`./${filename}`, 'utf8', function(err, data){
      if (err) return reject(err)
      resolve(fm(data))
    })
  })
}
