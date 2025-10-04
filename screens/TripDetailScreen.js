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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TripDetailScreen = ({ navigation }) => {
  const [isDestinationExpanded, setIsDestinationExpanded] = useState(false);
  const [isDay1Expanded, setIsDay1Expanded] = useState(false);
  const [isDay2Expanded, setIsDay2Expanded] = useState(false);
  const tripDetails = {
    title: '5 Günlük Antalya Deniz ve Romantizm Turu',
    dates: '10 - 14 Eyl',
    guests: '4 kişi',
    created: '3 Ekim 2025\'te Oluşturuldu',
    image: 'https://images.unsplash.com/photo-1544737151-6e4b1999c3d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    mapImage: 'https://images.unsplash.com/photo-1577722560665-1c6e0ee2e4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
      startingTime: 'Saat: 14.00',
      price: 'Gecelik 271 dolar',
      guests: '4 kişi',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Konaklama'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Tekne Turu',
      startingTime: 'Saat: 09.00',
      price: 'Gecelik 270 dolar',
      guests: '4 misafir',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Etkinlik'
    },
    {
      id: 4,
      type: 'location',
      title: 'Kaleiçi',
      startingTime: 'Saat: 16.00',
      price: 'Gecelik 271 dolar',
      guests: '4 misafir',
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      badge: 'Mekan'
    },
    {
      id: 5,
      type: 'location',
      title: 'Kaleiçi',
      startingTime: 'Saat: 18.00',
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
      shortDescription: "İstanbul'dan Antalya'ya 1 saatlik uçuşla varış sonrası Hotel Mille Kaleiçi'ne gidiş",
      fullDescription: "İstanbul'dan Antalya'ya yaklaşık 1 saatlik uçuşla varışınızın ardından, Akra Antalya oteline giriş yapacaksınız. Otelde kısa bir dinlenmenin ardından, ailenizle birlikte Antalya'nın en güzel plajlarından biri olan Konyaaltı Plajı (Konyaaltı Plajı)'nda denizin ve güneşin tadını çıkarabilirsiniz. Akşam yemeği için otelin yakınlarında bulunan ve deniz ürünleriyle ünlü 7 Mehmet restoranını öneririm. Burada taze ve lezzetli yemeklerin keyfini çıkarabilirsiniz."
    },
    {
      day: 2,
      date: '11 Sep, 2026', 
      title: 'Gün 2: Özel Yat Turu ve Deniz Keyfi',
      shortDescription: "Antalya'nın berrak sularında denizin keyfini çıkarın ve sıcak denizde arkad",
      fullDescription: "Sabah erken saatlerde, doğa ve macera seven aileler için harika bir seçenek olan Köprülü Canyon Antalya: Whitewater Rafting Trip turuna katılabilirsiniz. Yaklaşık 5 saat süren bu turda, nehirde rafting yapacak, berrak sularda yüzme molası verecek ve nehir kenarında lezzetli bir öğle yemeği yiyeceksiniz. Tur sonrası Antalya'nın tarihi bölgesi Antalya Eski Şehir (Kaleiçi)'ni keşfedebilirsiniz. Burada Hadrian Kapısı, Saat Kulesi ve Antalya Marinası (Kaleiçi Yat Limanı) gibi önemli noktaları gezebilirsiniz. Akşam yemeği için Kaleiçi'nde bulunan ve yerel lezzetler sunan Seraser Fine Dining Restaurant ideal bir tercih olacaktır."
    }
  ];

  const destinationExpandedText = "Antalya, Türkiye'nin en popüler tatil destinasyonlarından biridir ve özellikle aileler için ideal deniz tatili sunar. Ekim ayında hava genellikle ılık ve deniz suyu yüzmeye uygundur, bu da 8-10 Ekim tarihleri arasında rahat bir tatil yapmanızı sağlar. Antalya'nın güzel plajları, kaliteli otelleri ve zengin kültürel mirası ile unutulmaz bir deneyim yaşayabilirsiniz. Ekim ayında hava genellikle ılık olsa da, akşamları serin olabilir, yanınıza hafif bir ceket almanızı öneririm.";

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
            <Text style={styles.tripTitle}>{tripDetails.title}</Text>
            <Image source={require('../assets/image_detail.png')} style={styles.tripMainImage} />
          </View>
          <View style={styles.tripDatesContainer}>
            <Text style={styles.tripDates}>{tripDetails.dates}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.tripGuests}>{tripDetails.guests}</Text>
          </View>
          <Text style={styles.tripCreated}>{tripDetails.created}</Text>
          
          {/* Payment Details Section */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Enuygun Ödemesi</Text>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Uçak Bileti</Text>
              <Text style={styles.paymentAmount}>$5.120</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Konaklama</Text>
              <Text style={styles.paymentAmount}>$5.205</Text>
            </View>
            <View style={styles.paymentSeparator} />
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Toplam</Text>
              <Text style={styles.totalAmount}>$10.315</Text>
            </View>
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Rezerve Et</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </TouchableOpacity>
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
                <Text style={styles.destinationDuration}>(Gün 1-5)</Text>
              </View>
            </View>
            <Text style={styles.descriptionText}>
              {isDestinationExpanded 
                ? destinationExpandedText 
                : "Antalya, Türkiye'nin en gözde tatil destinasyonlarından biridir ve Eylül ayında deniz temelli aktiviteler için mükemmel bir"
              }
            </Text>
            {!isDestinationExpanded && (
              <TouchableOpacity onPress={() => setIsDestinationExpanded(true)}>
                <Text style={styles.readMore}>... Daha fazla oku</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Day Detail Card */}
          <View style={styles.dayDetailCard}>
            <Text style={styles.dayTitle}>{dayDetails[0].title}</Text>
            <Text style={styles.dayDate}>{dayDetails[0].date}</Text>
            <Text style={styles.dayDescription}>
              {isDay1Expanded ? dayDetails[0].fullDescription : dayDetails[0].shortDescription}
            </Text>
            {!isDay1Expanded && (
              <TouchableOpacity onPress={() => setIsDay1Expanded(true)}>
                <Text style={styles.readMore}>... Daha fazla oku</Text>
              </TouchableOpacity>
            )}
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
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemRating}>{item.startingTime}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemGuests}>{item.guests}</Text>
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
              <Text style={styles.dayTitle}>{dayDetails[1].title}</Text>
              <Text style={styles.dayDate}>{dayDetails[1].date}</Text>
              <Text style={styles.dayDescription}>
                {isDay2Expanded ? dayDetails[1].fullDescription : dayDetails[1].shortDescription}
              </Text>
              {!isDay2Expanded && (
                <TouchableOpacity onPress={() => setIsDay2Expanded(true)}>
                  <Text style={styles.readMore}>... Daha fazla oku</Text>
                </TouchableOpacity>
              )}
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
                  <Text style={styles.itemTitle}>Tekne Turu</Text>
                  <Text style={styles.itemRating}>Saat: 15.00</Text>
                  <Text style={styles.itemPrice}>Gecelik 270 Dolar</Text>
                  <Text style={styles.itemGuests}>4 misafir</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#343330" />
              </View>
            </View>
          </View>
        </View>

        {/* Payment Card */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentCardTitle}>Enuygun Ödemesi</Text>
          <View style={styles.paymentCardItem}>
            <Text style={styles.paymentCardLabel}>Uçak Bileti</Text>
            <Text style={styles.paymentCardAmount}>$5.120</Text>
          </View>
          <View style={styles.paymentCardItem}>
            <Text style={styles.paymentCardLabel}>Konaklama</Text>
            <Text style={styles.paymentCardAmount}>$5.205</Text>
          </View>
          <View style={styles.paymentCardSeparator} />
          <View style={styles.paymentCardItem}>
            <Text style={styles.paymentCardLabel}>Toplam</Text>
            <Text style={styles.paymentCardTotal}>$10.315</Text>
          </View>
          
          {/* Reserve Button */}
          <TouchableOpacity 
            style={styles.reserveButton}
            onPress={() => navigation.navigate('Confirmation')}
          >
            <Text style={styles.reserveButtonText}>Hemen Rezerve Et</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </TouchableOpacity>
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
    height: 82,
    paddingTop: 24,
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
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
    justifyContent: 'flex-start',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
    padding: 4,
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
  paymentSection: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  paymentTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  paymentAmount: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  totalAmount: {
    color: '#2DC44D',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 8,
  },
  addToCartButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 14,
    includeFontPadding: false,
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
    marginHorizontal: 0,
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    gap: 4,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCardTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  paymentCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentCardLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  paymentCardAmount: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  paymentCardTotal: {
    color: '#2DC44D',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  paymentCardSeparator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 12,
  },
  reserveButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    width: '100%',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
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
    paddingLeft: 0,
    paddingRight: 0,
    position: 'relative',
    marginHorizontal: 24,
  },

  timelineItem: {
    position: 'relative',
    marginBottom: 32,
  },
  transportationCard: {
    width: 310,
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
    left: 24,
    top: -16,
    width: 0,
    height: 32,
    borderLeftWidth: 2,
    borderLeftColor: '#E4E4E4',
    borderStyle: 'dashed',
  },
  itemBadgeContainer: {
    position: 'absolute',
    left: 13,
    top: -19,
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
    width: 310,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    height: 118,
  },
  itemImage: {
    width: 94,
    height: 94,
    borderRadius: 6,
  },
  itemTextBlock: {
    flex: 1,
    marginLeft: 17,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    marginBottom: 0,
  },
  itemTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  addButtonContainer: {
    marginLeft: 0,
    marginTop: -20,
    marginBottom: 16,
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
    marginLeft: 0,
    marginRight: 24,
    marginTop: 32,
    marginBottom: 32,
  },
});

export default TripDetailScreen;