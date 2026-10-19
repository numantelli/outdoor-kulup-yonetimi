import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HIKES, STORAGE_KEY, normalizePhone, validateRegistration, readRecords } from '../src/registrations.js';
// Tamamı yapay test verisidir; uygulama başlangıçta boş açılır.
const values = { firstName: 'Örnek', lastName: 'Katılımcı', phone: '0500 000 00 00', service: 'Servis 1' };
const hike = HIKES[0].id;
test('Telefonun yerel ve uluslararası yazımları aynı numaraya dönüşür', () => {
  for (const phone of ['05000000000', '5000000000', '+90 (500) 000-00-00', '0090 500 000 00 00']) assert.equal(normalizePhone(phone), '5000000000');
  for (const phone of ['abc5000000000', '123', '02120000000', '500/0000000']) assert.equal(normalizePhone(phone), null);
});
test('Aynı yürüyüşte aynı telefon farklı servisle bile tekrar kaydolamaz', () => {
  const record = validateRegistration([], hike, values);
  assert.throws(() => validateRegistration([record], hike, { ...values, phone: '+90 500 000 00 00', service: 'Servis 2' }), /zaten kayıtlı/);
  assert.doesNotThrow(() => validateRegistration([record], HIKES[1].id, values));
});
test('20. koltuk kabul edilir, 21. reddedilir; diğer servis ve yürüyüş etkilenmez', () => {
  const records = [];
  for (let index = 0; index < 20; index++) records.push(validateRegistration(records, hike, { ...values, phone: String(5000000000 + index) }));
  assert.equal(records.length, 20);
  assert.throws(() => validateRegistration(records, hike, { ...values, phone: '5000000020' }), /servis dolu/);
  assert.doesNotThrow(() => validateRegistration(records, hike, { ...values, phone: '5000000020', service: 'Servis 2' }));
  assert.doesNotThrow(() => validateRegistration(records, HIKES[1].id, values));
});
test('Boş ad, geçersiz telefon, servis ve yürüyüş reddedilir', () => {
  for (const patch of [{ firstName: ' ' }, { lastName: ' ' }, { firstName: 'a'.repeat(61) }, { phone: '123' }, { service: 'Servis 3' }]) assert.throws(() => validateRegistration([], hike, { ...values, ...patch }));
  assert.throws(() => validateRegistration([], 'bilinmeyen', values));
});
test('Kayıtlar depolamadan geri okunur; bozuk veri sessizce silinmez', () => {
  const record = validateRegistration([], hike, values);
  const data = JSON.stringify([record]);
  assert.deepEqual(readRecords({ getItem: key => { assert.equal(key, STORAGE_KEY); return data; } }), [record]);
  assert.deepEqual(readRecords({ getItem: () => null }), []);
  for (const raw of ['{', '{}', '[null]', JSON.stringify([record, record])]) assert.throws(() => readRecords({ getItem: () => raw }));
  assert.throws(() => readRecords({ getItem: () => { throw new Error('Depolama engelli'); } }));
});
