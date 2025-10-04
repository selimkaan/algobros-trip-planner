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
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      console.log('Response status:', response.status);

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

  // Calculate trip duration from flights
  static calculateTripDuration(departureFlight, returnFlight) {
    if (!departureFlight || !returnFlight) return 4; // default

    const departureDate = new Date(departureFlight.departure_time);
    const returnDate = new Date(returnFlight.departure_time);
    const diffTime = Math.abs(returnDate - departureDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Format dates for display
  static formatTripDates(departureFlight, returnFlight) {
    if (!departureFlight || !returnFlight) return '10 - 14 Eki';

    const departureDate = new Date(departureFlight.departure_time);
    const returnDate = new Date(returnFlight.departure_time);
    
    const options = { day: 'numeric', month: 'short' };
    const departureStr = departureDate.toLocaleDateString('tr-TR', options);
    const returnStr = returnDate.toLocaleDateString('tr-TR', options);
    
    return `${departureStr} - ${returnStr}`;
  }

  // Convert backend itinerary to our daily plan format
  static processDailyPlan(itinerary) {
    if (!itinerary || itinerary.length === 0) return [];

    return itinerary.map((dayData, index) => ({
      day: index + 1,
      date: dayData.date,
      title: dayData.title,
      description: dayData.description,
      activities: dayData.schedule.map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
        time: item.time,
        type: item.type,
        price: item.type === 'activity' ? '30 EUR' : '45 EUR', // fallback prices
        image_url: 'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }))
    }));
  }

  // Distribute activities and attractions across trip days
  static distributeDailyActivities(activities, attractions, tripDays, departureFlight = null) {
    const allActivities = [...(activities || []), ...(attractions || [])];
    
    if (allActivities.length === 0 || tripDays <= 0) {
      return { dailyPlan: [], unusedActivities: [] };
    }

    // Başlangıç tarihini uçuş tarihinden al
    let startDate = new Date();
    if (departureFlight && departureFlight.departure_time) {
      startDate = new Date(departureFlight.departure_time);
    }

    // Karıştır ve rastgele dağıt
    const shuffled = [...allActivities].sort(() => Math.random() - 0.5);
    const dailyPlan = [];
    const activitiesPerDay = Math.max(2, Math.floor(allActivities.length / tripDays));
    
    let activityIndex = 0;

    for (let day = 1; day <= tripDays; day++) {
      // Her gün için tarihi hesapla (departure tarihinden itibaren)
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (day - 1));
      
      const dayActivities = [];
      const timesOfDay = ['09:00', '13:00', '16:00', '19:00'];
      
      for (let i = 0; i < Math.min(activitiesPerDay, timesOfDay.length) && activityIndex < shuffled.length; i++) {
        const activity = shuffled[activityIndex];
        dayActivities.push({
          id: activity.id,
          name: activity.name,
          location: activity.location,
          time: timesOfDay[i],
          type: 'activity',
          price: activity.price || activity.price_per_night || '30 EUR',
          image_url: activity.image_url || 'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        });
        activityIndex++;
      }

      dailyPlan.push({
        day: day,
        date: currentDate.toISOString().split('T')[0],
        title: `${day}. Gün`,
        description: `${day}. gün etkinlikleri`,
        activities: dayActivities
      });
    }

    // Kullanılmayan etkinlikler
    const unusedActivities = shuffled.slice(activityIndex);

    return { dailyPlan, unusedActivities };
  }

  static formatTripData(apiResponse) {
    const {
      departure_flights,
      return_flights,
      accommodations,
      activities,
      attractions,
      itinerary,
      comments
    } = apiResponse;

    // En ucuz seçenekleri bul
    const cheapestDepartureFlight = this.getCheapestFlight(departure_flights);
    const cheapestReturnFlight = this.getCheapestFlight(return_flights);
    const cheapestAccommodation = this.getCheapestAccommodation(accommodations);

    // Gezi süresini hesapla
    const tripDays = this.calculateTripDuration(cheapestDepartureFlight, cheapestReturnFlight);
    
    // Tarih formatını oluştur
    const tripDates = this.formatTripDates(cheapestDepartureFlight, cheapestReturnFlight);

    // Günlük planı işle - eğer itinerary boşsa otomatik oluştur
    let dailyPlan = this.processDailyPlan(itinerary);
    
    // Eğer itinerary boş veya dailyPlan boşsa, activities ve attractions'dan otomatik plan oluştur
    if (!dailyPlan || dailyPlan.length === 0) {
      const { dailyPlan: generatedPlan, unusedActivities } = this.distributeDailyActivities(
        activities || [], 
        attractions || [], 
        tripDays,
        cheapestDepartureFlight  // Başlangıç tarihini almak için
      );
      dailyPlan = generatedPlan;
    }

    return {
      originalData: apiResponse,
      packageInfo: {
        cheapestDepartureFlight,
        cheapestReturnFlight,
        cheapestAccommodation,
        totalDays: tripDays,
        tripDates
      },
      alternativeOptions: {
        departure_flights: departure_flights?.filter(f => f.id !== cheapestDepartureFlight?.id) || [],
        return_flights: return_flights?.filter(f => f.id !== cheapestReturnFlight?.id) || [],
        accommodations: accommodations?.filter(a => a.id !== cheapestAccommodation?.id) || []
      },
      dailyPlan: dailyPlan,
      aiComments: comments,
      allActivities: activities || [],
      allAttractions: attractions || []
    };
  }

  // Calculate total price for selected package
  static calculateTotalPrice(selectedPackage, tripDays) {
    let total = 0;
    
    // Add flight prices
    if (selectedPackage.departureFlight?.price) {
      const departurePrice = parseFloat(selectedPackage.departureFlight.price.replace(/[^\d,]/g, '').replace(',', '.'));
      total += departurePrice;
    }
    
    if (selectedPackage.returnFlight?.price) {
      const returnPrice = parseFloat(selectedPackage.returnFlight.price.replace(/[^\d,]/g, '').replace(',', '.'));
      total += returnPrice;
    }
    
    // Add accommodation price (price per night * number of nights)
    if (selectedPackage.accommodation?.price_per_night) {
      const nightlyPrice = parseFloat(selectedPackage.accommodation.price_per_night.replace(/[^\d,]/g, '').replace(',', '.'));
      total += nightlyPrice * (tripDays - 1); // nights = days - 1
    }
    
    return total;
  }
}

export default TripPlannerAPI;
