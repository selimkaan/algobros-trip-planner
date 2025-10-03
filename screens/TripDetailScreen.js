import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TripPlannerAPI from '../services/TripPlannerAPI';

const { width, height } = Dimensions.get('window');

const TripDetailScreen = ({ navigation, route }) => {
  const [selectedPackage, setSelectedPackage] = useState({
    departureFlight: null,
    returnFlight: null,
    accommodation: null
  });
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'departure' or 'return'

  // Get trip data from navigation params or use default
  const tripData = route?.params?.tripData;
  
  // Initialize selected package with cheapest options
  React.useEffect(() => {
    if (tripData) {
      setSelectedPackage({
        departureFlight: tripData.packageInfo.cheapestDepartureFlight,
        returnFlight: tripData.packageInfo.cheapestReturnFlight,
        accommodation: tripData.packageInfo.cheapestAccommodation
      });
    }
  }, [tripData]);

  // Default data for demo if no API data is available
  const defaultTripDetails = {
    title: '5 Günlük Antalya Deniz ve Romantizm Turu',
    dates: '10 - 14 Eyl',
    guests: '4 kişi',
    created: '3 Ekim 2025\'te Oluşturuldu',
    image: 'https://images.unsplash.com/photo-1544737151-6e4b1999c3d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    mapImage: 'https://images.unsplash.com/photo-1577722560665-1c6e0ee2e4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  // Helper functions
  const formatFlightDates = (flights) => {
    if (!flights || flights.length === 0) return '10 - 14 Eyl';
    const departureDate = new Date(flights[0].departure_time.split(' ')[0].split('.').reverse().join('-'));
    return departureDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

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

  const getCurrentTripDetails = () => {
    if (!tripData) return defaultTripDetails;
    
    return {
      title: tripData.aiComments ? 
        `${tripData.packageInfo.totalDays} Günlük AI Destekli Gezi Planı` : 
        defaultTripDetails.title,
      dates: formatFlightDates([tripData.packageInfo.cheapestDepartureFlight]),
      guests: '2 kişi', // Default
      created: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) + '\'te Oluşturuldu',
      image: defaultTripDetails.image,
      mapImage: defaultTripDetails.mapImage
    };
  };

  const getCurrentDailyPlan = () => {
    return tripData?.dailyPlan || [];
  };

  const itinerary = [
    {
      id: 1,
      type: 'transportation',
      title: 'Uçuş İstanbul → Antalya',
      duration: '41 dakika',
      price: 'From $115',
      badge: 'Ulaşım'
    },
    {
      id: 2,
      type: 'accommodation',
      title: 'Hotel Mille Kaleiçi',
      rating: 'Harika (470 Reviws)',
      price: '$271 gecelik',
      guests: '4 kişi',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Konaklama'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Tekne Turu',
      rating: 'Harika (470 Reviws)',
      price: '$271 per night',
      guests: '4 guests',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Etkinlik'
    },
    {
      id: 4,
      type: 'location',
      title: 'Kaleiçi',
      rating: 'Harika (470 Reviws)',
      price: 'Gecelik 271 dolar',
      guests: '4 misafir',
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Mekan'
    },
    {
      id: 5,
      type: 'location',
      title: 'Kaleiçi',
      rating: 'Harika (470 Reviws)',
      price: 'Gecelik 271 dolar',
      guests: '4 misafir',
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Mekan'
    }
  ];

  const dayDetails = [
    {
      day: 1,
      date: '10 Sep, 2026',
      title: "Gün 1: Antalya'ya Varış ve Kaleiçi Keşfi",
      description: "İstanbul'dan Antalya'ya 1 saatlik uçuşla varış sonrası Hotel Mille Kaleiçi'ne gidiş"
    },
    {
      day: 2,
      date: '11 Sep, 2026', 
      title: 'Gün 2: Özel Yat Turu ve Deniz Keyfi',
      description: "Antalya'nın berrak sularında denizin keyfini çıkarın ve sıcak denizde arkad"
    }
  ];

  return (
    <View style={styles.container}>
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
          <View style={styles.tripDatesContainer}>
            <Text style={styles.tripDates}>{getCurrentTripDetails().dates}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.tripGuests}>{getCurrentTripDetails().guests}</Text>
          </View>
          <Text style={styles.tripCreated}>{getCurrentTripDetails().created}</Text>
        </View>


        {/* Trip Plan Section */}
        <View style={styles.tripPlanSection}>
          {/* Header */}
          <View style={styles.tripPlanHeader}>
            <Text style={styles.sectionTitle}>Gezi Planı</Text>
          </View>

          {/* Destination Header */}
          <View style={styles.destinationHeader}>
            <View style={styles.destinationInfo}>
              <View style={styles.destinationCircle}>
                <Text style={styles.destinationCircleText}>1</Text>
              </View>
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationCity}>Antalya, Turkey</Text>
                <Text style={styles.destinationDuration}>(Day 1-5)</Text>
              </View>
            </View>
            <Text style={styles.descriptionText}>
              Antalya, Türkiye'nin en gözde tatil destinasyonlarından biridir ve Eylül ayında deniz temelli aktiviteler için mükemmel bir
            </Text>
            <Text style={styles.readMore}>... Daha fazla oku</Text>
          </View>

          {/* Day Detail Card */}
          <View style={styles.dayDetailCard}>
            <Text style={styles.dayDescription}>{dayDetails[0].description}</Text>
            <Text style={styles.dayDate}>{dayDetails[0].date}</Text>
            <Text style={styles.dayTitle}>{dayDetails[0].title}</Text>
            <Text style={styles.readMore}>... Daha fazla oku</Text>
          </View>

          {/* Timeline Container */}
          <View style={styles.timelineContainer}>
            {/* Transportation Item */}
            <View style={styles.timelineItem}>
              <View style={styles.transportationCard}>
                <View style={styles.transportIcon}>
                  <Ionicons name="airplane" size={24} color="#2DC44D" />
                </View>
                <View style={styles.transportInfo}>
                  <Text style={styles.transportTitle}>Uçuş İstanbul → Antalya</Text>
                  <Text style={styles.transportDetails}>41 dakika | From $115</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
            </View>

            {/* Connector Line */}
            <View style={styles.timelineConnector} />

            {/* Itinerary Items with Timeline */}
            {itinerary.slice(1, -1).map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.itemBadgeContainer}>
                  <View style={styles.itemBadge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                </View>
                <View style={styles.accommodationCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemTextBlock}>
                    <Text style={styles.itemRating}>{item.rating}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemGuests}>{item.guests}</Text>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#343330" />
                </View>
                {index < itinerary.slice(1, -1).length - 1 && <View style={styles.timelineConnector} />}
              </View>
            ))}

            {/* Add Button */}
            <View style={styles.addButtonContainer}>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="black" />
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* Separator Line */}
            <View style={styles.separatorLine} />

            {/* Day 2 Card */}
            <View style={styles.dayDetailCard2}>
              <Text style={styles.dayDescription}>{dayDetails[1].description}</Text>
              <Text style={styles.dayDate}>{dayDetails[1].date}</Text>
              <Text style={styles.dayTitle}>{dayDetails[1].title}</Text>
              <Text style={styles.readMore}>... Daha fazla oku</Text>
            </View>

            {/* Final Activity Card */}
            <View style={styles.timelineItem}>
              <View style={styles.itemBadgeContainer}>
                <View style={styles.itemBadge}>
                  <Text style={styles.badgeText}>Etkinlik</Text>
                </View>
              </View>
              <View style={styles.accommodationCard}>
                <Image source={{ uri: itinerary[2].image }} style={styles.itemImage} />
                <View style={styles.itemTextBlock}>
                  <Text style={styles.itemRating}>Harika (470 Değerlendirme)</Text>
                  <Text style={styles.itemPrice}>Gecelik 271 Dolar</Text>
                  <Text style={styles.itemGuests}>4 misafir</Text>
                  <Text style={styles.itemTitle}>Tekne Turu</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DC44D',
  },
  header: {
    width: width,
    height: 52,
    paddingTop: 4,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2DC44D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    fontFamily: 'Open Sans',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  tripInfoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    padding: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
    minHeight: 333,
  },
  tripMainInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 13,
  },
  tripTitle: {
    width: 174,
    color: '#000',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
  },
  tripMainImage: {
    width: 121,
    height: 121,
    borderRadius: 10,
  },
  tripDatesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#757575',
    marginBottom: 13,
  },
  tripDates: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
  },
  separator: {
    color: '#939D9A',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
  },
  tripGuests: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
  },
  tripCreated: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
  },
  tripPlanSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tripPlanHeader: {
    paddingTop: 26,
    paddingHorizontal: 26,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#939D9A',
  },
  sectionTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 36,
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  destinationHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    paddingLeft: 24,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 16,
  },
  destinationCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationCircleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 34.29,
    fontFamily: 'Inter',
  },
  destinationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destinationCity: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 34.29,
    letterSpacing: 0.18,
    fontFamily: 'Inter',
  },
  destinationDuration: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 34.29,
    fontFamily: 'Inter',
  },
  destinationDescription: {
    marginLeft: 0,
  },
  descriptionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.14,
    fontFamily: 'Inter',
    marginBottom: 1,
    marginLeft: 0,
  },
  readMore: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.14,
    fontFamily: 'Inter',
  },
  dayDetailCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    gap: 4,
  },
  dayDetailCard2: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    gap: 4,
  },
  dayDescription: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.14,
    fontFamily: 'Inter',
  },
  dayDate: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  dayTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  timelineContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    position: 'relative',
  },

  timelineItem: {
    position: 'relative',
    marginBottom: 10,
  },
  transportationCard: {
    marginLeft: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    height: 68,
  },
  transportIcon: {
    width: 48,
    height: 48,
    padding: 4,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transportInfo: {
    flex: 1,
    marginLeft: 8,
    gap: 8,
  },
  transportTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.14,
    fontFamily: 'Inter',
  },
  transportDetails: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.12,
    fontFamily: 'Inter',
  },
  timelineConnector: {
    position: 'absolute',
    left: 50,
    top: -10,
    width: 0,
    height: 17,
    borderLeftWidth: 2,
    borderLeftColor: '#E4E4E4',
    borderStyle: 'dashed',
  },
  itemBadgeContainer: {
    position: 'absolute',
    left: 39,
    top: -13,
    zIndex: 1,
  },
  itemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#EAF9ED',
    borderRadius: 8,
  },
  badgeText: {
    color: '#2DC44D',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.12,
    fontFamily: 'Inter',
  },
  accommodationCard: {
    marginLeft: 26,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    height: 148,
  },
  itemImage: {
    width: 94,
    height: 94,
    borderRadius: 6,
  },
  itemTextBlock: {
    flex: 1,
    marginLeft: 17,
    justifyContent: 'center',
  },
  itemRating: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  itemPrice: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  itemGuests: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  itemTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  addButtonContainer: {
    marginLeft: 44,
    marginTop: 24,
  },
  addButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#fff',
  },
  addButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 24,
    marginVertical: 24,
  },
});

export default TripDetailScreen;