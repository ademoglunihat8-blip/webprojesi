export const FAQ_DATA = [
    // ÜYELİK
    { q: "Sendikaya nasıl üye olabilirim?", a: "Sendika üyeliği e-Devlet (turkiye.gov.tr) üzerinden 'İşçi Sendikaları Üyelik İşlemleri' menüsünden gerçekleştirilir." },
    { q: "Kimler sendikaya üye olabilir?", a: "15 yaşını doldurmuş, bir iş kolunda işçi olarak çalışan herkes kendi iş kolundaki sendikaya üye olabilir." },
    { q: "Sendikadan nasıl istifa edilir?", a: "İstifa işlemleri de e-Devlet üzerinden saniyeler içinde gerçekleştirilebilir." },
    { q: "Sendika aidatı ne kadardır?", a: "Sendika aidatları genellikle bir günlük çıplak yevmiye tutarındadır, ancak detaylar tüzüğümüzde yer almaktadır." },

    // HAKLAR VE GÜVENCELER
    { q: "Sendikalı olduğum için işten çıkarılabilir miyim?", a: "Hayır, sendika üyeliği anayasal bir haktır. Sendikal sebeple işten çıkarma durumunda işe iade davası ve yüksek tutarlı sendikal tazminat hakkınız doğar." },
    { q: "Sendika üyeliğimi işveren görebilir mi?", a: "İşveren e-Devlet üzerinden yaptığınız üyeliği doğrudan göremez. Ancak yetki tespiti aşamasında sistem üzerinden sayısal olarak bilinir." },
    { q: "Sendikalı olmanın avantajları nelerdir?", a: "İş güvencesi, daha iyi ücret, ikramiye, yakacak/eğitim yardımı gibi sosyal haklar ve ücretsiz hukuk desteği en büyük avantajlardır." },

    // TİS (Toplu İş Sözleşmesi)
    { q: "TİS nedir?", a: "Toplu İş Sözleşmesi, sendika ile işveren arasında imzalanan ve işçilerin ekonomik/sosyal haklarını belirleyen yasal belgedir." },
    { q: "TİS'ten kimler yararlanır?", a: "TİS imzalandığı işyerinde sendika üyesi olan tüm işçiler bu haklardan faydalanır." },
    { q: "Grev hakkı nedir?", a: "TİS sürecinde anlaşma sağlanamazsa, işçilerin yasal çerçevede iş bırakma ve hak arama mücadelesidir." },

    // ÇALIŞMA KOŞULLARI
    { q: "Maaşım geç ödenirse ne yapmalıyım?", a: "İş Kanunu'na göre maaşın 20 gün gecikmesi durumunda işçinin iş görmekten kaçınma hakkı vardır. Hukuki destek için sendikaya başvurabilirsiniz." },
    { q: "Yıllık izin hakkım ne zaman başlar?", a: "Aynı işyerinde 1 yıl çalışan işçi yıllık ücretli izne hak kazanır." },
    { q: "Kıdem tazminatı nasıl hesaplanır?", a: "Her tam yıl için bir brüt maaş tutarında hesaplanır. İstifa durumunda normalde ödenmez ancak haklı fesih/emeklilik/askerlik gibi istisnalar vardır." },

    // İLETİŞİM
    { q: "Genel merkez nerede?", a: "Genel merkezimiz Ankara'da bulunmaktadır. Detaylı adres: Kavaklıdere Mah. Atatürk Bulvarı No: 123/4 Çankaya/Ankara" },
    { q: "Üye olmak için ücret ödenir mi?", a: "Üyelik girişi ücretsizdir. Sadece düzenli çalışan üyelerden tüzükte belirlenen aidat kesintisi yapılır." }
];

export const formatFAQContext = () => {
    return FAQ_DATA.map(item => `S: ${item.q}\nC: ${item.a}`).join("\n\n");
};
