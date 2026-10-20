# Akıllı Arıza Talep Yönetimi

Mobil Programlama Hafta 5 mini projesi. React Native ve Expo kullanılarak
geliştirilen bu uygulama, kullanıcıların teknik arıza taleplerini oluşturmasını,
listelemesini ve durumlarını takip etmesini sağlar. Uygulama Bitcoin renk
paletinden ilham alan turuncu, siyah ve koyu gri bir arayüze sahiptir.

Veriler bu eğitim projesinin kapsamı gereği yalnızca uygulama state'inde
tutulur; veritabanı, API veya kullanıcı hesabı gerektirmez.

## Uygulama akışı

1. Kullanıcı talep başlığı, açıklaması ve arıza kategorisini girer.
2. `Talep oluştur` düğmesi alanları doğrular ve geçerli talebi listeye ekler.
3. Bir talebe kısa dokunulduğunda başlık, açıklama, kategori ve durum detayları gösterilir.
4. Bir talebe uzun basıldığında silme onayı açılır.
5. Talep kartındaki durum düğmeleri ile talep `Bekliyor`, `İşlemde` veya
   `Tamamlandı` durumuna geçirilebilir.
6. Durum filtresi ile liste yalnızca seçilen durumdaki talepleri gösterebilir.

## Çalıştırma

Node.js ve npm kurulu olmalıdır.

```bash
cd hafta-5
npm install
npx expo start
```

Expo geliştirici ekranından Android emülatörünü, iOS simülatörünü veya Expo Go
ile çalışan cihazı seçebilirsiniz. Web üzerinde görüntülemek için:

```bash
npx expo start --web
```

## Özellikler

- Başlık, açıklama ve kategori doğrulaması
- Bilgisayar, İnternet, Yazıcı ve Yazılım kategorileri
- Başarılı kayıt, hata ve silme işlemlerinde kullanıcı bildirimi
- Talebe kısa dokununca ayrıntı gösterme
- Talebe uzun basınca onaylı silme
- Bekliyor, İşlemde ve Tamamlandı durumları
- Özgün özellik: durum filtresi ile listeyi anlık filtreleme

Durum düğmelerine dokunmak yalnızca ilgili talebin state'ini günceller.
Kartın başka bir yerine kısa dokunmak ayrıntıları gösterir.

## Proje dosyaları

- `App.js`: Uygulama arayüzü, state yönetimi ve olay işleyicileri
- `app.json`: Expo uygulama ayarları
- `index.js`: Expo başlangıç dosyası
- `package.json`: Çalıştırma komutları ve bağımlılıklar
