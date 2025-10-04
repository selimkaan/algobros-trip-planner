# 🌟 AI Trip Planner - Enuygun

> **Yapay zeka destekli akıllı seyahat planlama uygulaması**

AI Trip Planner, kullanıcıların doğal dilde seyahat taleplerini girip, AI tarafından özelleştirilmiş gezi planları alabildiği modern bir React Native uygulamasıdır.

## 📱 Özellikler

### 🎯 Ana Özellikler
- **AI Destekli Planlama**: Doğal dil işleme ile akıllı gezi planı oluşturma
- **Gerçek Zamanlı Veriler**: Canlı uçuş, otel ve aktivite fiyatları
- **Dinamik Günlük Plan**: Aktivitelerin günlere otomatik dağıtımı
- **Paket Özelleştirme**: Uçuş ve konaklama seçeneklerini değiştirme
- **Rezervasyon Sistemi**: Güvenli rezervasyon ve kaydetme
- **Sosyal Paylaşım**: WhatsApp, Mail ve Apple Wallet entegrasyonu

### 🛠️ Teknik Özellikler
- **Cross-platform**: iOS ve Android desteği
- **Offline Destek**: AsyncStorage ile yerel veri saklama
- **Modern UI/UX**: Glassmorphism ve modern tasarım prensipleri
- **Native Entegrasyon**: Takvim, paylaşım ve cüzdan API'leri
- **Real-time Loading**: Dinamik yükleme durumları

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16+)
- Expo CLI
- iOS Simulator / Android Emulator
- React Native development environment

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/enuygun/ai-trip-planner.git
cd ai-trip-planner
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Uygulamayı çalıştırın**
```bash
npx expo start
```

4. **Mobil cihazda test edin**
- iOS: Expo Go uygulamasını indirin ve QR kodu tarayın
- Android: Expo Go uygulamasını indirin ve QR kodu tarayın

## 🏗️ Proje Yapısı

```
📦 algobros-trip-planner/
├── 📁 assets/                    # Resim ve icon dosyaları
│   ├── icon.png
│   ├── splash-icon.png
│   ├── landing_image.png
│   └── plan_rec_image.png
├── 📁 screens/                   # Ana ekranlar
│   ├── LandingScreen.js          # Giriş ekranı
│   ├── ChatScreen.js             # AI chat arayüzü
│   ├── NewTripDetailScreen.js    # Gezi detay ekranı
│   ├── ReservationConfirmationScreen.js  # Rezervasyon onayı
│   └── MyTripsScreen.js          # Seyahatlerim
├── 📁 services/                  # API servisleri
│   └── TripPlannerAPI.js         # Backend entegrasyonu
├── 📁 node_modules/              # Paket bağımlılıkları
├── App.js                        # Ana uygulama komponenti
├── app.json                      # Expo konfigürasyonu
├── package.json                  # Proje ayarları
└── README.md                     # Bu dosya
```

## 🔧 API Entegrasyonu

### Backend Endpoint
```javascript
const API_BASE_URL = 'https://your-backend-url.ngrok-free.dev';

// Ana endpoint
POST /agent/mcp
{
  "prompt": "İstanbul'dan Antalya'ya 3 günlük romantik gezi planla"
}
```

### Response Format
```javascript
{
  "departure_flights": [...],
  "return_flights": [...],
  "accommodations": [...],
  "activities": [...],
  "attractions": [...],
  "comments": "AI önerileri...",
  "itinerary": [...]
}
```

## 🎨 Ekran Görüntüleri

### 📱 Ana Akış
1. **Landing Screen** - Gezi planı başlatma
2. **Chat Screen** - AI ile etkileşim
3. **Trip Detail** - Detaylı plan görüntüleme
4. **Reservation** - Rezervasyon tamamlama

### ✨ Özel Özellikler
- **Dynamic Pricing**: Gerçek zamanlı fiyat hesaplama
- **Activity Swapping**: Etkinlik değiştirme sistemi
- **Package Customization**: Uçuş/otel değişikliği
- **Smart Distribution**: Otomatik günlük plan dağıtımı

## 🛠️ Teknoloji Stack

### Frontend
- **React Native** - Cross-platform mobil geliştirme
- **Expo** - Geliştirme ve dağıtım platformu
- **React Navigation** - Ekran yönlendirme
- **AsyncStorage** - Yerel veri saklama
- **Expo Calendar** - Takvim entegrasyonu
- **Expo Sharing** - Sosyal paylaşım

### Backend Integration
- **NestJS** - Backend framework
- **REST API** - HTTP iletişimi
- **JSON** - Veri formatı
- **ngrok** - Geliştirme proxy

### Design System
- **iOS Guidelines** - Apple tasarım kuralları
- **Glassmorphism** - Modern UI efektleri
- **Custom Components** - Özel tasarım bileşenleri
- **Responsive Design** - Farklı ekran boyutları

## 🔐 Güvenlik

- **Data Validation**: API yanıt doğrulama
- **Error Handling**: Kapsamlı hata yönetimi
- **Secure Storage**: Güvenli yerel depolama
- **Privacy**: Kullanıcı verilerinin korunması

## 📊 Performans

- **Lazy Loading**: İhtiyaç durumunda yükleme
- **Image Optimization**: Görsel optimizasyonu
- **Memory Management**: Bellek yönetimi
- **Smooth Animations**: Akıcı animasyonlar

## 🧪 Test

### Geliştirme Testi
```bash
# Expo Go ile test
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

### Test Senaryoları
1. **AI Chat**: Farklı gezi talepleri
2. **Package Selection**: Uçuş/otel değişikliği
3. **Activity Management**: Etkinlik değiştirme
4. **Reservation Flow**: Rezervasyon süreci
5. **Social Sharing**: Paylaşım özellikleri

## 🚀 Deployment

### Development Build
```bash
npx expo build:ios
npx expo build:android
```

### Production
- **App Store**: iOS dağıtımı
- **Google Play**: Android dağıtımı
- **OTA Updates**: Anlık güncellemeler

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Geliştirici**: Algobros Team
- **Email**: support@enuygun.com
- **Website**: https://enuygun.com

## 🙏 Teşekkürler

- **OpenAI** - AI teknolojisi
- **Expo Team** - Geliştirme platformu
- **React Native Community** - Açık kaynak katkıları
- **Enuygun** - Proje sponsorluğu

---

## 🔮 Gelecek Özellikler

- [ ] **Offline Mode**: İnternet bağlantısı olmadan çalışma
- [ ] **Multi-language**: Çoklu dil desteği
- [ ] **Voice Commands**: Sesli komut sistemi
- [ ] **AR Integration**: Artırılmış gerçeklik özelliği
- [ ] **Group Planning**: Grup seyahati planlama
- [ ] **Budget Tracking**: Bütçe takip sistemi
- [ ] **Weather Integration**: Hava durumu entegrasyonu
- [ ] **Local Recommendations**: Yerel öneri sistemi

---

**Made with ❤️ by Algobros & Enuygun Team**
