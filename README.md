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

## GitHub Pages ile yayımlama (iPhone)

Hedef adres: https://numantelli.github.io/outdoor-kulup-yonetimi/

Vite `base` değeri `/outdoor-kulup-yonetimi/` olarak ayarlanmıştır. Böylece üretim derlemesindeki JavaScript ve CSS dosyaları depo alt yolundan yüklenir.

### Bir kez yapılacak GitHub ayarları

1. iPhone'da Safari ile https://github.com/numantelli/outdoor-kulup-yonetimi adresini açın ve depo yöneticisi hesabınızla giriş yapın. Menü seçenekleri görünmüyorsa Safari'nin sayfa menüsünden **Masaüstü Web Sitesi İste** seçeneğini kullanın.
2. **Settings → Pages** sayfasına gidin: https://github.com/numantelli/outdoor-kulup-yonetimi/settings/pages
3. **Build and deployment → Source** alanında **GitHub Actions** seçin. Varsa **Save** düğmesine dokunun. Dal/klasör seçmenize veya önerilen başka bir iş akışını kurmanıza gerek yoktur.
4. Depo şu anda özeldir. Kişisel hesaplarda özel depolar için Pages, GitHub Pro gerektirir. Pages ekranı plan yükseltmenizi istiyorsa özel depoyu koruyarak uygun plana geçin. Alternatif olarak, kaynak kodunun herkese açılmasını kabul ediyorsanız **Settings → General → Danger Zone → Change repository visibility** üzerinden **Public** yapabilirsiniz. Bu görünürlük değişikliği yayın yapılandırmasının zorunlu bir parçası değildir ve otomatik yapılmaz. Yayımlanan Pages sitesinin herkese açık olacağını dikkate alın.
5. Actions kapalıysa **Settings → Actions → General → Actions permissions** bölümünde Actions'ı etkinleştirin; politika bu dosyada kullanılan resmi `actions/*` eylemlerine izin vermelidir. İş akışı gerekli `contents: read`, `pages: write` ve `id-token: write` izinlerini kendisi tanımlar. Kişisel erişim belirteci (PAT), ek secret veya genel yazma izni gerekmez.
6. Bu değişikliklerin Pull Request sayfasını açın. **Checks** bölümündeki test ve derleme kontrolü başarılı olunca **Merge pull request → Confirm merge** ile `main` dalına birleştirin.

### Dağıtımı izleme ve sonraki güncellemeler

1. Deponun **Actions** sekmesine girin ve **GitHub Pages dağıtımı** çalışmasını açın.
2. `build` işi, Node.js 24 ile `npm ci`, `npm test` ve `npm run build` çalıştırır; başarılı olursa `dist/` Pages çıktısı olarak yüklenir. `deploy` işi bu çıktıyı yayımlar.
3. `github-pages` ortamı için önceden tanımlanmış onay kuralı varsa **Review deployments** ile onaylayın. **Settings → Environments → github-pages** bölümündeki dal kuralı `main` dağıtımına izin vermelidir.
4. İşler yeşil olduğunda hedef adresi Safari'de açın. İlk yayının görünmesi birkaç dakika sürebilir.
5. Bundan sonra `main` dalına her push (PR birleştirmeleri dahil) otomatik dağıtım başlatır. PR'larda mevcut **Proje kontrolleri** iş akışı test ve derleme yapar; PR sürümü canlı siteye yayımlanmaz.
6. Ayarları birleştirmeden sonra tamamladıysanız **Actions → GitHub Pages dağıtımı → Run workflow → main → Run workflow** ile yeniden yayımlayın. Bu seçenek iş akışı `main` dalına girdikten sonra görünür. Başarısız çalışmada hata veren adımın günlüğünü açın; Pages kaynağını, Actions politikasını ve ortam kurallarını kontrol edin.

`gh-pages` dalı ve `dist/` dosyalarını depoya eklemek gerekmez. Dağıtım yalnızca statik dosyaları yayımlar; mevcut kayıt, kapasite, telefon doğrulama ve localStorage davranışı korunur. Yerel geliştirme adresindeki kayıtlar GitHub Pages adresine kendiliğinden taşınmaz; kayıtlar hâlâ cihaz ve tarayıcıya özeldir.
