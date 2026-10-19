import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CAPACITY, HIKES, SERVICES, STORAGE_KEY, readRecords, validateRegistration } from './registrations';
import './styles.css';

const emptyForm = { firstName: '', lastName: '', phone: '', service: '' };
function App() {
  const [hikeId, setHikeId] = useState(HIKES[0].id);
  const [records, setRecords] = useState(() => { try { return readRecords(localStorage); } catch { return []; } });
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const [storageError, setStorageError] = useState(() => { try { readRecords(localStorage); return false; } catch { return true; } });
  const hike = HIKES.find(h => h.id === hikeId);
  const participants = records.filter(r => r.hikeId === hikeId);
  const date = new Date(`${hike.date}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  function refresh() {
    try { const latest = readRecords(localStorage); setRecords(latest); setStorageError(false); return latest; }
    catch { setStorageError(true); throw new Error('Tarayıcı kayıtları okunamadı. Mevcut veriler korunuyor; depolama ayarlarınızı kontrol edin.'); }
  }
  React.useEffect(() => {
    const sync = event => { if (!event || event.type === 'focus' || event.key === STORAGE_KEY || event.key === null) { try { refresh(); } catch { /* Uyarı ekranda gösterilir. */ } } };
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync); };
  }, []);
  async function submit(event) {
    event.preventDefault();
    const save = () => {
      const latest = refresh();
      const record = validateRegistration(latest, hikeId, form);
      const next = [...latest, record];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch { throw new Error('Kayıt saklanamadı. Tarayıcı depolama iznini veya boş alanını kontrol edin.'); }
      setRecords(next); setForm(emptyForm); setMessage({ type: 'success', text: 'Kaydınız tamamlandı. Patikada görüşmek üzere!' });
    };
    try {
      if (navigator.locks) await navigator.locks.request(STORAGE_KEY, save);
      else save();
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
  }
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  return <>
    <header className="topbar"><a className="brand" href="#"><span className="brand-icon" aria-hidden="true">△</span><span>OUTDOOR <b>KULÜP</b><small>Birlikte doğaya.</small></span></a><span className="edition">Kulüp yönetimi <span>İlk sürüm</span></span></header>
    <main>
      <section className="intro"><p className="eyebrow">ŞEHRİN DIŞINDA, HAYATIN İÇİNDE</p><h1>Yeni bir hafta.<br/><em>Yeni bir patika.</em></h1><p>Rotanı keşfet, servisini seç, doğaya birlikte adım atalım.</p></section>
      <section className="hike-card" aria-labelledby="hike-heading"><div className="landscape" aria-hidden="true"><div className="sun"/><div className="mountain back"/><div className="mountain front"/><div className="landscape-label">KEŞFETMEYE DEVAM ET ↗</div></div><div className="hike-content"><label className="eyebrow" htmlFor="hike">HAFTALIK YÜRÜYÜŞ PROGRAMI</label><select id="hike" value={hikeId} onChange={e => { setHikeId(e.target.value); setForm(emptyForm); setMessage(null); }}>{HIKES.map(h => <option key={h.id} value={h.id}>{h.date.split('-').reverse().join('.')} · {h.route}</option>)}</select><h2 id="hike-heading">{hike.route}</h2><p>{hike.description}</p><div className="facts"><span>◷ {date}</span><span>↗ {hike.distance}</span><span>◴ {hike.duration}</span><span className="badge">{hike.difficulty}</span></div></div></section>
      <section className="services" aria-labelledby="services-heading"><div className="section-heading"><div><p className="eyebrow">YOLA BİRLİKTE ÇIKALIM</p><h2 id="services-heading">Servis durumu</h2></div><span>Toplam {participants.length} / 40 katılımcı</span></div><div className="service-grid">{SERVICES.map((service, index) => { const count = participants.filter(p => p.service === service).length; return <article className="service-card" key={service}><div className="service-top"><span className="bus-icon" aria-hidden="true">▥</span><h3>{service}</h3><span className="badge">{count === CAPACITY ? 'Dolu' : `${CAPACITY - count} boş koltuk`}</span></div><div className="occupancy"><strong>{count}<small> / {CAPACITY} kişi</small></strong><span>%{count / CAPACITY * 100} dolu</span></div><progress max={CAPACITY} value={count} aria-label={`${service} doluluk oranı`}/><p>Servis {index + 1} için {CAPACITY} kişilik kontenjan</p></article>; })}</div></section>
      <div className="bottom-grid"><section className="panel"><p className="eyebrow">SEN DE ARAMIZA KATIL</p><h2>Yürüyüşe kayıt ol</h2><p className="muted">Bir sonraki macera, küçük bir adımla başlar.</p>{storageError && <p className="notice error" role="alert">Tarayıcı kayıtları okunamıyor. Verilerinizin üzerine yazılmayacak. Depolama ayarlarını kontrol edip sayfayı yenileyin.</p>}<form onSubmit={submit}><div className="name-fields"><label>Ad<input name="firstName" autoComplete="given-name" required maxLength={60} value={form.firstName} onChange={update} placeholder="Adınız"/></label><label>Soyad<input name="lastName" autoComplete="family-name" required maxLength={60} value={form.lastName} onChange={update} placeholder="Soyadınız"/></label></div><label>Telefon<input type="tel" name="phone" autoComplete="tel" inputMode="tel" required maxLength={25} value={form.phone} onChange={update} placeholder="05XX XXX XX XX"/></label><label>Servis seçimi<select name="service" required value={form.service} onChange={update}><option value="">Servisinizi seçin</option>{SERVICES.map(service => { const full = participants.filter(p => p.service === service).length >= CAPACITY; return <option key={service} disabled={full} value={service}>{service}{full ? ' — Dolu' : ''}</option>; })}</select></label><p className="form-note">Seçili yürüyüş: {hike.route}. Her telefon numarasıyla bir kayıt yapılabilir.</p><button disabled={storageError || participants.length >= 40} type="submit">{participants.length >= 40 ? 'Kontenjan doldu' : 'Kaydımı tamamla'} <span aria-hidden="true">↗</span></button>{message && <p role={message.type === 'error' ? 'alert' : 'status'} className={`notice ${message.type}`}>{message.text}</p>}</form></section>
      <section className="panel participants"><div className="section-heading"><div><p className="eyebrow">PATİKA ARKADAŞLARIN</p><h2>Katılımcı listesi</h2></div><span className="count">{participants.length}</span></div>{participants.length === 0 ? <div className="empty"><span aria-hidden="true">♧</span><h3>İlk adımı sen at</h3><p>Henüz katılımcı yok. Kayıt tamamlandığında<br/>katılımcılar burada görünecek.</p></div> : <div className="table-wrap"><table><caption className="sr-only">{hike.route} katılımcıları</caption><thead><tr><th>Ad soyad</th><th>Telefon</th><th>Servis</th></tr></thead><tbody>{participants.map(p => <tr key={p.phone}><td>{p.firstName} {p.lastName}</td><td>0{p.phone}</td><td>{p.service}</td></tr>)}</tbody></table></div>}<p className="local-note">◉ Kayıtlar yalnızca bu tarayıcıda saklanır. Ortak bir katılımcı veritabanı kullanılmaz.</p></section></div>
    </main><footer><span>△ Outdoor Kulüp</span><span>Doğaya saygıyla, birlikte.</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
