# Outdoor Kulüp Yönetim Sistemi

React + Vite ve JavaScript ile hazırlanmış, Türkçe ve mobil uyumlu yürüyüş kayıt uygulaması. Doğa temalı sade bir arayüz kullanır.

## Kurulum ve çalıştırma

Node.js **22.12 veya üzeri** ve npm gerekir. Terminalde proje klasörüne girip çalıştırın:

```bash
npm install
npm run dev
```

Terminalde gösterilen yerel adresi (genellikle `http://localhost:5173`) tarayıcıda açın. Sunucuyu durdurmak için `Ctrl+C` kullanın.

## Test ve üretim derlemesi

```bash
npm test
npm run build
npm run preview
```

`npm test`, kayıt kurallarının otomatik testlerini çalıştırır. `npm run build`, yayınlanabilecek dosyaları `dist/` klasörüne oluşturur. `npm run preview`, bu derlemeyi yerelde gösterir; üretim sunucusu değildir. Kilit dosyasıyla tekrarlanabilir kurulum için `npm ci` kullanılabilir.

## Özellikler

- Haftalık yürüyüş seçimi; tarih, rota ve zorluk bilgileri.
- Ad, soyad, Türkiye cep telefonu ve servis seçimi ile kayıt.
- Her yürüyüş için bağımsız, 20'şer kişilik Servis 1 ve Servis 2.
- Doluluk yüzdesi, boş koltuk sayısı ve katılımcı listesi.
- Aynı yürüyüşe aynı telefonla ikinci kayıt engeli. `05XX`, `5XX`, `+90` ve `0090` yazımları aynı numara olarak değerlendirilir.
- Dolu servis seçilemez; kayıt anında kapasite yeniden kontrol edilir.
- Kayıtlar localStorage ile sayfa yenilendiğinde korunur. Depolama okuma/yazma hataları ekranda gösterilir; bozuk kayıtların üzerine yazılmaz.
- Açık sekmeler kayıt değişikliklerini takip eder. Web Locks destekleyen tarayıcılarda aynı kaynakta eşzamanlı kayıt işlemleri sıraya alınır.

## Dosyaları tanıyalım

- `src/main.jsx`: React arayüzü, form ve tarayıcı depolama işlemleri.
- `src/styles.css`: doğa teması ve mobil ekran düzeni.
- `src/registrations.js`: yürüyüşler, telefon doğrulama ve kapasite kuralları.
- `tests/registrations.test.js`: yapay verilerle kayıt kurallarının testleri.
- `vite.config.js`: Vite ve React yapılandırması.

Yürüyüş eklemek veya değiştirmek için `src/registrations.js` içindeki `HIKES` listesini düzenleyin. `id` benzersiz ve sabit olmalıdır; kayıtlar yürüyüşün kimliğine bağlıdır. Mevcut kayıtların ait olduğu yürüyüşü listeden çıkarmak depolama doğrulamasını etkiler; gerçek kullanımda arşivleme/veri taşıma tasarlanmalıdır. Tarihler örnek programdır; kendiliğinden güncellenmez.

## İlk sürümün veri sınırları

Uygulama boş katılımcı listesiyle başlar. Otomatik testlerde yalnızca yapay adlar ve telefon numaraları kullanılır. Denemelerde gerçek kişisel veri girmeyin.

Google Sheets / Apps Script veya başka bir servis ile bağlantı kurulmaz. Veriler sunucuya gönderilmez. localStorage anahtarı `outdoor-kulup:registrations:v1` şeklindedir. Aynı tarayıcı profili ve aynı site adresi kullanıldığında kayıtlar kalır; farklı cihaz, tarayıcı, port veya alan adlarında paylaşılmaz. Tarayıcı verilerini temizlemek kayıtları siler. Bozuk test verisini sıfırlamak gerekirse geliştirici araçlarının depolama bölümünden yalnızca bu anahtarı silin; bu işlem bu uygulamadaki yerel kayıtları kaldırır.

Bu sürümde oturum açma ve yetkilendirme yoktur. Katılımcı adları ve telefonları aynı tarayıcıyı kullanan kişiler tarafından görüntülenebilir. Tarayıcı depolaması kullanıcı tarafından değiştirilebilir. Web Locks olmayan tarayıcılarda farklı sekmelerde tam aynı anda yapılan işlemler için kesin eşzamanlılık garantisi yoktur. Kulüp genelinde ortak kapasite ve mükerrer kayıt kontrolü için sonraki sürümde sunucu veritabanı ve yetkilendirme gerekir.
