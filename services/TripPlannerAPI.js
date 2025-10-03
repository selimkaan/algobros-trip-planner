const API_BASE_URL = 'https://terministic-jerlene-overheavily.ngrok-free.dev'; // Backend URL'inizi buraya ekleyin

class TripPlannerAPI {
  static async planTrip(prompt) {
    try {
      console.log('API call started:', `${API_BASE_URL}/agent/mcp`);
      console.log('Request payload:', { prompt });
      
      const response = await fetch(`${API_BASE_URL}/agent/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // ngrok için gerekli header
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Trip planning API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper functions to process the API response
  static getCheapestFlight(flights) {
    if (!flights || flights.length === 0) return null;
    
    return flights.reduce((cheapest, current) => {
      const cheapestPrice = parseFloat(cheapest.price.replace(/[^\d,]/g, '').replace(',', '.'));
      const currentPrice = parseFloat(current.price.replace(/[^\d,]/g, '').replace(',', '.'));
      return currentPrice < cheapestPrice ? current : cheapest;
    });
  }

  static getCheapestAccommodation(accommodations) {
    if (!accommodations || accommodations.length === 0) return null;
    
    return accommodations.reduce((cheapest, current) => {
      const cheapestPrice = parseFloat(cheapest.price_per_night.replace(/[^\d,]/g, '').replace(',', '.'));
      const currentPrice = parseFloat(current.price_per_night.replace(/[^\d,]/g, '').replace(',', '.'));
      return currentPrice < cheapestPrice ? current : cheapest;
    });
  }

  static calculatePriceDifference(basePrice, comparePrice) {
    const base = parseFloat(basePrice.replace(/[^\d,]/g, '').replace(',', '.'));
    const compare = parseFloat(comparePrice.replace(/[^\d,]/g, '').replace(',', '.'));
    return compare - base;
  }

  static distributeDailyActivities(activities, attractions, tripDays) {
    const dailyPlan = [];
    // Activities ve attractions'ı birleştir - hepsini "etkinlik" olarak ele alalım
    const allActivities = [...(activities || []), ...(attractions || [])];
    
    if (allActivities.length === 0) return dailyPlan;
    
    // Shuffle array to randomize distribution
    const shuffledActivities = [...allActivities].sort(() => Math.random() - 0.5);
    
    let activityIndex = 0;
    const remainingActivities = [...shuffledActivities];
    
    for (let day = 1; day <= tripDays; day++) {
      const dayPlan = {
        day: day,
        activities: [] // Tek array'de tüm etkinlikler
      };

      // Her güne minimum 2, maksimum 4 etkinlik ekle
      const minActivities = 2;
      const maxActivities = 4;
      const availableActivities = remainingActivities.length;
      
      // Kalan günlerde dağıtmak için minimum aktivite sayısını hesapla
      const remainingDays = tripDays - day + 1;
      const minNeededForRestDays = (remainingDays - 1) * minActivities;
      const maxCanUseToday = Math.min(maxActivities, availableActivities - minNeededForRestDays);
      const activitiesToUse = Math.max(minActivities, Math.min(maxCanUseToday, Math.floor(Math.random() * (maxActivities - minActivities + 1)) + minActivities));
      
      // Etkinlikleri günün planına ekle
      for (let i = 0; i < activitiesToUse && remainingActivities.length > 0; i++) {
        const activity = remainingActivities.shift();
        if (activity) {
          dayPlan.activities.push({
            ...activity,
            type: 'activity' // Tüm etkinlikler aynı tip
          });
        }
      }
      
      dailyPlan.push(dayPlan);
    }
    
    // Kalan etkinlikleri en son güne ekle veya ayrı bir liste olarak sakla
    const unusedActivities = remainingActivities;

    return {
      dailyPlan,
      unusedActivities // Kullanılmayan etkinlikler
    };
  }

  static formatTripData(apiResponse) {
    const {
      departure_flights,
      return_flights,
      accommodations,
      activites, // API'den "activites" geliyor (typo)
      attractions,
      comments
    } = apiResponse;

    // En ucuz seçenekleri bul
    const cheapestDepartureFlight = this.getCheapestFlight(departure_flights);
    const cheapestReturnFlight = this.getCheapestFlight(return_flights);
    const cheapestAccommodation = this.getCheapestAccommodation(accommodations);

    // Gezi süresini hesapla (tarihlerden)
    let tripDays = 5; // Default
    if (cheapestDepartureFlight && cheapestReturnFlight) {
      const departureDate = new Date(cheapestDepartureFlight.departure_time.split(' ')[0].split('.').reverse().join('-'));
      const returnDate = new Date(cheapestReturnFlight.departure_time.split(' ')[0].split('.').reverse().join('-'));
      tripDays = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
    }

    // Günlük planı oluştur
    const activityDistribution = this.distributeDailyActivities(activites, attractions, tripDays);

    return {
      originalData: apiResponse,
      packageInfo: {
        cheapestDepartureFlight,
        cheapestReturnFlight,
        cheapestAccommodation,
        totalDays: tripDays
      },
      alternativeOptions: {
        departure_flights: departure_flights?.filter(f => f.id !== cheapestDepartureFlight?.id) || [],
        return_flights: return_flights?.filter(f => f.id !== cheapestReturnFlight?.id) || [],
        accommodations: accommodations?.filter(a => a.id !== cheapestAccommodation?.id) || []
      },
      dailyPlan: activityDistribution.dailyPlan || [],
      unusedActivities: activityDistribution.unusedActivities || [],
      aiComments: comments,
      allActivities: activites || [],
      allAttractions: attractions || []
    };
  }
}

export default TripPlannerAPI;
