/* ============================================
   BREAKFAST WHEEL - JAVASCRIPT
   Section 1: Setup & Variables
   ============================================ */

// ===== FIND ELEMENTS ON THE PAGE =====
// Think of this like labeling all the switches and buttons in your house

// Get the card container (where all breakfast cards live)
const cardTrack = document.getElementById('cardTrack');

// Get all the individual breakfast cards
const cards = document.querySelectorAll('.card');

// Get the mood selector dropdown
const moodSelector = document.getElementById('mood');

// Get the buttons
const spinBtn = document.getElementById('spinBtn');
const saveBtn = document.getElementById('saveBtn');
const againBtn = document.getElementById('againBtn');
const shareBtn = document.getElementById('shareBtn');

// Get the result section (hidden initially)
const resultSection = document.getElementById('result');

// Get the result elements (where we'll show the chosen breakfast)
const resultImg = document.getElementById('resultImg');
const resultTitle = document.getElementById('resultTitle');
const resultMeta = document.getElementById('resultMeta');
const resultQuote = document.getElementById('resultQuote');

// Get the footer year span
const yearSpan = document.getElementById('year');

// ===== STORE DATA =====
// Variables are like labeled boxes where we store information

// Array to store all breakfast data
let breakfastData = [];

// Variable to store the currently selected breakfast
let selectedBreakfast = null;

// Variable to track if wheel is currently spinning
let isSpinning = false;

// Array to store favorite breakfasts
let favorites = [];


// ===== LOG A MESSAGE TO CONFIRM JS IS WORKING =====
console.log('🎡 Breakfast Wheel JavaScript loaded!');
console.log('Total cards found:', cards.length);

/* ============================================
   Section 2: Collect Breakfast Data from Cards
   ============================================ */

// Function to extract data from HTML cards and store in JavaScript
function collectBreakfastData() {
  // Clear the array first (in case we run this function multiple times)
  breakfastData = [];
  
  // Loop through each card element
  cards.forEach((card, index) => {
    // Get the image element inside this card
    const img = card.querySelector('img');
    
    // Get the h3 (title) element inside this card
    const title = card.querySelector('h3');
    
    // Get the meta (calories/category) element
    const meta = card.querySelector('.meta');
    
    // Get the mood data attribute
    const moods = card.getAttribute('data-mood');
    
    // Create an object (like a box) to store all this card's data
    const breakfastItem = {
      id: index,                              // Unique number (0, 1, 2, etc.)
      name: title ? title.textContent : '',   // "Pancakes & Syrup"
      image: img ? img.src : '',              // Image URL
      alt: img ? img.alt : '',                // Image description
      meta: meta ? meta.textContent : '',     // "Comfort • 520 kcal"
      moods: moods ? moods.split(',') : ['any'], // ['comfort'] or ['healthy', 'rushed']
      element: card                           // The actual HTML element (for animations)
    };
    
    // Add this breakfast item to our array
    breakfastData.push(breakfastItem);
  });
  
  // Log to console so we can see what we collected
  console.log('📊 Breakfast data collected:', breakfastData);
  console.log('Total breakfasts:', breakfastData.length);
}

// Run the function to collect data when page loads
collectBreakfastData();

/* ============================================
   Section 3: Mood Filter Functionality
   ============================================ */

// Function to filter cards based on selected mood
function filterCardsByMood(selectedMood) {
  console.log('🔍 Filtering by mood:', selectedMood);
  
  // Loop through each card
  cards.forEach((card, index) => {
    // Get the breakfast data for this card
    const breakfast = breakfastData[index];
    
    // Check if we should show this card
    let shouldShow = false;
    
    if (selectedMood === 'any') {
      // If "Any mood" is selected, show ALL cards
      shouldShow = true;
    } else {
      // Check if this breakfast matches the selected mood
      shouldShow = breakfast.moods.includes(selectedMood);
    }
    
    // Show or hide the card with animation
    if (shouldShow) {
      // Show the card
      card.style.display = 'block';
      
      // Animate it in (fade in + slide)
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0) scale(1)';
      }, 10);
      
    } else {
      // Hide the card
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px) scale(0.95)';
      
      // After animation, actually hide it
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
  
  // Count how many cards are visible
  const visibleCount = breakfastData.filter(b => {
    return selectedMood === 'any' || b.moods.includes(selectedMood);
  }).length;
  
  console.log('✅ Showing', visibleCount, 'breakfast options');
}

