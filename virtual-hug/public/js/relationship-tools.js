// relationship-tools.js - Interactive relationship tracking functionality

class RelationshipTools {
  constructor() {
    this.countdownInterval = null;
    this.anniversaryInterval = null;
    this.loadStoredData();
    this.initializeCountdown();
    this.initializeAnniversary();
    this.initializeMoodTracker();
    this.initializeGoals();
    this.initializeMilestones();
    this.updateStatistics();
  }

  // Data Storage Methods
  saveData(key, data) {
    localStorage.setItem(`relationship_${key}`, JSON.stringify(data));
  }

  loadData(key, defaultValue = null) {
    const stored = localStorage.getItem(`relationship_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  loadStoredData() {
    // Load stored data
    this.targetDate = this.loadData('targetDate');
    this.relationshipStart = this.loadData('relationshipStart');
    this.moods = this.loadData('moods', []);
    this.goals = this.loadData('goals', []);
    this.milestones = this.loadData('milestones', []);
    this.stats = this.loadData('stats', {
      messagesExchanged: 0,
      hugsGiven: 0,
      memoriesShared: 0,
      encouragementsShared: 0
    });
  }

  // Countdown Timer Functions
  initializeCountdown() {
    if (this.targetDate) {
      document.getElementById('target-date').value = this.targetDate;
      this.startCountdown();
    }
  }

  setCountdown() {
    const targetDateInput = document.getElementById('target-date');
    const targetDate = targetDateInput.value;
    
    if (!targetDate) {
      alert('Please select a date and time! 💕');
      return;
    }

    this.targetDate = targetDate;
    this.saveData('targetDate', targetDate);
    this.startCountdown();
  }

  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(this.targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;

        const messageEl = document.getElementById('countdown-message');
        if (days > 0) {
          messageEl.textContent = `Only ${days} more days until our beautiful moment together! 💕`;
        } else if (hours > 0) {
          messageEl.textContent = `Less than a day left! Just ${hours} hours and ${minutes} minutes! 🥰`;
        } else if (minutes > 0) {
          messageEl.textContent = `So close! Only ${minutes} minutes and ${seconds} seconds left! ✨`;
        } else {
          messageEl.textContent = `Almost there! ${seconds} seconds to go! 💫`;
        }
      } else {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.getElementById('countdown-message').textContent = 'The moment has arrived! 🎉💖';
        clearInterval(this.countdownInterval);
      }
    };

    updateCountdown(); // Update immediately
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Anniversary Functions
  initializeAnniversary() {
    if (this.relationshipStart) {
      document.getElementById('relationship-start').value = this.relationshipStart;
      this.updateAnniversary();
    }
  }

  setAnniversary() {
    const startDateInput = document.getElementById('relationship-start');
    const startDate = startDateInput.value;
    
    if (!startDate) {
      alert('Please select our relationship start date! 💝');
      return;
    }

    this.relationshipStart = startDate;
    this.saveData('relationshipStart', startDate);
    this.updateAnniversary();
  }

  updateAnniversary() {
    if (this.anniversaryInterval) {
      clearInterval(this.anniversaryInterval);
    }

    const updateStats = () => {
      const now = new Date();
      const start = new Date(this.relationshipStart);
      const difference = now - start;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30.44); // Average days per month
      const years = Math.floor(days / 365.25); // Account for leap years

      document.getElementById('relationship-days').textContent = days;
      document.getElementById('relationship-months').textContent = months;
      document.getElementById('relationship-years').textContent = years;
    };

    updateStats(); // Update immediately
    this.anniversaryInterval = setInterval(updateStats, 1000 * 60 * 60); // Update every hour
  }

  // Mood Tracker Functions
  initializeMoodTracker() {
    this.displayMoodHistory();
  }

  selectMood(mood) {
    // Remove previous selection
    document.querySelectorAll('.mood-option').forEach(option => {
      option.classList.remove('selected');
    });

    // Add selection to clicked mood
    const selectedOption = document.querySelector(`[data-mood="${mood}"]`);
    selectedOption.classList.add('selected');

    // Save mood with date
    const today = new Date().toDateString();
    const moodEntry = {
      mood: mood,
      date: today,
      timestamp: Date.now()
    };

    // Remove any existing mood for today
    this.moods = this.moods.filter(entry => entry.date !== today);
    
    // Add new mood
    this.moods.unshift(moodEntry);
    
    // Keep only last 7 days
    this.moods = this.moods.slice(0, 7);
    
    this.saveData('moods', this.moods);
    this.displayMoodHistory();

    // Show confirmation
    setTimeout(() => {
      selectedOption.style.transform = 'scale(1.1)';
      setTimeout(() => {
        selectedOption.style.transform = '';
      }, 200);
    }, 100);
  }

  displayMoodHistory() {
    const timeline = document.getElementById('mood-timeline');
    timeline.innerHTML = '';

    if (this.moods.length === 0) {
      timeline.innerHTML = '<div class="mood-entry">No moods tracked yet. Share how you feel! 💕</div>';
      return;
    }

    this.moods.forEach(entry => {
      const moodDiv = document.createElement('div');
      moodDiv.className = 'mood-entry';
      
      const date = new Date(entry.timestamp);
      const displayDate = date.toLocaleDateString();
      
      const moodEmojis = {
        amazing: '🥰',
        happy: '😊',
        loving: '💕',
        missing: '🥺',
        excited: '🤩',
        grateful: '🙏'
      };

      moodDiv.innerHTML = `${moodEmojis[entry.mood]} ${entry.mood} - ${displayDate}`;
      timeline.appendChild(moodDiv);
    });
  }

  // Goals Functions
  initializeGoals() {
    this.displayGoals();
  }

  addGoal() {
    const goalInput = document.getElementById('new-goal');
    const goalText = goalInput.value.trim();

    if (!goalText) {
      alert('Please enter a goal! 🎯');
      return;
    }

    const goal = {
      id: Date.now(),
      text: goalText,
      completed: false,
      dateAdded: new Date().toDateString()
    };

    this.goals.unshift(goal);
    this.saveData('goals', this.goals);
    this.displayGoals();

    goalInput.value = '';
  }

  toggleGoal(id) {
    const goal = this.goals.find(g => g.id === id);
    if (goal) {
      goal.completed = !goal.completed;
      if (goal.completed) {
        goal.dateCompleted = new Date().toDateString();
      }
      this.saveData('goals', this.goals);
      this.displayGoals();
    }
  }

  deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goals = this.goals.filter(g => g.id !== id);
      this.saveData('goals', this.goals);
      this.displayGoals();
    }
  }

  displayGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';

    if (this.goals.length === 0) {
      goalsList.innerHTML = '<div class="goal-item"><div class="goal-text">No goals set yet. Add your first relationship goal! 💫</div></div>';
      return;
    }

    this.goals.forEach(goal => {
      const goalDiv = document.createElement('div');
      goalDiv.className = `goal-item ${goal.completed ? 'completed' : ''}`;
      
      goalDiv.innerHTML = `
        <div class="goal-text">${goal.text}</div>
        <div class="goal-actions">
          <button class="complete-btn" onclick="relationshipTools.toggleGoal(${goal.id})" title="${goal.completed ? 'Mark as incomplete' : 'Mark as complete'}">
            ${goal.completed ? '✅' : '⭕'}
          </button>
          <button class="delete-btn" onclick="relationshipTools.deleteGoal(${goal.id})" title="Delete goal">
            🗑️
          </button>
        </div>
      `;
      
      goalsList.appendChild(goalDiv);
    });
  }

  // Milestones Functions
  initializeMilestones() {
    this.displayMilestones();
  }

  addMilestone() {
    const milestoneInput = document.getElementById('new-milestone');
    const dateInput = document.getElementById('milestone-date');
    
    const milestoneText = milestoneInput.value.trim();
    const milestoneDate = dateInput.value;

    if (!milestoneText) {
      alert('Please enter a milestone description! 🏆');
      return;
    }

    if (!milestoneDate) {
      alert('Please select a date for the milestone! 📅');
      return;
    }

    const milestone = {
      id: Date.now(),
      text: milestoneText,
      date: milestoneDate,
      dateAdded: new Date().toDateString()
    };

    this.milestones.unshift(milestone);
    this.milestones.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    
    this.saveData('milestones', this.milestones);
    this.displayMilestones();

    milestoneInput.value = '';
    dateInput.value = '';
  }

  deleteMilestone(id) {
    if (confirm('Are you sure you want to delete this milestone?')) {
      this.milestones = this.milestones.filter(m => m.id !== id);
      this.saveData('milestones', this.milestones);
      this.displayMilestones();
    }
  }

  displayMilestones() {
    const milestonesList = document.getElementById('milestones-list');
    milestonesList.innerHTML = '';

    if (this.milestones.length === 0) {
      milestonesList.innerHTML = '<div class="milestone-item"><div class="milestone-text">No milestones recorded yet. Add your first special moment! 🎉</div></div>';
      return;
    }

    this.milestones.forEach(milestone => {
      const milestoneDiv = document.createElement('div');
      milestoneDiv.className = 'milestone-item';
      
      const date = new Date(milestone.date);
      const displayDate = date.toLocaleDateString();
      
      milestoneDiv.innerHTML = `
        <div class="milestone-text">
          <strong>${milestone.text}</strong>
          <br>
          <small>📅 ${displayDate}</small>
        </div>
        <div class="milestone-actions">
          <button class="delete-btn" onclick="relationshipTools.deleteMilestone(${milestone.id})" title="Delete milestone">
            🗑️
          </button>
        </div>
      `;
      
      milestonesList.appendChild(milestoneDiv);
    });
  }

  // Statistics Functions
  updateStatistics() {
    // Update stats from other parts of the app
    this.stats.messagesExchanged = this.loadData('messagesCount', 0);
    this.stats.hugsGiven = this.loadData('hugsCount', 0);
    this.stats.memoriesShared = this.loadData('memoriesCount', 0);
    this.stats.encouragementsShared = this.loadData('encouragementsCount', 0);

    document.getElementById('messages-sent').textContent = this.stats.messagesExchanged;
    document.getElementById('hugs-given').textContent = this.stats.hugsGiven;
    document.getElementById('memories-shared').textContent = this.stats.memoriesShared;
    document.getElementById('encouragements-shared').textContent = this.stats.encouragementsShared;
  }

  // Public method to increment stats from other pages
  incrementStat(statName) {
    if (this.stats.hasOwnProperty(statName)) {
      this.stats[statName]++;
      this.saveData('stats', this.stats);
      
      // Also save individual counters for other pages to access
      const keyMap = {
        messagesExchanged: 'messagesCount',
        hugsGiven: 'hugsCount',
        memoriesShared: 'memoriesCount',
        encouragementsShared: 'encouragementsCount'
      };
      
      if (keyMap[statName]) {
        this.saveData(keyMap[statName], this.stats[statName]);
      }
      
      this.updateStatistics();
    }
  }
}

// Global functions for HTML onclick events
function setCountdown() {
  if (window.relationshipTools) {
    window.relationshipTools.setCountdown();
  }
}

function setAnniversary() {
  if (window.relationshipTools) {
    window.relationshipTools.setAnniversary();
  }
}

function selectMood(mood) {
  if (window.relationshipTools) {
    window.relationshipTools.selectMood(mood);
  }
}

function addGoal() {
  if (window.relationshipTools) {
    window.relationshipTools.addGoal();
  }
}

function addMilestone() {
  if (window.relationshipTools) {
    window.relationshipTools.addMilestone();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.relationshipTools = new RelationshipTools();
  
  // Add Enter key support for inputs
  document.getElementById('new-goal').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGoal();
  });
  
  document.getElementById('new-milestone').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMilestone();
  });
});

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RelationshipTools;
}
