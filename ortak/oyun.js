// Hafıza Kart Oyunu - üç seviyenin ortak oyun motoru.
// Seviye ayarları her seviyenin index.html dosyasında window.SEVIYE olarak tanımlanır.
// Modül/fetch kullanılmaz; böylece oyun dosyalar indirilip çift tıklanarak çevrimdışı da açılabilir.

(function () {
    'use strict';

    var ayar = window.SEVIYE;
    var ACILMA_BEKLEMESI = 1000; // ms: kartlar açık kalma süresi (ilk sürümle aynı)

    var el = {
        oyun: document.querySelector('.game'),
        puan: document.querySelector('.point'),
        sure: document.querySelector('.time'),
        hak: document.querySelector('.guessCount'),
        durum: document.querySelector('.state'),
        sonuc: document.querySelector('.Result'),
        sonucDurum: document.querySelector('.Rstate'),
        sonucSkor: document.querySelector('.Rskor'),
        sonucSure: document.querySelector('.Rtime'),
        sonucRekor: document.querySelector('.Rrekor'),
        sonrakiDugme: document.querySelector('[data-islem="sonraki"]'),
        sesDugme: document.querySelector('[data-islem="ses"]')
    };

    var durum = {
        puan: 0,
        hak: ayar.tahminHakki,
        gecen: 0,
        bulunan: 0,
        acik: [],       // şu an açık olan (henüz eşleşmemiş) kartlar, en fazla 2
        kilit: false,   // iki kart değerlendirilirken yeni tıklama alınmaz
        bitti: false,
        sayac: null
    };

    var METIN = {
        kazandi: 'KAZANDINIZ',
        sureBitti: 'KAYBETTİNİZ <br> Zaman Doldu',
        hakBitti: 'KAYBETTİNİZ <br> TAHMİN HAKKINIZ KALMADI'
    };

    // ---------- Yardımcılar ----------

    function karistir(dizi) {
        for (var i = dizi.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = dizi[i];
            dizi[i] = dizi[j];
            dizi[j] = t;
        }
        return dizi;
    }

    function bekle(ms) {
        return new Promise(function (coz) { setTimeout(coz, ms); });
    }

    // İlk sürümdeki biçim: 0:7, 1:15 (saniye başında sıfır yok)
    function sureMetni(saniye) {
        return Math.floor(saniye / 60) + ':' + (saniye % 60);
    }

    // ---------- Rekorlar ----------

    var REKOR_ANAHTARI = 'hafiza.rekor.' + ayar.anahtar;

    function rekorOku() {
        try {
            return JSON.parse(localStorage.getItem(REKOR_ANAHTARI));
        } catch (e) {
            return null;
        }
    }

    // Kazanılan oyunlarda en kısa süre, hiç kazanılmadıysa en yüksek puan rekor sayılır
    function dahaIyiMi(yeni, eski) {
        if (!eski) return true;
        if (yeni.kazandi !== eski.kazandi) return yeni.kazandi;
        if (yeni.kazandi) return yeni.sure < eski.sure;
        return yeni.puan > eski.puan || (yeni.puan === eski.puan && yeni.sure < eski.sure);
    }

    function rekorKaydet(sonuc) {
        var eski = rekorOku();
        if (!dahaIyiMi(sonuc, eski)) return { yeni: false, rekor: eski };
        try {
            localStorage.setItem(REKOR_ANAHTARI, JSON.stringify(sonuc));
        } catch (e) { /* depolama yoksa rekor tutulmaz */ }
        return { yeni: true, rekor: sonuc };
    }

    function rekorMetni(rekor) {
        return rekor.kazandi ? sureMetni(rekor.sure) + ' sürede' : rekor.puan + ' puan';
    }

    // ---------- Kartlar ----------

    function kartlariOlustur() {
        var degerler = [];
        for (var d = 1; d <= ayar.ciftSayisi; d++) degerler.push(d, d);
        karistir(degerler);

        var satir = null;
        degerler.forEach(function (deger, i) {
            if (i % ayar.sutun === 0) {
                satir = document.createElement('div');
                satir.className = 'row';
                el.oyun.appendChild(satir);
            }
            var kart = document.createElement('div');
            kart.className = 'card';
            kart.dataset.value = deger;
            kart.tabIndex = 0;
            kart.setAttribute('role', 'button');
            kart.setAttribute('aria-label', 'Kart ' + (i + 1));

            var resim = document.createElement('img');
            resim.src = ayar.klasor + ayar.onek + deger + '.webp';
            resim.alt = ayar.resimAciklamasi + ' ' + deger;

            var numara = document.createElement('span');
            numara.textContent = i + 1;

            kart.append(resim, numara);
            satir.appendChild(kart);
        });
    }

    function kartiAc(kart) {
        kart.firstChild.style.visibility = 'visible';
        kart.lastChild.style.visibility = 'hidden';
        kart.style.transform = 'rotateY(720deg)';
        kart.setAttribute('aria-label', kart.firstChild.alt);
    }

    function kartiKapat(kart) {
        kart.firstChild.style.visibility = '';
        kart.lastChild.style.visibility = 'visible';
        kart.style.transform = '';
        kart.setAttribute('aria-label', 'Kart ' + kart.lastChild.textContent);
    }

    function kartiKaldir(kart) {
        kart.style.visibility = 'hidden';
        kart.tabIndex = -1;
    }

    async function kartSecildi(kart) {
        if (durum.bitti || durum.kilit || !kart || durum.acik.indexOf(kart) !== -1) return;
        if (kart.style.visibility === 'hidden') return;

        Ses.hazirla();
        kartiAc(kart);
        durum.acik.push(kart);
        if (durum.acik.length < 2) return;

        durum.kilit = true;
        var ilk = durum.acik[0];
        var ikinci = durum.acik[1];

        if (ilk.dataset.value === ikinci.dataset.value) {
            await bekle(ACILMA_BEKLEMESI);
            durum.puan += 10;
            el.puan.textContent = durum.puan;
            kartiKaldir(ilk);
            kartiKaldir(ikinci);
            durum.bulunan++;
            Ses.dogru();

            if (durum.bulunan === ayar.ciftSayisi) {
                await bekle(ACILMA_BEKLEMESI);
                oyunBitti(true, METIN.kazandi);
            }
        } else {
            durum.hak--;
            el.hak.textContent = durum.hak;
            Ses.yanlis();
            await bekle(ACILMA_BEKLEMESI);
            kartiKapat(ilk);
            kartiKapat(ikinci);
            if (durum.hak === 0) oyunBitti(false, METIN.hakBitti);
        }

        durum.acik = [];
        durum.kilit = false;
    }

    // ---------- Süre ve oyun sonu ----------

    function sureyiBaslat() {
        durum.sayac = setInterval(function () {
            if (durum.bitti) return;
            durum.gecen++;
            el.sure.textContent = sureMetni(durum.gecen);
            if (durum.gecen >= ayar.sure) oyunBitti(false, METIN.sureBitti);
        }, 1000);
    }

    function oyunBitti(kazandi, metin) {
        if (durum.bitti) return;
        durum.bitti = true;
        clearInterval(durum.sayac);

        document.querySelectorAll('.card').forEach(function (kart) {
            kart.style.display = 'none';
        });
        el.durum.style.visibility = 'hidden';

        el.sonucDurum.innerHTML = metin;
        el.sonucSkor.textContent = durum.puan;
        el.sonucSure.textContent = sureMetni(durum.gecen);

        var kayit = rekorKaydet({ kazandi: kazandi, puan: durum.puan, sure: durum.gecen });
        el.sonucRekor.textContent = kayit.yeni ? 'Yeni rekor!' : 'Rekor: ' + rekorMetni(kayit.rekor);

        el.sonuc.style.display = 'block';
        el.sonuc.querySelector('.Rbutton').focus();

        if (kazandi) Ses.kazanma();
        else Ses.kaybetme();
    }

    // ---------- Düğmeler ----------

    function ekranBoyutu(kartSinifi, numaraSinifi) {
        document.querySelectorAll('.card').forEach(function (kart) {
            kart.className = 'card ' + kartSinifi;
            kart.firstChild.className = kartSinifi;
            kart.lastChild.className = numaraSinifi;
        });
    }

    function sesDugmesiniGuncelle() {
        el.sesDugme.setAttribute('aria-pressed', String(!Ses.acik));
        el.sesDugme.title = Ses.acik ? 'Ses açık' : 'Ses kapalı';
    }

    document.addEventListener('click', function (e) {
        var hedef = e.target.closest('[data-islem], .card');
        if (!hedef) return;

        if (hedef.classList.contains('card')) {
            kartSecildi(hedef);
            return;
        }

        switch (hedef.dataset.islem) {
            case 'menu':
                window.location.href = '../index.html';
                break;
            case 'ses':
                Ses.ayarla(!Ses.acik);
                sesDugmesiniGuncelle();
                break;
            case 'boyut':
                ekranBoyutu(hedef.dataset.kart, hedef.dataset.numara);
                break;
            case 'yeniden':
                window.location.reload();
                break;
            case 'sonraki':
                window.location.href = ayar.sonraki;
                break;
        }
    });

    // Klavyeyle oynanabilirlik: odaktaki kart Enter veya boşlukla açılır
    el.oyun.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
            e.preventDefault();
            kartSecildi(e.target);
        }
    });

    // ---------- Başlat ----------

    el.hak.textContent = durum.hak;
    el.sonrakiDugme.hidden = !ayar.sonraki;
    sesDugmesiniGuncelle();
    kartlariOlustur();
    sureyiBaslat();
})();