// Function to handle mood selector change
function handleMoodChange() {
  // Get the selected value from dropdown
  const selectedMood = moodSelector.value;
  
  console.log('🎭 Mood changed to:', selectedMood);
  
  // Filter the cards
  filterCardsByMood(selectedMood);
}

// Listen for changes on the mood selector
moodSelector.addEventListener('change', handleMoodChange);

// Set initial card styles for animation
cards.forEach(card => {
  card.style.transition = 'all 0.3s ease';
  card.style.opacity = '1';
  card.style.transform = 'translateX(0) scale(1)';
});

console.log('🎭 Mood filter initialized!');

/* ============================================
   Section 4: Spin Animation
   ============================================ */

// Function to get random breakfast from visible cards
function getRandomBreakfast() {
  // Get currently selected mood
  const selectedMood = moodSelector.value;
  
  // Filter breakfast data based on mood
  let availableBreakfasts = breakfastData.filter(b => {
    return selectedMood === 'any' || b.moods.includes(selectedMood);
  });
  
  // If no breakfasts match (shouldn't happen, but safety check)
  if (availableBreakfasts.length === 0) {
    availableBreakfasts = breakfastData; // Use all breakfasts as fallback
  }
  
  // Get random index
  const randomIndex = Math.floor(Math.random() * availableBreakfasts.length);
  
  // Return the random breakfast
  return availableBreakfasts[randomIndex];
}

