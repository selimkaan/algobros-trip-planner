# AI Trip Planner Mobile App

Bu uygulama, AI destekli seyahat planlaması yapabilen bir React Native uygulamasıdır. Backend API'si ile entegre çalışarak kullanıcılara kişiselleştirilmiş gezi planları sunar.

## Özellikler

### ✈️ Akıllı Gezi Planlama
- Kullanıcı prompt'u ile AI destekli gezi önerileri
- Otomatik uçuş, konaklama ve aktivite arama
- Günlük plan oluşturma

### 💰 Paket Sistemi
- En ucuz seçeneklerle başlangıç paketi
- Alternatif uçuş ve konaklama seçenekleri
- Fiyat karşılaştırması ve upgrade seçimi
- Her seçenek için fiyat farkı gösterimi

### 🏨 Kapsamlı İçerik
- Uçuş seçenekleri (gidiş/dönüş)
- Konaklama alternatifleri
- Günlük aktiviteler
- Gezilecek yerler (attractions)

### 🤖 AI Destekli Deneyim
- Doğal dil işleme ile gezi planı oluşturma
- AI yorumları ve önerileri
- Akıllı içerik dağılımı

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- React Native development environment
- Expo CLI

### Adımlar

1. **Projeyi klonlayın:**
\`\`\`bash
git clone <repository-url>
cd algobros-trip-planner
\`\`\`

2. **Bağımlılıkları yükleyin:**
\`\`\`bash
npm install
\`\`\`

3. **Backend URL'ini ayarlayın:**
\`services/TripPlannerAPI.js\` dosyasında \`API_BASE_URL\`'i backend URL'iniz ile değiştirin:
\`\`\`javascript
const API_BASE_URL = 'https://your-backend-url.com'; // Backend URL'inizi buraya ekleyin
\`\`\`

4. **Uygulamayı başlatın:**
\`\`\`bash
npm start
# veya
expo start
\`\`\`

## API Entegrasyonu

### Backend Endpoint
Uygulama aşağıdaki endpoint'i kullanır:
\`\`\`
POST /mcp
Content-Type: application/json

{
  "prompt": "16 ekim 2025te istanbuldan antalyaya gidip 20 ekim 2025te döneceğim gezimi planla"
}
\`\`\`

### Beklenen Response Formatı
\`\`\`json
{
  "departure_flights": [...],
  "return_flights": [...],
  "accommodations": [...],
  "activites": [...],
  "attractions": [...],
  "comments": "AI yorumu..."
}
\`\`\`

## Kullanım

### 1. Gezi Planlama
- Ana ekranda gezi detaylarınızı yazın
- Örnek: "16 ekim 2025te istanbuldan antalyaya gidip 20 ekim 2025te döneceğim gezimi planla"
- AI size otomatik olarak bir plan oluşturacak

### 2. Paket Görüntüleme
- Chat'te oluşturulan gezi kartına tıklayın
- En ucuz seçeneklerle oluşturulmuş paketi görün
- AI önerilerini okuyun

### 3. Seçenek Değiştirme
- Uçuş kartlarına tıklayarak alternatif seçenekleri görün
- Konaklama kartına tıklayarak farklı otelleri inceleyin
- Fiyat farkları ile birlikte alternatifleri karşılaştırın
- "+" butonuna tıklayarak seçiminizi güncelleyin

### 4. Günlük Plan
- Her gün için önerilen aktivite ve attractions'ları görün
- AI tarafından otomatik olarak günlere dağıtılmış içerik

## Proje Yapısı

\`\`\`
├── screens/
│   ├── LandingScreen.js          # Ana giriş ekranı
│   ├── ChatScreen.js             # AI chat ve gezi planlama
│   ├── NewTripDetailScreen.js    # Yeni trip detay ekranı
│   └── TripDetailScreen.js       # Eski trip detay ekranı (demo)
├── services/
│   └── TripPlannerAPI.js         # API servisleri
├── assets/                       # Resim dosyaları
└── App.js                        # Ana uygulama dosyası
\`\`\`

## Özelleştirme

### Yeni Aktivite Türleri Ekleme
\`TripPlannerAPI.js\` dosyasındaki \`distributeDailyActivities\` fonksiyonunu güncelleyin.

### UI Renkleri
Ana tema rengi: \`#2DC44D\` (Enuygun yeşili)
Stil dosyalarında bu rengi değiştirerek uygulamanın temasını özelleştirebilirsiniz.

### Loading States
Uygulama API çağrıları sırasında loading göstergeleri ve hata yönetimi içerir.

## Teknolojiler

- **React Native**: Mobil uygulama framework'ü
- **Expo**: Development ve build toolchain
- **React Navigation**: Sayfa yönlendirme
- **Expo Vector Icons**: İkon seti
- **Expo Linear Gradient**: Gradient desteği

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Commit edin (\`git commit -m 'Add amazing feature'\`)
4. Push edin (\`git push origin feature/amazing-feature\`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
