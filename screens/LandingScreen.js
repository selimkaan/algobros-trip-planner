import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');

  const handleStartChat = () => {
    if (inputValue.trim()) {
      navigation.navigate('Chat', { initialMessage: inputValue });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Background Image with Rounded Top Corners */}
        <ImageBackground
          source={require('../assets/landing_image.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Gradient Overlay with Content */}
          <LinearGradient
            colors={['#2DC44D', 'rgba(255, 255, 255, 0)']}
            style={styles.gradientOverlay}
          >
            {/* Header Text - Positioned Absolutely */}
            <Text style={styles.brandTitle}>ENUYGUN</Text>
            <Text style={styles.greeting}>İyi akşamlar!</Text>

            {/* Main Content Container */}
            <View style={styles.contentContainer}>
              {/* Main Question */}
              <View style={styles.questionContainer}>
                <Text style={styles.mainQuestion}>
                  Merhaba Selim, bugün nereye gideceksin?
                </Text>
              </View>
              
              {/* Input Container */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.tripInput}
                    placeholder="Seyahat planlamama yardımcı ol"
                    placeholderTextColor="#757575"
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={handleStartChat}
                    multiline
                  />
                  <View style={styles.inputIconsRow}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="attach-outline" size={28} color="#343330" />
                    </TouchableOpacity>
                    <View style={styles.rightIcons}>
                      <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="mic-outline" size={28} color="#343330" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
                        onPress={handleStartChat}
                        disabled={!inputValue.trim()}
                      >
                        <Ionicons name="return-down-forward" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="search" size={24} color="#00A651" />
              <Text style={[styles.navText, styles.activeNavText]}>Seyahat Planla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="briefcase-outline" size={24} color="#999" />
              <Text style={styles.navText}>Seyahatlerim</Text>
            </TouchableOpacity>
          </View>
          <SafeAreaView style={styles.safeAreaBottom} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DC44D',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height - 67, // Full height minus navigation bar
    paddingTop: 174,
    paddingBottom: 175,
    paddingHorizontal: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  brandTitle: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  greeting: {
    position: 'absolute',
    top: 104,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 126,
    width: '100%',
  },
  questionContainer: {
    width: 326,
    alignItems: 'center',
  },
  mainQuestion: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 36,
  },
  inputContainer: {
    width: '100%',
    height: 144,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#939D9A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tripInput: {
    fontSize: 17.77,
    color: '#757575',
    paddingVertical: 0,
    letterSpacing: 0.36,
    flex: 1,
  },
  inputIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  iconButton: {
    width: 35.54,
    height: 35.54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13.33,
  },
  sendButton: {
    backgroundColor: '#2DC44D',
    borderRadius: 18,
    width: 35.54,
    height: 35.54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    width: width,
    height: 67,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 113,
  },
  safeAreaBottom: {
    backgroundColor: '#fff',
  },
  navItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  navText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    letterSpacing: 0.24,
    lineHeight: 15,
  },
  activeNavText: {
    color: '#2DC44D',
    fontWeight: '700',
    letterSpacing: 0.24,
  },
});

export default LandingScreen;