// Function to animate the spin
// Function to animate the spin - IMPROVED VERSION!
// Function to animate the spin - FIXED TO SHOW MOVEMENT!
function animateSpin() {
  // Prevent multiple spins at once
  if (isSpinning) {
    console.log('⏳ Already spinning! Please wait...');
    return;
  }
  
  // Set spinning state to true
  isSpinning = true;
  
  console.log('🎡 Spinning the wheel...');
  
  // Disable the spin button
  spinBtn.disabled = true;
  spinBtn.style.opacity = '0.6';
  spinBtn.style.cursor = 'not-allowed';
  spinBtn.textContent = 'Spinning...';
  
  // Select the winner FIRST
  selectedBreakfast = getRandomBreakfast();
  console.log('🎯 Target:', selectedBreakfast.name);
  
  // Get card measurements
  const selectedCard = selectedBreakfast.element;
  const cardWidth = selectedCard.offsetWidth;
  const gap = 24; // From CSS
  const selectedIndex = Array.from(cards).indexOf(selectedCard);
  
  // Calculate how far to scroll to center the selected card
  const trackWidth = cardTrack.offsetWidth;
  const scrollTarget = (selectedIndex * (cardWidth + gap)) - (trackWidth / 2) + (cardWidth / 2);
  
  // SPIN EFFECT: Make cards flash and pulse
  let pulseCount = 0;
  const pulseInterval = setInterval(() => {
    cards.forEach((card, index) => {
      const isRandomHot = Math.random() > 0.6; // 40% chance to highlight
      
      if (isRandomHot) {
        card.style.transform = 'scale(1.08)';
        card.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.5)';
      } else {
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 4px 6px rgba(45, 27, 14, 0.05)';
      }
    });
    
    pulseCount++;
    if (pulseCount >= 25) {
      clearInterval(pulseInterval);
    }
  }, 120); // Pulse every 120ms
  
  // SCROLL EFFECT: Smoothly scroll to the winner
  // Phase 1: Fast scroll (3 loops of all cards)
  const extraDistance = (cardWidth + gap) * cards.length * 3; // 3 full rotations
  const totalDistance = extraDistance + scrollTarget;
  
  // Make it scroll visibly!
  cardTrack.style.transition = 'scroll-left 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  
  // Create a scrolling effect by gradually scrolling
  let currentScroll = 0;
  const scrollInterval = setInterval(() => {
    currentScroll += 15; // Scroll 15px each frame
    
    if (currentScroll >= totalDistance) {
      currentScroll = totalDistance;
      clearInterval(scrollInterval);
    }
    
    // Scroll the track
    cardTrack.scrollLeft = currentScroll;
  }, 30); // Update every 30ms (smooth animation)
  
  // After spin completes
  setTimeout(() => {
    clearInterval(pulseInterval);
    clearInterval(scrollInterval);
    
    // Highlight the WINNER card
    cards.forEach(card => {
      card.style.transition = 'all 0.5s ease';
      
      if (card === selectedCard) {
        card.style.transform = 'scale(1.15)';
        card.style.boxShadow = '0 20px 60px rgba(255, 107, 53, 0.8)';
        card.style.filter = 'brightness(1.2)';
      } else {
        card.style.transform = 'scale(0.85)';
        card.style.opacity = '0.3';
        card.style.filter = 'blur(3px)';
      }
    });
    
    console.log('✨ Winner highlighted!');
    
    // Show result after dramatic pause
    setTimeout(() => {
      showResult();
      
      // Reset cards for next spin
      setTimeout(() => {
        cards.forEach(card => {
          card.style.transform = 'scale(1)';
          card.style.opacity = '1';
          card.style.filter = 'brightness(1)';
          card.style.boxShadow = '0 4px 6px rgba(45, 27, 14, 0.05)';
        });
        
        // Scroll back to beginning
        cardTrack.scrollLeft = 0;
      }, 500);
      
      // Re-enable spin button
      isSpinning = false;
      spinBtn.disabled = false;
      spinBtn.style.opacity = '1';
      spinBtn.style.cursor = 'pointer';
      spinBtn.textContent = 'Spin';
      
      console.log('✅ Ready to spin again!');
    }, 1200);
    
  }, 3500); // Match scroll duration
}

// Add click event listener to spin button
spinBtn.addEventListener('click', animateSpin);

console.log('🎡 Spin functionality initialized!');

/* ============================================
   Section 5: Show Result
   ============================================ */

// Function to generate a fun quote based on breakfast
function generateQuote(breakfast) {
  // Different quotes for different moods
  const quotes = {
    comfort: [
      "Sometimes you just need a warm hug in food form! 🤗",
      "Comfort food that wraps you in deliciousness!",
      "The perfect choice for a cozy morning!",
      "Because comfort should always be on the menu!"
    ],
    healthy: [
      "Fuel your body, fuel your day! 💪",
      "A nutritious start to your morning adventure!",
      "Health and happiness in every bite!",
      "Your body will thank you for this choice!"
    ],
    rushed: [
      "Quick, delicious, and ready when you are! ⚡",
      "No time to waste, just time to taste!",
      "Fast food that doesn't compromise on flavor!",
      "On-the-go goodness at its finest!"
    ],
    relaxed: [
      "Take your time and savor every moment! ☕",
      "Because mornings are meant to be enjoyed!",
      "Slow down and treat yourself right!",
      "The art of a leisurely breakfast!"
    ],
    any: [
      "A delicious choice to start your day! 🌅",
      "Breakfast done right!",
      "The wheel has spoken, and it's delicious!",
      "Your perfect morning match!"
    ]
  };
  
  // Get the first mood from the breakfast
  const mood = breakfast.moods[0] || 'any';
  
  // Get quotes for that mood
  const moodQuotes = quotes[mood] || quotes.any;
  
  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * moodQuotes.length);
  
  return moodQuotes[randomIndex];
}

