export const STORAGE_KEY = 'outdoor-kulup:registrations:v1';
export const CAPACITY = 20;
export const SERVICES = ['Servis 1', 'Servis 2'];
export const HIKES = [
  { id: '2026-10-25-belgrad', date: '2026-10-25', route: 'Belgrad Ormanı · Neşet Suyu', difficulty: 'Kolay', distance: '8 km', duration: '3 saat', description: 'Sonbaharın renkleri arasında, orman yollarında sakin bir pazar yürüyüşü.' },
  { id: '2026-11-01-polenezkoy', date: '2026-11-01', route: 'Polonezköy · Tabiat Parkı', difficulty: 'Orta', distance: '12 km', duration: '4 saat', description: 'Ağaçların gölgesinde, küçük yokuşlar ve bol temiz hava eşliğinde keşif.' },
];
export function normalizePhone(value) {
  let phone = String(value).replace(/[\s()+.-]/g, '');
  if (phone.startsWith('0090')) phone = phone.slice(4);
  else if (phone.startsWith('90') && phone.length === 12) phone = phone.slice(2);
  else if (phone.startsWith('0') && phone.length === 11) phone = phone.slice(1);
  return /^5\d{9}$/.test(phone) ? phone : null;
}
export function validateRegistration(records, hikeId, values) {
  if (!HIKES.some(h => h.id === hikeId)) throw new Error('Yürüyüş bulunamadı.');
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  if (!firstName || !lastName || firstName.length > 60 || lastName.length > 60) throw new Error('Ad ve soyad alanlarını doldurun (en fazla 60 karakter).');
  const phone = normalizePhone(values.phone);
  if (!phone) throw new Error('Geçerli bir Türkiye cep telefonu girin: 05XX XXX XX XX.');
  if (!SERVICES.includes(values.service)) throw new Error('Lütfen bir servis seçin.');
  const current = records.filter(r => r.hikeId === hikeId);
  if (current.some(r => r.phone === phone)) throw new Error('Bu telefon numarası bu yürüyüşe zaten kayıtlı.');
  if (current.filter(r => r.service === values.service).length >= CAPACITY) throw new Error('Seçtiğiniz servis dolu. Diğer servisi seçebilirsiniz.');
  return { hikeId, firstName, lastName, phone, service: values.service };
}
export function readRecords(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Kayıt biçimi geçersiz.');
  const result = [];
  for (const record of data) {
    if (!record || typeof record.firstName !== 'string' || typeof record.lastName !== 'string' || typeof record.phone !== 'string') throw new Error('Kayıt biçimi geçersiz.');
    result.push(validateRegistration(result, record.hikeId, record));
  }
  return result;
}
