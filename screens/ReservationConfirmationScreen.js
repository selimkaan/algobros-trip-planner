import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  Platform,
  Linking,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Calendar from 'expo-calendar';

const { width, height } = Dimensions.get('window');

const ReservationConfirmationScreen = ({ navigation, route }) => {
  const tripData = route?.params?.tripData;

  const handleViewMyTrips = () => {
    // Seyahatlerim sayfasına git (şimdilik Landing'e gidiyoruz)
    navigation.reset({
      index: 0,
      routes: [{ name: 'MyTravels' }],
    });
  };

  const handleShareTrip = async () => {
    try {
      // Rezervasyon ID'si oluştur (gerçek uygulamada backend'den gelir)
      const reservationId = Date.now().toString();
      const shareUrl = `https://enuygun.com/aitripplanner/id/${reservationId}`;
      const shareMessage = `${tripData?.packageInfo?.totalDays || 3} günlük muhteşem gezi planımı kontrol et! 🌟\n\n${shareUrl}`;
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // For Expo, we need to create a temporary file to share
        // For now, we'll use a simple URL share via Linking
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
        const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpenWhatsApp) {
          Alert.alert(
            'Paylaş',
            'Gezi planınızı nasıl paylaşmak istiyorsunuz?',
            [
              {
                text: 'WhatsApp',
                onPress: () => Linking.openURL(whatsappUrl)
              },
              {
                text: 'Diğer',
                onPress: () => {
                  // Generic share
                  const mailUrl = `mailto:?subject=Gezi Planım&body=${encodeURIComponent(shareMessage)}`;
                  Linking.openURL(mailUrl);
                }
              },
              { text: 'İptal', style: 'cancel' }
            ]
          );
        } else {
          // Fallback to mail
          const mailUrl = `mailto:?subject=Gezi Planım&body=${encodeURIComponent(shareMessage)}`;
          Linking.openURL(mailUrl);
        }
      } else {
        Alert.alert('Uyarı', 'Bu cihazda paylaşım mevcut değil.');
      }
    } catch (error) {
      console.log('Share error:', error);
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu.');
    }
  };

  const handleAddToCalendar = async () => {
    try {
      // Calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Takvime etkinlik eklemek için izin verin.');
        return;
      }

      // Default calendar
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.source.name === 'Default') || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Hata', 'Takvim bulunamadı.');
        return;
      }

      // Create event
      const eventDetails = {
        title: `${tripData?.packageInfo?.totalDays || 3} Günlük Gezi`,
        startDate: new Date(tripData?.packageInfo?.departureDate || new Date()),
        endDate: new Date(tripData?.packageInfo?.returnDate || new Date()),
        timeZone: 'Europe/Istanbul',
        notes: `Toplam: ${tripData?.packageInfo?.totalPrice || '0'} TL\nRezervasyon: Enuygun AI Trip Planner`,
        alarms: [{ relativeOffset: -24 * 60 }] // 1 day before
      };

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      Alert.alert('Başarılı!', 'Gezi planınız takviminize eklendi.');
    } catch (error) {
      console.log('Calendar error:', error);
      Alert.alert('Hata', 'Takvime eklenirken bir hata oluştu.');
    }
  };

  const handleAddToWallet = async () => {
    try {
      // Expo Go'da Apple Wallet native erişimi sınırlı
      // Production'da EAS Build ile kullanılabilir
      Alert.alert(
        'Apple Wallet', 
        'Gezi bilgilerinizi Apple Wallet\'a eklemek için:\n\n1. Uygulamayı App Store\'dan indirin\n2. Bu özellik production sürümde aktif olacak\n\n📱 Demo sürümde simüle edildi!',
        [
          {
            text: 'Anladım',
            style: 'default'
          },
          {
            text: 'Simüle Et',
            onPress: () => {
              Alert.alert('✅ Başarılı!', 'Gezi bilgileriniz Apple Wallet\'a eklendi!\n\n(Demo modunda simüle edildi)');
            }
          }
        ]
      );
    } catch (error) {
      console.log('Wallet error:', error);
      Alert.alert('Hata', 'Wallet\'a eklenirken bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DC44D" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Rezervasyon Tamamlandı!</Text>
          <Text style={styles.subtitle}>
            Gezi planınız başarıyla rezerve edildi. Güzel bir seyahat geçirmeniz dileğiyle!
          </Text>

          {/* Trip Summary Card */}
          {tripData && (
            <View style={styles.tripSummaryCard}>
              <Image 
                source={require('../assets/plan_rec_image.png')} 
                style={styles.tripImage}
                resizeMode="cover"
              />
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>
                  {tripData.packageInfo?.totalDays || 3} Günlük Gezi Planı
                </Text>
                <Text style={styles.tripDates}>
                  {tripData.packageInfo?.departureDate} - {tripData.packageInfo?.returnDate}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.totalPrice}>
                    Toplam: {tripData.packageInfo?.totalPrice || '0'} TL
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Confirmation Details */}
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationRow}>
              <Ionicons name="mail" size={20} color="#2DC44D" />
              <Text style={styles.confirmationText}>
                Rezervasyon detayları e-posta adresinize gönderildi
              </Text>
            </View>
            <View style={styles.confirmationRow}>
              <Ionicons name="calendar" size={20} color="#2DC44D" />
              <Text style={styles.confirmationText}>
                Seyahat tarihinden 24 saat önce hatırlatma alacaksınız
              </Text>
            </View>
            <View style={styles.confirmationRow}>
              <Ionicons name="support" size={20} color="#2DC44D" />
              <Text style={styles.confirmationText}>
                Sorularınız için 7/24 destek hizmetimiz mevcuttur
              </Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShareTrip}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Arkadaşına Gönder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.calendarButton]}
              onPress={handleAddToCalendar}
            >
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Takvime Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.walletButton]}
              onPress={handleAddToWallet}
            >
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Apple Cüzdana Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.viewTripsButton}
          onPress={handleViewMyTrips}
        >
          <Text style={styles.viewTripsButtonText}>Seyahatlerimi Gör</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DC44D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Bottom button için alan bırak
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  tripSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  tripInfo: {
    alignItems: 'center',
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tripDates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    backgroundColor: '#F8FFF9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2DC44D',
  },
  confirmationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#2DC44D',
  },
  viewTripsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewTripsButtonText: {
    color: '#2DC44D',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  shareButton: {
    backgroundColor: 'rgba(220, 220, 220, 0.9)',
    borderColor: 'rgba(200, 200, 200, 1)',
  },
  calendarButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.6)',
    borderColor: 'rgba(255, 59, 48, 0.8)',
  },
  walletButton: {
    backgroundColor: 'rgba(162, 132, 94, 0.6)',
    borderColor: 'rgba(162, 132, 94, 0.8)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});

export default ReservationConfirmationScreen;
