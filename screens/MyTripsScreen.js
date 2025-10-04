import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MyTripsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const storedReservations = await AsyncStorage.getItem('reservations');
      if (storedReservations) {
        const parsedReservations = JSON.parse(storedReservations);
        // En yeni rezervasyonları üstte göster
        setReservations(parsedReservations.reverse());
      }
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (reservationId) => {
    Alert.alert(
      'Rezervasyonu Sil',
      'Bu rezervasyonu silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedReservations = reservations.filter(r => r.id !== reservationId);
              await AsyncStorage.setItem('reservations', JSON.stringify(updatedReservations.reverse()));
              setReservations(updatedReservations);
            } catch (error) {
              console.error('Rezervasyon silinirken hata:', error);
              Alert.alert('Hata', 'Rezervasyon silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const viewTripDetails = (reservation) => {
    navigation.navigate('TripDetail', { tripData: reservation.tripData });
  };

  const renderReservationCard = (reservation) => {
    return (
      <View key={reservation.id} style={styles.reservationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="airplane-outline" size={20} color="#2DC44D" />
            <Text style={styles.cardTitle}>{reservation.title}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => deleteReservation(reservation.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.tripImageContainer}>
            <Image 
              source={require('../assets/plan_rec_image.png')} 
              style={styles.tripImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{reservation.dates}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.detailText}>Toplam: {reservation.totalPrice} TL</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#2DC44D" />
              <Text style={[styles.detailText, styles.statusText]}>Onaylandı</Text>
            </View>

            <Text style={styles.createdAt}>
              {new Date(reservation.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} tarihinde rezerve edildi
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => viewTripDetails(reservation)}
          >
            <Text style={styles.viewButtonText}>Detayları Görüntüle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DC44D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.brandTitle}>ENUYGUN</Text>
          <Text style={styles.pageTitle}>Seyahatlerim</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Seyahatleriniz yükleniyor...</Text>
          </View>
        ) : reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="airplane-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Henüz seyahatiniz yok</Text>
            <Text style={styles.emptyText}>
              İlk seyahatinizi planlamak için ana sayfaya dönün ve yeni bir gezi oluşturun.
            </Text>
            <TouchableOpacity 
              style={styles.planTripButton}
              onPress={() => navigation.navigate('Landing')}
            >
              <Text style={styles.planTripButtonText}>Gezi Planla</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reservationsContainer}>
            <Text style={styles.sectionTitle}>
              Rezervasyonlarınız ({reservations.length})
            </Text>
            {reservations.map(renderReservationCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DC44D',
  },
  header: {
    width: width,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2DC44D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  headerTitles: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 20,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.56,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  planTripButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  planTripButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reservationsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  tripImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripDetails: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    color: '#2DC44D',
    fontWeight: '500',
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  cardActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyTripsScreen;
