import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DC44D" />
      
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
      </View>

      {/* Action Button */}
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
  content: {
    flex: 1,
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
    paddingHorizontal: 24,
    paddingBottom: 32,
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
});

export default ReservationConfirmationScreen;
