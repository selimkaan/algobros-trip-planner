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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Köleniz olayım efendim. Hayranım size. Elimden geleni yapacağım. Size yardım etmek istiyorum. Size on numara gezi planlayacağım.Nasıl bir gezi istiyorsunuz?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
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
      
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: "Harika seçim, Mehmet! Antalya'da 5 günlük bir gezi planlamak için birkaç sorum olacak:\n• Nereden hareket edeceksiniz? istanbul'dan mi?\n\n• Kaç kisi seyahat edeceksiniz? Yaninizda baska çiftler var mi?\n\n• Gezi tarihleri kesin mi? Hangi tarihler arasinda planliyorsunuz?\n\n• Gezi amaciniz nedir? Tatil, romantik kaçamak, macera, yoksa bagka bir sey mi?\n\nBu bilgilerle size tam size göre bir Antalya gezisi planlayabilirim!"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  }, [route.params]);

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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      // Check if user provided clear trip instructions to show trip recommendation
      setTimeout(() => {
        const userMessage = inputValue.toLowerCase();
        const isTripRequestClear = 
          userMessage.includes('istanbul') || 
          userMessage.includes('çift') || 
          userMessage.includes('yüzmek') || 
          userMessage.includes('romantik') ||
          (userMessage.includes('gün') && userMessage.includes('antalya'));
        
        if (isTripRequestClear) {
          // Add AI final response with trip recommendation
          const tripResponse = {
            id: Date.now() + 1,
            type: 'ai',
            content: "Mükemmel! Tüm bilgileri aldım. Size özel bir Antalya gezisi hazırladım."
          };
          
          const tripCard = {
            id: Date.now() + 2,
            type: 'tripCard',
            title: '5 Günlük Antalya Deniz ve Romantizm Turu'
          };
          
          setMessages(prev => [...prev, tripResponse, tripCard]);
        } else {
          // Continue asking questions
          const followUpQuestion = {
            id: Date.now() + 1,
            type: 'ai',
            content: 'Birkaç soru daha sormak istiyorum. Konaklama tercihiniz nedir? Otel mi yoksa apart otel mi tercih edersiniz?'
          };
          setMessages(prev => [...prev, followUpQuestion]);
        }
      }, 1000);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
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
                      <Text style={styles.tripTitle}>5 Günlük Antalya Deniz ve Romantiz...</Text>
                      <TouchableOpacity 
                        style={styles.viewButton}
                        onPress={() => navigation.navigate('TripDetail')}
                      >
                        <Text style={styles.viewButtonText}>Görüntüle</Text>
                      </TouchableOpacity>
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
