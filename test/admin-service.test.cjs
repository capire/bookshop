const assert = require('node:assert/strict')
const path = require('node:path')
const cds = require('@sap/cds')
const express = require('express')

let server, db, url

beforeAll(async () => {
  const model = await cds.load(path.join(__dirname, '../srv/admin-service.cds'))
  cds.model = cds.compile.for.nodejs(model)
  db = await cds.deploy(model).to('sqlite::memory:')
  const app = express()
  await cds.serve('AdminService').from(model).to('hcql').in(app)
  server = await new Promise(resolve => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance))
  })
  url = `http://127.0.0.1:${server.address().port}/hcql/admin`
})

beforeEach(async () => {
  await db.run(cds.ql.DELETE.from('sap.capire.bookshop.Books'))
  await db.run(cds.ql.DELETE.from('sap.capire.bookshop.Authors'))
})

afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve))
  if (db) await db.disconnect()
})

async function post(cql) {
  const response = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: cql
  })
  assert.ok(response.ok, await response.clone().text())
  const result = await response.json()
  assert.ok(!result.errors, JSON.stringify(result))
  return result
}

async function authors() {
  const result = await post('SELECT from Authors { ID, name } order by name')
  return result.data
}

function assertGeneratedIDs(entries) {
  assert.ok(entries.every(entry => Number.isInteger(entry.ID)))
  assert.equal(new Set(entries.map(entry => entry.ID)).size, entries.length)
}

test('generates an ID for a single entry without overwriting existing authors', async () => {
  await post("INSERT into Authors { ID: 170, name: 'Existing Author' }")
  await post("INSERT into Authors { name: 'Single Author' }")
  const entries = await authors()
  assert.equal(entries.length, 2)
  assertGeneratedIDs(entries)
  assert.equal(entries.find(entry => entry.name === 'Existing Author').ID, 170)
  assert.ok(entries.some(entry => entry.name === 'Single Author'))
})

test('generates distinct IDs for bulk entries and persists their books', async () => {
  await post(`INSERT into Authors
    { name: 'First Author', books: [{ title: 'First Book' }] },
    { name: 'Second Author', books: [{ title: 'Second Book' }] }`)
  const entries = await authors()
  assert.equal(entries.length, 2)
  assertGeneratedIDs(entries)
  const result = await post('SELECT from Authors { name, books { title } } order by name')
  assert.deepEqual(result.data, [
    { name: 'First Author', books: [{ title: 'First Book' }] },
    { name: 'Second Author', books: [{ title: 'Second Book' }] }
  ])
})

test('preserves explicit IDs, including zero', async () => {
  await post(`INSERT into Authors
    { ID: 0, name: 'First Author' }, { ID: 200, name: 'Second Author' }`)
  assert.deepEqual(await authors(), [
    { ID: 0, name: 'First Author' }, { ID: 200, name: 'Second Author' }
  ])
})

test('avoids explicit IDs when generating IDs in a mixed batch', async () => {
  await post("INSERT into Authors { ID: 170, name: 'Existing Author' }")
  await post(`INSERT into Authors
    { name: 'Generated Author A' }, { ID: 171, name: 'Explicit Author A' },
    { ID: 300, name: 'Explicit Author B' }, { name: 'Generated Author B' }`)
  const entries = await authors()
  assert.equal(entries.length, 5)
  assertGeneratedIDs(entries)
  assert.equal(entries.find(entry => entry.name === 'Existing Author').ID, 170)
  assert.equal(entries.find(entry => entry.name === 'Explicit Author A').ID, 171)
  assert.equal(entries.find(entry => entry.name === 'Explicit Author B').ID, 300)
  assert.ok(entries.some(entry => entry.name === 'Generated Author A'))
  assert.ok(entries.some(entry => entry.name === 'Generated Author B'))
})

test('generates IDs when the table is empty', async () => {
  assert.deepEqual(await authors(), [])
  await post(`INSERT into Authors
    { name: 'First Author' }, { name: 'Second Author' }`)
  const entries = await authors()
  assert.equal(entries.length, 2)
  assertGeneratedIDs(entries)
  assert.deepEqual(entries.map(entry => entry.name), ['First Author', 'Second Author'])
})

test('HCQL bulk deep insert links books to each author', async () => {
  await post(`INSERT into Authors
    { name: 'Bulk Regression A', books: [{ title: 'A1' }, { title: 'A2' }, { title: 'A3' }] },
    { name: 'Bulk Regression B', books: [{ title: 'B1' }, { title: 'B2' }, { title: 'B3' },
      { title: 'B4' }, { title: 'B5' }, { title: 'B6' }, { title: 'B7' }] }`)
  const entries = await authors()
  assert.equal(entries.length, 2)
  assertGeneratedIDs(entries)
  const result = await post('SELECT from Authors { name, books { title } } order by name')
  assert.deepEqual(result.data.map(entry => ({
    name: entry.name, titles: entry.books.map(book => book.title).sort()
  })), [
    { name: 'Bulk Regression A', titles: ['A1', 'A2', 'A3'] },
    { name: 'Bulk Regression B', titles: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'] }
  ])
})