// Function to show the result section
function showResult() {
  console.log('🎁 Showing result for:', selectedBreakfast.name);
  
  // Fill in the result data
  resultImg.src = selectedBreakfast.image;
  resultImg.alt = selectedBreakfast.alt;
  resultTitle.textContent = selectedBreakfast.name;
  resultMeta.textContent = selectedBreakfast.meta;
  resultQuote.textContent = generateQuote(selectedBreakfast);
  
  // Hide the wheel section SMOOTHLY (don't use display: none yet!)
  cardTrack.style.opacity = '0';
  cardTrack.style.transform = 'translateY(-20px)';
  cardTrack.style.transition = 'all 0.4s ease';
  
  // ONLY hide display after fade animation completes
  setTimeout(() => {
    cardTrack.style.display = 'none';
    spinBtn.parentElement.style.display = 'none';
  }, 400); // Wait for fade to finish
  
  // Show the result section with animation
  resultSection.hidden = false;
  resultSection.style.opacity = '0';
  resultSection.style.transform = 'translateY(30px)';
  resultSection.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  setTimeout(() => {
    resultSection.style.opacity = '1';
    resultSection.style.transform = 'translateY(0)';
  }, 50);
  
  console.log('✨ Result displayed!');
}

console.log('🎁 Result display functionality initialized!');

/* ============================================
   Section 6: Spin Again (Reset)
   ============================================ */

// Function to reset and return to wheel
function resetToWheel() {
  console.log('🔄 Resetting to wheel...');
  
  // Hide result section with animation
  resultSection.style.opacity = '0';
  resultSection.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    resultSection.hidden = true;
    
    // Show wheel and controls again
    spinBtn.parentElement.style.display = 'flex';
    cardTrack.style.display = 'flex';
    
    // Animate them back in
    setTimeout(() => {
      cardTrack.style.transition = 'all 0.4s ease';
      cardTrack.style.opacity = '1';
      cardTrack.style.transform = 'translateY(0)';
      
      // Reset selected breakfast
      selectedBreakfast = null;
      
      console.log('✅ Ready to spin again!');
    }, 50);
    
  }, 300);
}

// Add click event listener to "Spin Again" button
againBtn.addEventListener('click', resetToWheel);

console.log('🔄 Spin Again functionality initialized!');

/* ============================================
   Section 7: Copy/Share Functionality
   ============================================ */

// Function to copy result to clipboard
function copyResultToClipboard() {
  // Create the text to copy
  const textToCopy = `🍳 My Breakfast Choice: ${selectedBreakfast.name}\n${selectedBreakfast.meta}\n\nTry the Breakfast Wheel: [Your URL here]`;
  
  // Modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('📋 Copied to clipboard!');
        
        // Show feedback to user
        const originalText = shareBtn.textContent;
        shareBtn.textContent = '✓ Copied!';
        shareBtn.style.backgroundColor = 'var(--green-fresh)';
        shareBtn.style.color = 'white';
        shareBtn.style.borderColor = 'var(--green-fresh)';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          shareBtn.textContent = originalText;
          shareBtn.style.backgroundColor = '';
          shareBtn.style.color = '';
          shareBtn.style.borderColor = '';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Could not copy. Please try again!');
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('📋 Copied to clipboard (fallback method)!');
      
      shareBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        shareBtn.textContent = 'Share';
      }, 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Could not copy. Please try manually!');
    }
    
    document.body.removeChild(textArea);
  }
}

// Add click event listener to share button
shareBtn.addEventListener('click', copyResultToClipboard);

console.log('📋 Copy/Share functionality initialized!');

/* ============================================
   Section 8: Auto-Update Footer Year
   ============================================ */

// Function to set current year in footer
function updateFooterYear() {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Set it in the footer
  yearSpan.textContent = currentYear;
  
  console.log('📅 Footer year set to:', currentYear);
}

// Run on page load
updateFooterYear();

console.log('📅 Footer year functionality initialized!');