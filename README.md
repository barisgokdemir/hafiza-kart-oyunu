# Hafıza Kart Oyunu

Aynı kartları, belirlenen sürede ve tahmin hakkın bitmeden eşleştirmeye çalıştığın üç seviyeli bir hafıza oyunu.

**[Oyna: barisgokdemir.github.io/hafiza-kart-oyunu](https://barisgokdemir.github.io/hafiza-kart-oyunu/)**

<!-- Ekran görüntüsü: docs/ekran.png ekleyip aşağıdaki satırın yorumunu kaldırın -->
<!-- ![Oyun ekranı](docs/ekran.png) -->

## Seviyeler

| Seviye | Tema | Kart | Süre | Tahmin hakkı |
|---|---|---|---|---|
| Kolay | Ağaçlar: çeşitli ağaç türleri | 2x5 (10 kart) | 2 dakika | 10 |
| Orta | Van Gogh: Vincent van Gogh'un eserleri | 4x5 (20 kart) | 2 dakika | 20 |
| Zor | Hayvanlar: hayvanlar ve yavruları | 4x8 (32 kart) | 3 dakika | 30 |

Her doğru eşleşme 10 puan kazandırır, her yanlış eşleşme bir tahmin hakkı götürür. Kartlar çok küçük ya da büyük
görünüyorsa sağ üstteki **Ekran Boyutu** düğmelerini kullan. Her seviyenin rekoru (en kısa kazanma süresi) tarayıcıda
saklanır ve ana menüde görünür.

Kısa sürede tüm seviyeleri bitirebileceğin, eğlenceli ve öğretici bir oyun. İyi eğlenceler!

## Çevrimdışı oynama

Depoyu indir (**Code → Download ZIP**), klasörü aç ve `index.html` dosyasına çift tıkla. İnternet bağlantısı
gerekmez; sesler de dahil her şey tarayıcıda çalışır.

## Proje yapısı

```
├── index.html            # Ana menü
├── level2x5/index.html   # Kolay seviye (sadece seviye ayarları)
├── level4x5/index.html   # Orta seviye
├── level4x8/index.html   # Zor seviye
├── ortak/
│   ├── oyun.js           # Üç seviyenin ortak oyun motoru
│   ├── ses.js            # WebAudio ile üretilen ses efektleri
│   └── style.css         # Ortak stil, tema renkleri
├── agac/  Vangogh/  hayvanlar/   # Kart ve arka plan görselleri (WebP)
```

Yeni bir seviye eklemek için bir klasör açıp `index.html` içindeki `window.SEVIYE` ayarlarını (görsel klasörü,
çift sayısı, sütun sayısı, süre, tahmin hakkı) değiştirmek yeterli.

## Sürümler

**v2.0 (2026)**

- Görseller WebP'ye çevrildi ve boyutlandırıldı: toplam görsel boyutu 16,6 MB'tan 1,7 MB'a, kolay seviyenin
  açılışı 11,5 MB'tan yaklaşık 0,4 MB'a indi
- Üç seviyede tekrar eden kod (3 × ~380 satır JS ve 3 × ~250 satır CSS) tek motor ve tek stil dosyasında birleşti
- Ses dosyaları kaldırıldı; sesler artık WebAudio ile kodda üretiliyor (lisans gerektiren dosya yok)
- Ana menü arka planı, Van Gogh'un kamu malı "Badem Çiçekleri" tablosuyla değiştirildi
- Her seviye için rekor tutuluyor, ana menüde gösteriliyor
- Kartlar klavyeyle de açılabiliyor (Tab ile seç, Enter ile aç), görsellerde alternatif metin var
- Düzeltmeler: zor seviyedeki "Sonraki Level" düğmesi var olmayan bir sayfaya gidiyordu (artık son seviyede
  gizleniyor); 1.5x ve 1.3x boyutlarında kart numaraları ortalanmıyordu

**v1.0 (2021)**

İlk sürüm o günkü haliyle [`v1.0`](https://github.com/barisgokdemir/hafiza-kart-oyunu/releases/tag/v1.0)
etiketinde duruyor; Release sayfasından ZIP olarak indirilebilir.

## Görseller

- Ana menü arka planı: Vincent van Gogh, *Badem Çiçekleri* (1890), Van Gogh Müzesi, Amsterdam.
  Kamu malı; kaynak: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Amandelbloesem_-_s0176V1962_-_Van_Gogh_Museum.jpg)
- Orta seviyedeki tablolar ve arka plan da Van Gogh eserleridir ve kamu malıdır.
- Sesler bu projede kodla (WebAudio) üretilmiştir; ses dosyası kullanılmaz.
