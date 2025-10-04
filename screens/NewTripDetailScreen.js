import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TripPlannerAPI from '../services/TripPlannerAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const NewTripDetailScreen = ({ navigation, route }) => {
  const [selectedPackage, setSelectedPackage] = useState({
    departureFlight: null,
    returnFlight: null,
    accommodation: null
  });
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'departure' or 'return'
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [addActivityDayIndex, setAddActivityDayIndex] = useState(null);
  const [dailyPlan, setDailyPlan] = useState([]);

  // Get trip data from navigation params
  const tripData = route?.params?.tripData;
  const isReserved = route?.params?.isReserved || false; // Rezerve edilmiş mi kontrol et
  
  // Initialize selected package with cheapest options and daily plan
  React.useEffect(() => {
    if (tripData) {
      setSelectedPackage({
        departureFlight: tripData.packageInfo.cheapestDepartureFlight,
        returnFlight: tripData.packageInfo.cheapestReturnFlight,
        accommodation: tripData.packageInfo.cheapestAccommodation
      });
      setDailyPlan(tripData.dailyPlan || []);
    }
  }, [tripData]);

  // Helper functions
  const handleFlightSelection = (flight) => {
    if (modalType === 'departure') {
      setSelectedPackage(prev => ({ ...prev, departureFlight: flight }));
    } else {
      setSelectedPackage(prev => ({ ...prev, returnFlight: flight }));
    }
    setShowFlightModal(false);
  };

  const handleAccommodationSelection = (accommodation) => {
    setSelectedPackage(prev => ({ ...prev, accommodation }));
    setShowAccommodationModal(false);
  };

  const openFlightModal = (type) => {
    setModalType(type);
    setShowFlightModal(true);
  };

  const openActivityModal = (dayIndex, activityIndex) => {
    setSelectedDayIndex(dayIndex);
    setSelectedActivityIndex(activityIndex);
    setShowActivityModal(true);
  };

  const openAddActivityModal = (dayIndex) => {
    setAddActivityDayIndex(dayIndex);
    setShowAddActivityModal(true);
  };

  const handleAddActivity = (newActivity) => {
    if (addActivityDayIndex !== null) {
      const updatedDailyPlan = [...dailyPlan];
      const dayActivities = updatedDailyPlan[addActivityDayIndex].activities;
      
      // Yeni etkinlik için saat belirle (son etkinlikten sonra)
      const timeOptions = ['09:00', '13:00', '16:00', '19:00', '21:00'];
      let newTime = '09:00';
      
      if (dayActivities.length > 0) {
        const lastActivityTime = dayActivities[dayActivities.length - 1].time;
        const currentTimeIndex = timeOptions.findIndex(time => time === lastActivityTime);
        newTime = timeOptions[Math.min(currentTimeIndex + 1, timeOptions.length - 1)];
      }
      
      // Yeni etkinliği ekle
      updatedDailyPlan[addActivityDayIndex].activities.push({
        ...newActivity,
        time: newTime,
        type: newActivity.type || 'activity'
      });
      
      setDailyPlan(updatedDailyPlan);
    }
    setShowAddActivityModal(false);
    setAddActivityDayIndex(null);
  };

  const handleActivitySelection = (newActivity) => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null) {
      const updatedDailyPlan = [...dailyPlan];
      
      // Eğer "Etkinlik Silinmiş" seçeneği seçildiyse, etkinliği sil
      if (newActivity.id === 'delete_activity') {
        updatedDailyPlan[selectedDayIndex].activities.splice(selectedActivityIndex, 1);
      } else {
        // Normal etkinlik değiştirme
        updatedDailyPlan[selectedDayIndex].activities[selectedActivityIndex] = {
          ...newActivity,
          time: updatedDailyPlan[selectedDayIndex].activities[selectedActivityIndex].time,
          type: newActivity.type || 'activity'
        };
      }
      
      setDailyPlan(updatedDailyPlan);
    }
    setShowActivityModal(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
  };

  const calculatePriceDifference = (basePrice, comparePrice) => {
    if (!basePrice || !comparePrice) return 0;
    return TripPlannerAPI.calculatePriceDifference(basePrice, comparePrice);
  };

  // Calculate total price based on selected package
  const calculateTotalPrice = () => {
    if (!tripData) return '0';
    const total = TripPlannerAPI.calculateTotalPrice(selectedPackage, tripData.packageInfo.totalDays);
    return total.toFixed(0);
  };

  const getCurrentTripDetails = () => {
    if (!tripData) {
      return {
        title: '5 Günlük Antalya Deniz ve Romantizm Turu',
        dates: '10 - 14 Eyl',
        guests: '4 kişi',
        created: '3 Ekim 2025\'te Oluşturuldu'
      };
    }
    
    return {
      title: `${tripData.packageInfo.totalDays} Günlük AI Destekli Gezi Planı`,
      dates: tripData.packageInfo.tripDates,
      guests: '2 kişi',
      created: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) + '\'te Oluşturuldu'
    };
  };

  // Rezervasyon fonksiyonu
  const handleReservation = async () => {
    try {
      const reservation = {
        id: Date.now().toString(),
        title: getCurrentTripDetails().title,
        dates: getCurrentTripDetails().dates,
        totalPrice: calculateTotalPrice(),
        selectedPackage: selectedPackage,
        tripData: tripData,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Mevcut rezervasyonları al
      const existingReservations = await AsyncStorage.getItem('reservations');
      const reservations = existingReservations ? JSON.parse(existingReservations) : [];
      
      // Yeni rezervasyonu ekle
      reservations.push(reservation);
      await AsyncStorage.setItem('reservations', JSON.stringify(reservations));

      // Rezervasyon tamamlandı sayfasına git
      navigation.navigate('ReservationConfirmation', { 
        tripData: {
          ...tripData,
          packageInfo: {
            ...tripData.packageInfo,
            totalPrice: calculateTotalPrice(),
            departureDate: selectedPackage.departureFlight?.departure_time,
            returnDate: selectedPackage.returnFlight?.departure_time
          }
        }
      });
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      Alert.alert('Hata', 'Rezervasyon kaydedilirken bir hata oluştu.');
    }
  };

  const renderFlightModal = () => {
    const flights = modalType === 'departure' ? 
      tripData?.originalData?.departure_flights || [] : 
      tripData?.originalData?.return_flights || [];

    const currentSelectedFlight = modalType === 'departure' ? 
      selectedPackage.departureFlight : 
      selectedPackage.returnFlight;

    const baseFlight = modalType === 'departure' ? 
      tripData?.packageInfo.cheapestDepartureFlight : 
      tripData?.packageInfo.cheapestReturnFlight;

    return (
      <Modal
        visible={showFlightModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalType === 'departure' ? 'Gidiş Uçuşu Seç' : 'Dönüş Uçuşu Seç'}
            </Text>
            <TouchableOpacity onPress={() => setShowFlightModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={flights}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const priceDiff = baseFlight ? calculatePriceDifference(baseFlight.price, item.price) : 0;
              const isSelected = currentSelectedFlight?.id === item.id;
              
              return (
                <TouchableOpacity
                  style={[styles.flightOption, isSelected && styles.selectedOption]}
                  onPress={() => handleFlightSelection(item)}
                >
                  <View style={styles.flightInfo}>
                    <Text style={styles.airline}>{item.airline}</Text>
                    <Text style={styles.flightTime}>
                      {new Date(item.departure_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})} - {new Date(item.arrival_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{item.price}</Text>
                      {priceDiff > 0 && (
                        <Text style={styles.priceDiff}>+{priceDiff.toFixed(0)} TL</Text>
                      )}
                      {priceDiff === 0 && (
                        <Text style={styles.cheapestBadge}>En Ucuz</Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#2DC44D" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderAccommodationModal = () => {
    const accommodations = tripData?.originalData?.accommodations || [];
    const baseAccommodation = tripData?.packageInfo.cheapestAccommodation;

    return (
      <Modal
        visible={showAccommodationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Konaklama Seç</Text>
            <TouchableOpacity onPress={() => setShowAccommodationModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={accommodations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const priceDiff = baseAccommodation ? calculatePriceDifference(baseAccommodation.price_per_night, item.price_per_night) : 0;
              const isSelected = selectedPackage.accommodation?.id === item.id;
              
              return (
                <TouchableOpacity
                  style={[styles.accommodationOption, isSelected && styles.selectedOption]}
                  onPress={() => handleAccommodationSelection(item)}
                >
                  <Image source={{ uri: item.image_url }} style={styles.accommodationImage} />
                  <View style={styles.accommodationInfo}>
                    <Text style={styles.accommodationName}>{item.name}</Text>
                    <Text style={styles.accommodationLocation}>{item.location}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{item.price_per_night}/gece</Text>
                      {priceDiff > 0 && (
                        <Text style={styles.priceDiff}>+{priceDiff.toFixed(0)} TL</Text>
                      )}
                      {priceDiff === 0 && (
                        <Text style={styles.cheapestBadge}>En Ucuz</Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#2DC44D" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderActivityModal = () => {
    // Tüm etkinlikleri birleştir (activities + attractions)
    const allActivities = [
      ...(tripData?.allActivities || []),
      ...(tripData?.allAttractions || [])
    ];

    // "Etkinlik Silinmiş" seçeneği ekle
    const activitiesWithDelete = [
      {
        id: 'delete_activity',
        name: 'Etkinlik Silinmiş',
        location: 'Bu etkinlik kaldırılacak',
        price: '',
        image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      },
      ...allActivities
    ];

    return (
      <Modal
        visible={showActivityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Etkinlik Seç</Text>
            <TouchableOpacity onPress={() => setShowActivityModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={activitiesWithDelete}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isDeleteOption = item.id === 'delete_activity';
              return (
                <TouchableOpacity
                  style={[styles.activityOption, isDeleteOption && styles.deleteActivityOption]}
                  onPress={() => handleActivitySelection(item)}
                >
                  <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.activityOptionImage}
                    defaultSource={{uri: 'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}}
                  />
                  <View style={styles.activityOptionInfo}>
                    <Text style={[styles.activityOptionName, isDeleteOption && styles.deleteOptionText]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.activityOptionLocation, isDeleteOption && styles.deleteOptionText]}>
                      {item.location}
                    </Text>
                    {!isDeleteOption && (
                      <Text style={styles.activityOptionPrice}>
                        {item.price_per_night || item.price || 'Fiyat bilgisi yok'}
                      </Text>
                    )}
                  </View>
                  <Ionicons 
                    name={isDeleteOption ? "trash-outline" : "chevron-forward"} 
                    size={16} 
                    color={isDeleteOption ? "#FF6B6B" : "#343330"} 
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderAddActivityModal = () => {
    // Tüm etkinlikleri birleştir (activities + attractions)
    const allActivities = [
      ...(tripData?.allActivities || []),
      ...(tripData?.allAttractions || [])
    ];

    return (
      <Modal
        visible={showAddActivityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Etkinlik Ekle</Text>
            <TouchableOpacity onPress={() => setShowAddActivityModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={allActivities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.activityOption}
                  onPress={() => handleAddActivity(item)}
                >
                  <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.activityOptionImage}
                    defaultSource={{uri: 'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}}
                  />
                  <View style={styles.activityOptionInfo}>
                    <Text style={styles.activityOptionName}>{item.name}</Text>
                    <Text style={styles.activityOptionLocation}>{item.location}</Text>
                    <Text style={styles.activityOptionPrice}>
                      {item.price_per_night || item.price || 'Fiyat bilgisi yok'}
                    </Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={16} color="#2DC44D" />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderDailyPlan = () => {
    return dailyPlan.map((day, dayIndex) => (
      <View key={day.day} style={styles.daySection}>
        <View style={styles.dayHeader}>
          <View style={styles.dayCircle}>
            <Text style={styles.dayNumber}>{day.day}</Text>
          </View>
          <View style={styles.dayInfo}>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <Text style={styles.dayDate}>{new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</Text>
          </View>
        </View>
        
        <Text style={styles.dayDescription}>{day.description}</Text>
        
        {/* Activities */}
        {day.activities && day.activities.map((activity, activityIndex) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityCard}
            onPress={() => openActivityModal(dayIndex, activityIndex)}
          >
            <View style={styles.activityTime}>
              <Text style={styles.timeText}>{activity.time}</Text>
            </View>
            <View style={styles.activityBadge}>
              <Text style={styles.badgeText}>Etkinlik</Text>
            </View>
            <Image 
              source={{ uri: activity.image_url }} 
              style={styles.activityImage}
              defaultSource={{uri: 'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}}
            />
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityLocation}>{activity.location}</Text>
              <Text style={styles.activityPrice}>{activity.price || activity.price_per_night || ''}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#343330" />
          </TouchableOpacity>
        ))}
        
        {/* Etkinlik Ekleme Butonu */}
        <TouchableOpacity
          style={styles.addActivityButton}
          onPress={() => openAddActivityModal(dayIndex)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#2DC44D" />
          <Text style={styles.addActivityText}>Etkinlik Ekle</Text>
        </TouchableOpacity>
      </View>
    ));
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
          <Text style={styles.pageTitle}>Seyahat Planlayıcı</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Info Card */}
        <View style={styles.tripInfoCard}>
          <View style={styles.tripMainInfo}>
            <Text style={styles.tripTitle}>{getCurrentTripDetails().title}</Text>
            <Image source={require('../assets/image_detail.png')} style={styles.tripMainImage} />
          </View>
          
          {/* Total Cost Display */}
          <View style={styles.totalCostContainer}>
            <Text style={styles.totalCostLabel}>Toplam Maliyet</Text>
            <Text style={styles.totalCostAmount}>{calculateTotalPrice()} TL</Text>
          </View>
          
          <View style={styles.tripDatesContainer}>
            <Text style={styles.tripDates}>{getCurrentTripDetails().dates}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.tripGuests}>{getCurrentTripDetails().guests}</Text>
          </View>
          <Text style={styles.tripCreated}>{getCurrentTripDetails().created}</Text>
          
          {/* Rezerve Et Butonu - Sadece rezerve edilmemiş için göster */}
          {!isReserved && (
            <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
              <Text style={styles.reserveButtonText}>Rezerve Et</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* AI Comments */}
        {tripData?.aiComments && (
          <View style={styles.aiCommentsCard}>
            <View style={styles.aiCommentsHeader}>
              <Ionicons name="sparkles" size={16} color="#2DC44D" />
              <Text style={styles.aiCommentsTitle}>AI Önerisi</Text>
            </View>
            <Text style={styles.aiCommentsText}>{tripData.aiComments}</Text>
          </View>
        )}

        {/* Package Section */}
        <View style={styles.packageSection}>
          <View style={styles.sectionHeaderWithPrice}>
            <Text style={styles.sectionTitle}>Paket Bilgileri</Text>
            <Text style={styles.totalPrice}>Toplam: {calculateTotalPrice()} TL</Text>
          </View>
          
          {/* Flight Cards */}
          {selectedPackage.departureFlight && (
            <TouchableOpacity 
              style={styles.packageCard}
              onPress={() => openFlightModal('departure')}
            >
              <View style={styles.packageCardHeader}>
                <Ionicons name="airplane" size={20} color="#2DC44D" />
                <Text style={styles.packageCardTitle}>Gidiş Uçuşu</Text>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
              <Text style={styles.packageCardSubtitle}>
                {selectedPackage.departureFlight.airline} • {new Date(selectedPackage.departureFlight.departure_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
              </Text>
              <Text style={styles.packageCardPrice}>{selectedPackage.departureFlight.price}</Text>
            </TouchableOpacity>
          )}

          {selectedPackage.returnFlight && (
            <TouchableOpacity 
              style={styles.packageCard}
              onPress={() => openFlightModal('return')}
            >
              <View style={styles.packageCardHeader}>
                <Ionicons name="airplane" size={20} color="#2DC44D" />
                <Text style={styles.packageCardTitle}>Dönüş Uçuşu</Text>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
              <Text style={styles.packageCardSubtitle}>
                {selectedPackage.returnFlight.airline} • {new Date(selectedPackage.returnFlight.departure_time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
              </Text>
              <Text style={styles.packageCardPrice}>{selectedPackage.returnFlight.price}</Text>
            </TouchableOpacity>
          )}

          {/* Accommodation Card */}
          {selectedPackage.accommodation && (
            <TouchableOpacity 
              style={styles.packageCard}
              onPress={() => setShowAccommodationModal(true)}
            >
              <View style={styles.packageCardHeader}>
                <Ionicons name="bed" size={20} color="#2DC44D" />
                <Text style={styles.packageCardTitle}>Konaklama</Text>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
              <Text style={styles.packageCardSubtitle}>
                {selectedPackage.accommodation.name}
              </Text>
              <Text style={styles.packageCardLocation}>
                {selectedPackage.accommodation.location}
              </Text>
              <Text style={styles.packageCardPrice}>{selectedPackage.accommodation.price_per_night}/gece</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Daily Plan Section */}
        {tripData && (
          <View style={styles.dailyPlanSection}>
            <Text style={styles.sectionTitle}>Günlük Plan</Text>
            {renderDailyPlan()}
          </View>
        )}
        
        {/* Gezi Tutarı ve Rezerve Et - Sadece rezerve edilmemiş için göster */}
        {!isReserved && (
          <View style={styles.finalPriceSection}>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalLabel}>Toplam Gezi Tutarı</Text>
              <Text style={styles.totalAmount}>{calculateTotalPrice()} TL</Text>
            </View>
            
            <TouchableOpacity style={styles.finalReserveButton} onPress={handleReservation}>
              <Text style={styles.finalReserveButtonText}>Rezerve Et</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderFlightModal()}
      {renderAccommodationModal()}
      {renderActivityModal()}
      {renderAddActivityModal()}
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
  },
  tripInfoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  tripMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 13,
  },
  tripTitle: {
    flex: 1,
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginRight: 16,
  },
  totalCostContainer: {
    alignSelf: 'center',
    backgroundColor: '#F8FFF9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  totalCostLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalCostAmount: {
    color: '#2DC44D',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  tripMainImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  tripDatesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#757575',
    marginBottom: 13,
    alignSelf: 'flex-start',
  },
  tripDates: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
  },
  separator: {
    color: '#939D9A',
    fontSize: 12,
    fontWeight: '400',
  },
  tripGuests: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
  },
  tripCreated: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
  },
  reserveButton: {
    alignSelf: 'stretch',
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aiCommentsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FFF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  aiCommentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiCommentsTitle: {
    color: '#2DC44D',
    fontSize: 16,
    fontWeight: '600',
  },
  aiCommentsText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  packageSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeaderWithPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalPrice: {
    color: '#2DC44D',
    fontSize: 18,
    fontWeight: '700',
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  packageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  packageCardTitle: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  packageCardSubtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  packageCardLocation: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  packageCardPrice: {
    color: '#2DC44D',
    fontSize: 16,
    fontWeight: '600',
  },
  dailyPlanSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  daySection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#2DC44D',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  dayDate: {
    color: '#666',
    fontSize: 14,
  },
  dayDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  activityTime: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  activityBadge: {
    backgroundColor: '#EAF9ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    left: 12,
    zIndex: 1,
  },
  badgeText: {
    color: '#2DC44D',
    fontSize: 10,
    fontWeight: '500',
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginTop: 8,
  },
  activityInfo: {
    flex: 1,
    marginTop: 8,
  },
  activityName: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityLocation: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  activityPrice: {
    color: '#2DC44D',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  flightOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F8FFF9',
  },
  flightInfo: {
    flex: 1,
  },
  airline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  flightTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2DC44D',
  },
  priceDiff: {
    fontSize: 12,
    color: '#FF6B6B',
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cheapestBadge: {
    fontSize: 12,
    color: '#2DC44D',
    backgroundColor: '#EAF9ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accommodationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accommodationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  accommodationInfo: {
    flex: 1,
  },
  accommodationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accommodationLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2DC44D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  finalPriceSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalAmount: {
    color: '#2DC44D',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  finalReserveButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finalReserveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activityOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityOptionInfo: {
    flex: 1,
  },
  activityOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityOptionLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityOptionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2DC44D',
  },
  deleteActivityOption: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFB8B8',
  },
  deleteOptionText: {
    color: '#FF6B6B',
  },
  addActivityButton: {
    backgroundColor: '#F8FFF9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8F5E8',
    borderStyle: 'dashed',
  },
  addActivityText: {
    color: '#2DC44D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NewTripDetailScreen;
