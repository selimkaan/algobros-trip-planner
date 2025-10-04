import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TripPlannerAPI from '../services/TripPlannerAPI';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]); // Temizledik - sabit mesaj yok
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const scrollViewRef = useRef(null);

  const suggestedTags = ['Deniz ve plaj', 'Tarih ve kültür', 'Doğa ve yürüyüş'];

  useEffect(() => {
    if (route.params?.initialMessage) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: route.params.initialMessage
      };
      setMessages(prev => [...prev, newMessage]);
      
      // İlk mesajı direkt backend'e gönder
      handleInitialMessage(route.params.initialMessage);
    }
  }, [route.params]);

  const handleInitialMessage = async (message) => {
    // Loading mesajı göster
    setIsLoading(true);
    const loadingMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: 'Gezi planınız hazırlanıyor...'
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // API çağrısı yap
      const response = await TripPlannerAPI.planTrip(message);
      
      if (response.success) {
        // Başarılı response
        const formattedTripData = TripPlannerAPI.formatTripData(response.data);
        setTripData(formattedTripData);

        // Loading mesajını kaldır ve gerçek cevabı ekle
        setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
        
        const aiResponse = {
          id: Date.now() + 2,
          type: 'ai',
          content: formattedTripData.aiComments || 'Mükemmel! Size özel bir gezi planı hazırladım.'
        };
        
        const tripCard = {
          id: Date.now() + 3,
          type: 'tripCard',
          title: `${formattedTripData.packageInfo.totalDays} Günlük Gezi Planı`,
          tripData: formattedTripData
        };
        
        setMessages(prev => [...prev, aiResponse, tripCard]);
      } else {
        // Hata durumu
        setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
        const errorMessage = {
          id: Date.now() + 2,
          type: 'ai',
          content: 'Üzgünüm, gezi planını hazırlarken bir sorun yaşandı. Lütfen tekrar deneyin.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error planning initial trip:', error);
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      const errorMessage = {
        id: Date.now() + 2,
        type: 'ai',
        content: 'Üzgünüm, şu anda gezi planlama servisimizde teknik bir sorun var. Lütfen daha sonra tekrar deneyin.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue
      };
      setMessages(prev => [...prev, newMessage]);
      const currentInput = inputValue;
      setInputValue('');
      
      // Her mesaj için backend'e git
      setIsLoading(true);
      const loadingMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Gezi planınız hazırlanıyor...'
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        // API çağrısı yap
        const response = await TripPlannerAPI.planTrip(currentInput);
        
        if (response.success) {
          // Process the API response
          const formattedTripData = TripPlannerAPI.formatTripData(response.data);
          setTripData(formattedTripData);

          // Remove loading message and add AI response
          setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
          
          const aiResponse = {
            id: Date.now() + 2,
            type: 'ai',
            content: formattedTripData.aiComments || 'İşte size özel hazırladığım plan!'
          };
          
          const tripCard = {
            id: Date.now() + 3,
            type: 'tripCard',
            title: `${formattedTripData.packageInfo.totalDays} Günlük Gezi Planı`,
            tripData: formattedTripData
          };
          
          setMessages(prev => [...prev, aiResponse, tripCard]);
        } else {
          // Handle API error
          setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
          const errorMessage = {
            id: Date.now() + 2,
            type: 'ai',
            content: 'Üzgünüm, gezi planını hazırlarken bir sorun yaşandı. Lütfen tekrar deneyin.'
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error('Error planning trip:', error);
        setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
        const errorMessage = {
          id: Date.now() + 2,
          type: 'ai',
          content: 'Üzgünüm, şu anda gezi planlama servisimizde teknik bir sorun var. Lütfen daha sonra tekrar deneyin.'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Helper function to calculate total price
  const calculateTotalPrice = (tripData) => {
    if (!tripData?.packageInfo) return '0';
    
    const { cheapestDepartureFlight, cheapestReturnFlight, cheapestAccommodation, totalDays } = tripData.packageInfo;
    
    const selectedPackage = {
      departureFlight: cheapestDepartureFlight,
      returnFlight: cheapestReturnFlight,
      accommodation: cheapestAccommodation
    };
    
    const total = TripPlannerAPI.calculateTotalPrice(selectedPackage, totalDays);
    return total.toFixed(0);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>ENUYGUN</Text>
        <Text style={styles.pageTitle}>Seyahat Planlayıcı</Text>
      </View>

      {/* Chat Area */}
      <View style={styles.chatArea}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            if (message.type === 'ai') {
              return (
                <View key={message.id} style={styles.aiMessage}>
                  <Text style={styles.messageContent}>{message.content}</Text>
                  {/* Loading indicator for planning messages */}
                  {message.content.includes('hazırlanıyor') && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#2DC44D" />
                    </View>
                  )}
                </View>
              );
            }
            if (message.type === 'user') {
              return (
                <View key={message.id} style={styles.userMessage}>
                  <Text style={styles.userMessageContent}>{message.content}</Text>
                </View>
              );
            }
            if (message.type === 'tripCard') {
              return (
                <View key={message.id} style={styles.tripCard}>
                  <View style={styles.tripCardHeader}>
                    <Ionicons name="airplane-outline" size={16} color="#343330" />
                    <Text style={styles.tripLabel}>Gezi</Text>
                  </View>
                  <View style={styles.tripCardContent}>
                    <View style={styles.tripImageContainer}>
                      <Image 
                        source={require('../assets/plan_rec_image.png')} 
                        style={styles.tripImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.tripDetailsContainer}>
                      <View style={styles.tripDetailsTop}>
                        <Text style={styles.tripTitle}>{message.title}</Text>
                        {message.tripData && (
                          <View style={styles.tripSummary}>
                            <Text style={styles.tripSummaryText}>
                              {message.tripData.packageInfo.tripDates}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.tripDetailsBottom}>
                        {/* Toplam fiyat gösterimi */}
                        {message.tripData && (
                          <Text style={styles.totalPriceText}>
                            Toplam: {calculateTotalPrice(message.tripData)} TL
                          </Text>
                        )}
                        
                        <TouchableOpacity 
                          style={styles.viewButton}
                          onPress={() => navigation.navigate('TripDetail', { tripData: message.tripData })}
                        >
                          <Text style={styles.viewButtonText}>Görüntüle</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputArea}>
        {/* Suggestion Tags - only show when keyboard is not visible */}
        {!isKeyboardVisible && (
          <View style={styles.tagsContainer}>
            {suggestedTags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tagButton}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Input Bar */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.chatInput}
            placeholder="Gezin için düzenleme öner..."
            placeholderTextColor="#757575"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSendMessage}
            multiline
          />
          <View style={styles.inputIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="attach-outline" size={24} color="#343330" />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic-outline" size={24} color="#343330" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Ionicons name="return-down-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingLeft: 30,
    paddingRight: 113,
    backgroundColor: '#2DC44D',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  chatArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -1, // Overlap with header for seamless transition
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    maxWidth: '80%',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  messageContent: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2DC44D',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageContent: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  inputArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  tagButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '400',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#939D9A',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 50,
  },
  chatInput: {
    flex: 1,
    color: '#757575',
    fontSize: 16,
    fontWeight: '400',
    maxHeight: 100,
    paddingVertical: 4,
  },
  inputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 12,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendButton: {
    width: 38,
    height: 38,
    backgroundColor: '#2DC44D',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  tripCard: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 0,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tripCardHeader: {
    width: 57,
    height: 23,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  tripLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  tripCardContent: {
    alignSelf: 'stretch',
    height: 146,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tripImageContainer: {
    width: 134,
    height: 128,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripDetailsContainer: {
    width: 195,
    height: 128,
    padding: 16,
    backgroundColor: '#fff',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 16,
  },
  tripTitle: {
    alignSelf: 'stretch',
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  viewButton: {
    alignSelf: 'stretch',
    height: 33,
    padding: 4,
    backgroundColor: 'rgba(45, 196, 77, 0.20)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    color: '#2DC44D',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
});

export default ChatScreen;
