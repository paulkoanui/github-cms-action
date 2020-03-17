const fs = require('fs')
  , fm = require('front-matter')

describe('Front Matter Tests', () => {
  
  test('When NO front matter, attributes is empty', () => {
    return expect(getContent('./test/front-matter/no-front-matter.md')).resolves.toMatchObject({
      attributes: {},
      body: expect.any(String)
    })
  })
  test('When ONLY front matter, body is empty', () => {
    return expect(getContent('./test/front-matter/no-body.md')).resolves.toMatchObject({
      attributes: expect.any(Object),
      body: ''
    })
  })
  test('Has body and front matter', () => {
    return expect(getContent('./test/front-matter/the-movies-project.md')).resolves.toMatchObject({
      attributes: expect.any(Object),
      body: expect.any(String)
    })
  })
  
})

function getContent(filename){
  return new Promise((resolve, reject) => {
    fs.readFile(`${filename}`, 'utf8', function(err, data){
      if (err) return reject(err)
      resolve(fm(data))
    })
  })
}
