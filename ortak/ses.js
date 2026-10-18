// Hafıza Kart Oyunu - ses efektleri
// Sesler dosyadan çalınmaz, WebAudio ile anında üretilir. Böylece lisans gerektiren bir ses dosyası yok
// ve oyun çevrimdışı da sesli çalışır. Her ses, ilk sürümdeki sesin oyundaki anını karşılayacak şekilde tasarlandı:
//   dogru   -> eşleşmede parlak bir "ding"
//   yanlis  -> yanlış eşleşmede inen, sönük bir "wah-wah"
//   kazanma -> oyun bitince kısa, zafer havasında bir fanfar
//   kaybetme-> oyunu kaybedince üç notalık inen bir melodi

var Ses = (function () {
    var baglam = null;
    var yanki = null;
    var acik = true;

    try {
        acik = localStorage.getItem('hafiza.ses') !== 'kapali';
    } catch (e) { /* depolama yoksa varsayılan açık */ }

    function bagla() {
        if (!baglam) {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            baglam = new AudioCtx();
            yanki = yankiOlustur(baglam);
        }
        if (baglam.state === 'suspended') baglam.resume();
        return baglam;
    }

    // Kısa, yapay bir oda yankısı: üstel sönümlü gürültüden dürtü yanıtı
    function yankiOlustur(ctx) {
        var sure = 1.6;
        var uzunluk = Math.floor(ctx.sampleRate * sure);
        var tampon = ctx.createBuffer(2, uzunluk, ctx.sampleRate);
        for (var k = 0; k < 2; k++) {
            var veri = tampon.getChannelData(k);
            for (var i = 0; i < uzunluk; i++) {
                veri[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / uzunluk, 3);
            }
        }
        var conv = ctx.createConvolver();
        conv.buffer = tampon;
        var kazanc = ctx.createGain();
        kazanc.gain.value = 0.25;
        conv.connect(kazanc).connect(ctx.destination);
        return conv;
    }

    function nota(ctx, secenek) {
        var bas = ctx.currentTime + (secenek.gecikme || 0);
        var sure = secenek.sure || 0.3;
        var osc = ctx.createOscillator();
        var kazanc = ctx.createGain();
        osc.type = secenek.tip || 'sine';
        osc.frequency.setValueAtTime(secenek.frekans, bas);
        if (secenek.bitisFrekansi) {
            osc.frequency.exponentialRampToValueAtTime(secenek.bitisFrekansi, bas + sure);
        }
        if (secenek.detune) osc.detune.value = secenek.detune;

        var hedef = kazanc;
        if (secenek.filtre) {
            var filtre = ctx.createBiquadFilter();
            filtre.type = 'lowpass';
            filtre.frequency.setValueAtTime(secenek.filtre[0], bas);
            filtre.frequency.exponentialRampToValueAtTime(secenek.filtre[1], bas + sure);
            filtre.Q.value = 6;
            osc.connect(filtre);
            filtre.connect(kazanc);
        } else {
            osc.connect(kazanc);
        }

        var seviye = secenek.ses || 0.2;
        kazanc.gain.setValueAtTime(0.0001, bas);
        kazanc.gain.exponentialRampToValueAtTime(seviye, bas + (secenek.atak || 0.01));
        kazanc.gain.setValueAtTime(seviye, bas + sure * (secenek.tutma || 0.2));
        kazanc.gain.exponentialRampToValueAtTime(0.0001, bas + sure);

        hedef.connect(ctx.destination);
        if (secenek.yanki && yanki) hedef.connect(yanki);

        osc.start(bas);
        osc.stop(bas + sure + 0.05);
    }

    function cal(fonksiyon) {
        if (!acik) return;
        var ctx = bagla();
        if (ctx) fonksiyon(ctx);
    }

    return {
        get acik() {
            return acik;
        },

        ayarla: function (deger) {
            acik = deger;
            try {
                localStorage.setItem('hafiza.ses', deger ? 'acik' : 'kapali');
            } catch (e) { /* yoksay */ }
        },

        // İlk tıklamada çağrılır; tarayıcılar sesi kullanıcı etkileşiminden sonra açar
        hazirla: function () {
            if (acik) bagla();
        },

        dogru: function () {
            cal(function (ctx) {
                nota(ctx, { frekans: 1318.5, sure: 0.7, ses: 0.22, tutma: 0.05, yanki: true });
                nota(ctx, { frekans: 2637, sure: 0.45, ses: 0.08, tutma: 0.05 });
                nota(ctx, { frekans: 1760, gecikme: 0.09, sure: 0.8, ses: 0.18, tutma: 0.05, yanki: true });
            });
        },

        yanlis: function () {
            cal(function (ctx) {
                nota(ctx, { frekans: 233, bitisFrekansi: 196, sure: 0.32, tip: 'sawtooth', ses: 0.14, filtre: [1400, 500], tutma: 0.6 });
                nota(ctx, { frekans: 185, bitisFrekansi: 139, gecikme: 0.3, sure: 0.55, tip: 'sawtooth', ses: 0.14, filtre: [1100, 300], tutma: 0.5 });
            });
        },

        kazanma: function () {
            cal(function (ctx) {
                // Do majör: yükselen arpej, ardından tutulan akor
                var arpej = [392, 523.25, 659.25, 783.99];
                arpej.forEach(function (f, i) {
                    nota(ctx, { frekans: f, gecikme: i * 0.11, sure: 0.35, tip: 'triangle', ses: 0.16, yanki: true });
                });
                [523.25, 659.25, 783.99, 1046.5].forEach(function (f) {
                    nota(ctx, { frekans: f, gecikme: 0.5, sure: 1.9, tip: 'sawtooth', ses: 0.05, detune: -6, filtre: [2600, 900], atak: 0.06, tutma: 0.45, yanki: true });
                    nota(ctx, { frekans: f, gecikme: 0.5, sure: 1.9, tip: 'sawtooth', ses: 0.05, detune: 6, filtre: [2600, 900], atak: 0.06, tutma: 0.45, yanki: true });
                });
                nota(ctx, { frekans: 130.81, gecikme: 0.5, sure: 1.9, tip: 'triangle', ses: 0.2, atak: 0.04, tutma: 0.45 });
            });
        },

        kaybetme: function () {
            cal(function (ctx) {
                [[311.13, 0], [293.66, 0.32], [277.18, 0.64]].forEach(function (n) {
                    nota(ctx, { frekans: n[0], gecikme: n[1], sure: 0.34, tip: 'sawtooth', ses: 0.13, filtre: [1500, 700], tutma: 0.6 });
                });
                nota(ctx, { frekans: 261.63, bitisFrekansi: 233, gecikme: 0.96, sure: 1.0, tip: 'sawtooth', ses: 0.13, filtre: [1300, 250], tutma: 0.5 });
            });
        }
    };
})();
