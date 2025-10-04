import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ConfirmationScreen = ({ navigation }) => {
  const handleViewReservations = () => {
    // Navigate to MyTravels screen
    navigation.navigate('MyTravels');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>ENUYGUN</Text>
        <Text style={styles.pageTitle}>Seyahat Planlayıcı</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Success Card */}
        <View style={styles.confirmationCard}>
          {/* Checkmark */}
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={120} color="#2DC44D" />
          </View>
          
          {/* Success Message */}
          <Text style={styles.successTitle}>
            Rezervasyonunuz Tamamlandı!
          </Text>
          
          {/* View Reservations Button */}
          <TouchableOpacity style={styles.viewReservationsButton} onPress={handleViewReservations}>
            <Text style={styles.viewReservationsText}>Rezervasyonlarımı Görüntüle</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DC44D',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#2DC44D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brandTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.56,
    fontFamily: 'Open Sans',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  successTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  viewReservationsButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  viewReservationsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});

export default ConfirmationScreen;
