// Main Application
class MusicStore {
  constructor() {
    this.tracks = [];
    this.currentTrack = null;
    this.audio = new Audio();
    this.queue = [];
    this.favorites = new Set();
    this.recentlyPlayed = [];
    this.comments = {};
    this.waveform = null;
    this.eqSettings = { low: 0, mid: 0, high: 0 };
    this.sleepTimer = null;
    this.isPlaying = false;
    this.volume = 0.8;
    this.muted = false;
    
    this.init();
  }
  
  // Initialize the application
  init() {
    this.loadTracks();
    this.loadFavorites();
    this.loadComments();
    this.setupEventListeners();
    this.setupWaveform();
    this.setInitialTheme();
    this.setupKeyboardShortcuts();
    
    // Audio event listeners
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.playNext.bind(this));
    this.audio.addEventListener('volumechange', this.updateVolumeUI.bind(this));
  }
  
  // Load sample tracks
  loadTracks() {
    this.tracks = [
      { 
        id: 1, 
        title: "Dream Waves", 
        artist: "Artist 1", 
        genre: "Pop", 
        duration: 183,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?pop"
      },
      { 
        id: 2, 
        title: "Neon City", 
        artist: "Artist 2", 
        genre: "Rock", 
        duration: 215,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?rock"
      },
      { 
        id: 3, 
        title: "Velvet Nights", 
        artist: "Artist 3", 
        genre: "Jazz", 
        duration: 247,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?jazz"
      },
      { 
        id: 4, 
        title: "Skyline", 
        artist: "Artist 4", 
        genre: "Pop", 
        duration: 195,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?city"
      },
      { 
        id: 5, 
        title: "Echo Drive", 
        artist: "Artist 5", 
        genre: "Rock", 
        duration: 231,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?concert"
      },
      { 
        id: 6, 
        title: "Smooth Flow", 
        artist: "Artist 6", 
        genre: "Jazz", 
        duration: 276,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?saxophone"
      },
      { 
        id: 7, 
        title: "Firestorm", 
        artist: "Artist 7", 
        genre: "Electronic", 
        duration: 198,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?electronic"
      },
      { 
        id: 8, 
        title: "Crystal Rain", 
        artist: "Artist 8", 
        genre: "Pop", 
        duration: 224,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?rain"
      },
      { 
        id: 9, 
        title: "Mellow Tune", 
        artist: "Artist 9", 
        genre: "Jazz", 
        duration: 263,
        plays: 0,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        imageUrl: "https://source.unsplash.com/random/300x300/?jazz,night"
      }
    ];
    
    // Render tracks after a slight delay to show skeleton loading
    setTimeout(() => {
      this.renderTracks();
    }, 1000);
  }
  
  // Load favorites from localStorage
  loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favorites = new Set(JSON.parse(savedFavorites));
    }
  }
  
  // Load comments from localStorage
  loadComments() {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    } else {
      // Initialize with some sample comments
      this.comments = {
        1: [
          { id: 1, name: "MusicFan", text: "Love this track!", date: "2023-05-15T10:30:00" },
          { id: 2, name: "AudioLover", text: "Perfect for my morning routine", date: "2023-05-16T08:15:00" }
        ],
        2: [
          { id: 1, name: "RockEnthusiast", text: "Great energy in this one!", date: "2023-05-14T18:45:00" }
        ]
      };
      this.saveComments();
    }
  }
  
  // Save comments to localStorage
  saveComments() {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', this.toggleTheme.bind(this));
    
    // High contrast toggle
    document.getElementById('highContrastToggle').addEventListener('click', this.toggleHighContrast.bind(this));
    
    // Genre filter
    document.getElementById('genreFilter').addEventListener('change', (e) => {
      this.renderTracks(e.target.value);
    });
    
    // Sort filter
    document.getElementById('sortFilter').addEventListener('change', (e) => {
      this.sortTracks(e.target.value);
    });
    
    // Search functionality
    document.getElementById('searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.searchTracks(document.getElementById('searchInput').value);
    });
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
      if (e.target.value === '') {
        this.renderTracks();
      }
    });
    
    // Player controls
    document.getElementById('playPauseBtn').addEventListener('click', this.togglePlayPause.bind(this));
    document.getElementById('prevBtn').addEventListener('click', this.playPrevious.bind(this));
    document.getElementById('nextBtn').addEventListener('click', this.playNext.bind(this));
    document.getElementById('progressBar').addEventListener('input', this.seek.bind(this));
    document.getElementById('volumeControl').addEventListener('input', this.setVolume.bind(this));
    document.getElementById('volumeBtn').addEventListener('click', this.toggleMute.bind(this));
    
    // Queue controls
    document.getElementById('queueBtn').addEventListener('click', this.toggleQueue.bind(this));
    document.getElementById('closeQueue').addEventListener('click', this.toggleQueue.bind(this));
    
    // Equalizer controls
    document.getElementById('eqBtn').addEventListener('click', this.toggleEq.bind(this));
    document.getElementById('closeEq').addEventListener('click', this.toggleEq.bind(this));
    document.querySelectorAll('.eq-range').forEach(range => {
      range.addEventListener('input', (e) => {
        this.setEqBand(e.target.dataset.band, parseInt(e.target.value));
      });
    });
    document.querySelectorAll('.eq-preset').forEach(preset => {
      preset.addEventListener('click', (e) => {
        this.applyEqPreset(e.target.dataset.preset);
      });
    });
    
    // Sleep timer controls
    document.getElementById('sleepTimerBtn').addEventListener('click', this.toggleSleepTimer.bind(this));
    document.getElementById('closeSleepTimer').addEventListener('click', this.toggleSleepTimer.bind(this));
    document.querySelectorAll('.timer-option').forEach(option => {
      option.addEventListener('click', (e) => {
        this.setSleepTimer(parseInt(e.target.dataset.minutes));
      });
    });
    document.getElementById('setCustomTimer').addEventListener('click', () => {
      const minutes = parseInt(document.getElementById('customTimer').value);
      if (minutes > 0) {
        this.setSleepTimer(minutes);
      }
    });
    
    // Navigation links
    document.getElementById('favoritesLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showFavorites();
    });
    
    document.getElementById('recentlyPlayedLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showRecentlyPlayed();
    });
    
    // Load more button
    document.getElementById('loadMore').addEventListener('click', this.loadMoreTracks.bind(this));
  }
  
  // Setup waveform visualization
  setupWaveform() {
    this.waveform = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#4a6fa5',
      progressColor: '#166088',
      cursorColor: '#fff',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 20,
      barGap: 2,
      responsive: true
    });
    
    this.waveform.on('ready', () => {
      if (this.isPlaying) {
        this.waveform.play();
      }
    });
    
    this.waveform.on('audioprocess', () => {
      const progress = (this.waveform.getCurrentTime() / this.waveform.getDuration()) * 100;
      document.getElementById('progressBar').value = progress;
      this.updateTimeDisplay(this.waveform.getCurrentTime(), this.waveform.getDuration());
    });
    
    this.waveform.on('seek', (progress) => {
      document.getElementById('progressBar').value = progress * 100;
      if (this.audio.src) {
        this.audio.currentTime = this.audio.duration * progress;
      }
    });
    
    this.waveform.on('finish', () => {
      this.playNext();
    });
  }
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Space for play/pause
      if (e.code === 'Space' && !(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        e.preventDefault();
        this.togglePlayPause();
      }
      
      // Left/Right arrows for seeking
      if (e.code === 'ArrowLeft') {
        this.seekBackward();
      } else if (e.code === 'ArrowRight') {
        this.seekForward();
      }
      
      // Up/Down arrows for volume
      if (e.code === 'ArrowUp') {
        this.increaseVolume();
      } else if (e.code === 'ArrowDown') {
        this.decreaseVolume();
      }
      
      // M for mute
      if (e.code === 'KeyM') {
        this.toggleMute();
      }
    });
  }
  
  // Set initial theme based on preferences
  setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      document.body.classList.add('light-mode');
      document.getElementById('themeIcon').textContent = '🌙';
    } else {
      document.getElementById('themeIcon').textContent = '☀️';
    }
    
    const highContrast = localStorage.getItem('highContrast') === 'true';
    if (highContrast) {
      document.body.classList.add('high-contrast');
    }
  }
  
  // Toggle dark/light theme
  toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    const isLight = body.classList.toggle('light-mode');
    
    if (isLight) {
      localStorage.setItem('theme', 'light');
      icon.textContent = '🌙';
      this.showToast('Switched to Light Mode ☀️');
    } else {
      localStorage.setItem('theme', 'dark');
      icon.textContent = '☀️';
      this.showToast('Switched to Dark Mode 🌙');
    }
  }
  
  // Toggle high contrast mode
  toggleHighContrast() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
    this.showToast(isHighContrast ? 'High Contrast Mode On' : 'High Contrast Mode Off');
  }
  
  // Render tracks based on filter
  renderTracks(filter = 'all') {
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    
    const filteredTracks = filter === 'all' 
      ? this.tracks 
      : this.tracks.filter(track => track.genre === filter);
    
    filteredTracks.forEach(track => {
      const isFavorite = this.favorites.has(track.id.toString());
      const isCurrent = this.currentTrack && this.currentTrack.id === track.id;
      
      const card = document.createElement('div');
      card.className = `col-md-4 ${isCurrent ? 'current-playing' : ''}`;
      card.innerHTML = `
        <div class="card h-100 shadow-sm genre-${track.genre.toLowerCase()}">
          <img src="${track.imageUrl}" class="card-img-top" alt="${track.artist}" />
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${track.id}" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            <i class="fas fa-heart"></i>
          </button>
          <div class="card-body">
            <h5 class="card-title">${track.title}</h5>
            <p class="card-text">${track.artist} — <em>${track.genre}</em></p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${this.formatDuration(track.duration)}</small>
              <small class="text-muted"><i class="fas fa-play"></i> ${track.plays}</small>
            </div>
            <div class="mt-3 d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary play-btn" data-id="${track.id}">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="btn btn-sm btn-outline-secondary queue-btn" data-id="${track.id}">
                <i class="fas fa-plus"></i> Queue
              </button>
              <button class="btn btn-sm btn-outline-info comment-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.play-btn').dataset.id);
        this.playTrack(trackId);
      });
    });
    
    document.querySelectorAll('.queue-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.queue-btn').dataset.id);
        this.addToQueue(trackId);
      });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = e.target.closest('.favorite-btn').dataset.id;
        this.toggleFavorite(trackId);
      });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.comment-btn').dataset.id);
        this.showComments(trackId);
      });
    });
    
    // Initialize comment modal
    const commentModal = document.getElementById('commentModal');
    if (commentModal) {
      commentModal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget;
        const trackId = parseInt(button.getAttribute('data-id'));
        this.showComments(trackId);
      });
      
      document.getElementById('commentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const trackId = parseInt(document.querySelector('.comment-btn[data-bs-target="#commentModal"]').dataset.id);
        const text = document.getElementById('commentText').value;
        const name = document.getElementById('commentName').value;
        
        if (text && name) {
          this.addComment(trackId, name, text);
          document.getElementById('commentText').value = '';
          document.getElementById('commentName').value = '';
        }
      });
    }
  }
  
  // Sort tracks
  sortTracks(sortBy) {
    switch (sortBy) {
      case 'title':
        this.tracks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'artist':
        this.tracks.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'popularity':
        this.tracks.sort((a, b) => b.plays - a.plays);
        break;
      case 'recent':
        // Assuming newer tracks have higher IDs
        this.tracks.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sorting (original order)
        this.tracks.sort((a, b) => a.id - b.id);
    }
    
    this.renderTracks(document.getElementById('genreFilter').value);
  }
  
  // Search tracks
  searchTracks(query) {
    if (!query) {
      this.renderTracks();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filteredTracks = this.tracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) || 
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.genre.toLowerCase().includes(lowerQuery)
    );
    
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    
    if (filteredTracks.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <h4>No tracks found for "${query}"</h4>
          <p>Try a different search term</p>
        </div>
      `;
      return;
    }
    
    filteredTracks.forEach(track => {
      const isFavorite = this.favorites.has(track.id.toString());
      const isCurrent = this.currentTrack && this.currentTrack.id === track.id;
      
      const card = document.createElement('div');
      card.className = `col-md-4 ${isCurrent ? 'current-playing' : ''}`;
      card.innerHTML = `
        <div class="card h-100 shadow-sm genre-${track.genre.toLowerCase()}">
          <img src="${track.imageUrl}" class="card-img-top" alt="${track.artist}" />
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${track.id}">
            <i class="fas fa-heart"></i>
          </button>
          <div class="card-body">
            <h5 class="card-title">${track.title}</h5>
            <p class="card-text">${track.artist} — <em>${track.genre}</em></p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${this.formatDuration(track.duration)}</small>
              <small class="text-muted"><i class="fas fa-play"></i> ${track.plays}</small>
            </div>
            <div class="mt-3 d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary play-btn" data-id="${track.id}">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="btn btn-sm btn-outline-secondary queue-btn" data-id="${track.id}">
                <i class="fas fa-plus"></i> Queue
              </button>
              <button class="btn btn-sm btn-outline-info comment-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Reattach event listeners
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.play-btn').dataset.id);
        this.playTrack(trackId);
      });
    });
    
    document.querySelectorAll('.queue-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.queue-btn').dataset.id);
        this.addToQueue(trackId);
      });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = e.target.closest('.favorite-btn').dataset.id;
        this.toggleFavorite(trackId);
      });
    });
  }
  
  // Load more tracks (simulated)
  loadMoreTracks() {
    this.showToast('Loading more tracks...');
    // Simulate loading
    setTimeout(() => {
      const newTracks = [
        { 
          id: 10, 
          title: "Ocean Breeze", 
          artist: "Artist 10", 
          genre: "Electronic", 
          duration: 212,
          plays: 0,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
          imageUrl: "https://source.unsplash.com/random/300x300/?ocean"
        },
        { 
          id: 11, 
          title: "Mountain High", 
          artist: "Artist 11", 
          genre: "Rock", 
          duration: 198,
          plays: 0,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
          imageUrl: "https://source.unsplash.com/random/300x300/?mountain"
        },
        { 
          id: 12, 
          title: "Urban Jungle", 
          artist: "Artist 12", 
          genre: "Pop", 
          duration: 224,
          plays: 0,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
          imageUrl: "https://source.unsplash.com/random/300x300/?city,night"
        }
      ];
      
      this.tracks = [...this.tracks, ...newTracks];
      this.renderTracks(document.getElementById('genreFilter').value);
      this.showToast(`${newTracks.length} new tracks loaded`);
    }, 1500);
  }
  
  // Play a track
  playTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    
    this.currentTrack = track;
    track.plays++;
    
    // Update UI
    document.getElementById('nowPlayingTitle').textContent = track.title;
    document.getElementById('nowPlayingArtist').textContent = track.artist;
    document.getElementById('nowPlayingArt').src = track.imageUrl;
    document.getElementById('duration').textContent = this.formatDuration(track.duration);
    
    // Load audio
    this.audio.src = track.audioUrl;
    this.waveform.load(track.audioUrl);
    
    // Play
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
        this.showToast(`Now playing: ${track.title}`);
        
        // Add to recently played
        this.addToRecentlyPlayed(track);
        
        // Highlight current track
        this.renderTracks(document.getElementById('genreFilter').value);
      })
      .catch(error => {
        console.error('Playback failed:', error);
        this.showToast('Playback failed. Please try again.');
      });
  }
  
  // Toggle play/pause
  togglePlayPause() {
    if (!this.currentTrack) {
      if (this.queue.length > 0) {
        this.playTrack(this.queue[0].id);
      } else if (this.tracks.length > 0) {
        this.playTrack(this.tracks[0].id);
      }
      return;
    }
    
    if (this.isPlaying) {
      this.audio.pause();
      this.waveform.pause();
      document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.waveform.play();
      document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
      this.isPlaying = true;
    }
  }
  
  // Play next track in queue or list
  playNext() {
    if (this.queue.length > 0) {
      const nextTrack = this.queue.shift();
      this.updateQueueDisplay();
      this.playTrack(nextTrack.id);
    } else if (this.currentTrack) {
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const nextIndex = (currentIndex + 1) % this.tracks.length;
      this.playTrack(this.tracks[nextIndex].id);
    }
  }
  
  // Play previous track
  playPrevious() {
    if (this.audio.currentTime > 3) {
      // If more than 3 seconds into the track, restart it
      this.audio.currentTime = 0;
      this.waveform.seekTo(0);
    } else if (this.currentTrack) {
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
      this.playTrack(this.tracks[prevIndex].id);
    }
  }
  
  // Add track to queue
  addToQueue(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      this.queue.push(track);
      this.updateQueueDisplay();
      this.showToast(`Added to queue: ${track.title}`);
    }
  }
  
  // Update queue display
  updateQueueDisplay() {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
    
    this.queue.forEach((track, index) => {
      const queueItem = document.createElement('div');
      queueItem.className = 'queue-item';
      queueItem.innerHTML = `
        <img src="${track.imageUrl}" class="queue-item-img" alt="${track.artist}" />
        <div class="queue-item-info">
          <div class="queue-item-title">${track.title}</div>
          <div class="queue-item-artist">${track.artist}</div>
        </div>
        <div class="queue-item-duration">${this.formatDuration(track.duration)}</div>
      `;
      
      queueItem.addEventListener('click', () => {
        this.queue.splice(index, 1);
        this.playTrack(track.id);
        this.updateQueueDisplay();
      });
      
      queueList.appendChild(queueItem);
    });
    
    if (this.queue.length === 0) {
      queueList.innerHTML = '<div class="text-center py-3">Queue is empty</div>';
    }
  }
  
  // Toggle queue panel
  toggleQueue() {
    document.getElementById('queuePanel').classList.toggle('show');
  }
  
  // Toggle equalizer panel
  toggleEq() {
    document.getElementById('eqPanel').classList.toggle('show');
  }
  
  // Set equalizer band
  setEqBand(band, value) {
    this.eqSettings[band] = value;
    // In a real app, this would apply to the audio context
    console.log(`EQ ${band} set to ${value}dB`);
  }
  
  // Apply EQ preset
  applyEqPreset(preset) {
    switch (preset) {
      case 'flat':
        this.eqSettings = { low: 0, mid: 0, high: 0 };
        break;
      case 'rock':
        this.eqSettings = { low: 6, mid: 3, high: 4 };
        break;
      case 'pop':
        this.eqSettings = { low: 4, mid: 2, high: 5 };
        break;
      case 'jazz':
        this.eqSettings = { low: 3, mid: 5, high: 2 };
        break;
    }
    
    // Update slider positions
    document.querySelector('.eq-range[data-band="low"]').value = this.eqSettings.low;
    document.querySelector('.eq-range[data-band="mid"]').value = this.eqSettings.mid;
    document.querySelector('.eq-range[data-band="high"]').value = this.eqSettings.high;
    
    this.showToast(`EQ preset applied: ${preset}`);
  }
  
  // Toggle sleep timer panel
  toggleSleepTimer() {
    document.getElementById('sleepTimerPanel').classList.toggle('show');
  }
  
  // Set sleep timer
  setSleepTimer(minutes) {
    // Clear existing timer
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
    }
    
    if (minutes <= 0) {
      document.getElementById('timerStatus').textContent = 'Sleep timer off';
      this.showToast('Sleep timer cancelled');
      return;
    }
    
    const ms = minutes * 60 * 1000;
    this.sleepTimer = setTimeout(() => {
      this.audio.pause();
      this.waveform.pause();
      this.isPlaying = false;
      document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
      document.getElementById('timerStatus').textContent = 'Sleep timer off';
      this.showToast('Sleep timer: Music stopped');
    }, ms);
    
    const endTime = new Date(Date.now() + ms);
    document.getElementById('timerStatus').textContent = `Sleep timer set for ${endTime.toLocaleTimeString()}`;
    this.showToast(`Sleep timer set for ${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  
  // Seek in track
  seek(e) {
    const percent = e.target.value;
    const time = (percent / 100) * this.audio.duration;
    this.audio.currentTime = time;
    this.waveform.seekTo(percent / 100);
  }
  
  // Seek backward 10 seconds
  seekBackward() {
    if (!this.currentTrack) return;
    this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
    this.waveform.seekTo(this.audio.currentTime / this.audio.duration);
  }
  
  // Seek forward 10 seconds
  seekForward() {
    if (!this.currentTrack) return;
    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
    this.waveform.seekTo(this.audio.currentTime / this.audio.duration);
  }
  
  // Set volume
  setVolume(e) {
    this.volume = e.target.value / 100;
    this.audio.volume = this.volume;
    this.updateVolumeUI();
  }
  
  // Increase volume
  increaseVolume() {
    this.volume = Math.min(1, this.volume + 0.1);
    this.audio.volume = this.volume;
    document.getElementById('volumeControl').value = this.volume * 100;
    this.updateVolumeUI();
  }
  
  // Decrease volume
  decreaseVolume() {
    this.volume = Math.max(0, this.volume - 0.1);
    this.audio.volume = this.volume;
    document.getElementById('volumeControl').value = this.volume * 100;
    this.updateVolumeUI();
  }
  
  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;
    this.audio.muted = this.muted;
    this.updateVolumeUI();
    this.showToast(this.muted ? 'Volume muted' : 'Volume unmuted');
  }
  
  // Update volume UI
  updateVolumeUI() {
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeControl = document.getElementById('volumeControl');
    
    if (this.muted) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      return;
    }
    
    if (this.volume === 0) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    } else if (this.volume < 0.5) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    
    volumeControl.value = this.volume * 100;
  }
  
  // Update progress bar and time display
  updateProgress() {
    if (!this.currentTrack) return;
    
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    
    if (!isNaN(duration)) {
      const percent = (currentTime / duration) * 100;
      document.getElementById('progressBar').value = percent;
      this.updateTimeDisplay(currentTime, duration);
    }
  }
  
  // Update time display
  updateTimeDisplay(currentTime, duration) {
    document.getElementById('currentTime').textContent = this.formatDuration(currentTime);
    document.getElementById('duration').textContent = this.formatDuration(duration);
  }
  
  // Format duration (seconds to MM:SS)
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  // Toggle favorite
  toggleFavorite(trackId) {
    if (this.favorites.has(trackId)) {
      this.favorites.delete(trackId);
      this.showToast('Removed from favorites');
    } else {
      this.favorites.add(trackId);
      this.showToast('Added to favorites');
    }
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
    
    // Update UI
    const btn = document.querySelector(`.favorite-btn[data-id="${trackId}"]`);
    if (btn) {
      btn.classList.toggle('active');
      btn.setAttribute('aria-label', btn.classList.contains('active') ? 'Remove from favorites' : 'Add to favorites');
    }
  }
  
  // Show favorites
  showFavorites() {
    if (this.favorites.size === 0) {
      document.getElementById('cardContainer').innerHTML = `
        <div class="col-12 text-center py-5">
          <h4>No favorites yet</h4>
          <p>Click the heart icon on tracks to add them to favorites</p>
        </div>
      `;
      return;
    }
    
    const favoriteTracks = this.tracks.filter(track => this.favorites.has(track.id.toString()));
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    
    favoriteTracks.forEach(track => {
      const isCurrent = this.currentTrack && this.currentTrack.id === track.id;
      
      const card = document.createElement('div');
      card.className = `col-md-4 ${isCurrent ? 'current-playing' : ''}`;
      card.innerHTML = `
        <div class="card h-100 shadow-sm genre-${track.genre.toLowerCase()}">
          <img src="${track.imageUrl}" class="card-img-top" alt="${track.artist}" />
          <button class="favorite-btn active" data-id="${track.id}">
            <i class="fas fa-heart"></i>
          </button>
          <div class="card-body">
            <h5 class="card-title">${track.title}</h5>
            <p class="card-text">${track.artist} — <em>${track.genre}</em></p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${this.formatDuration(track.duration)}</small>
              <small class="text-muted"><i class="fas fa-play"></i> ${track.plays}</small>
            </div>
            <div class="mt-3 d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary play-btn" data-id="${track.id}">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="btn btn-sm btn-outline-secondary queue-btn" data-id="${track.id}">
                <i class="fas fa-plus"></i> Queue
              </button>
              <button class="btn btn-sm btn-outline-info comment-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Reattach event listeners
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.play-btn').dataset.id);
        this.playTrack(trackId);
      });
    });
    
    document.querySelectorAll('.queue-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.queue-btn').dataset.id);
        this.addToQueue(trackId);
      });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = e.target.closest('.favorite-btn').dataset.id;
        this.toggleFavorite(trackId);
      });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.comment-btn').dataset.id);
        this.showComments(trackId);
      });
    });
    
    this.showToast('Showing your favorite tracks');
  }
  
  // Add to recently played
  addToRecentlyPlayed(track) {
    // Remove if already exists
    this.recentlyPlayed = this.recentlyPlayed.filter(t => t.id !== track.id);
    
    // Add to beginning
    this.recentlyPlayed.unshift(track);
    
    // Keep only last 10
    if (this.recentlyPlayed.length > 10) {
      this.recentlyPlayed.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('recentlyPlayed', JSON.stringify(this.recentlyPlayed));
  }
  
  // Show recently played
  showRecentlyPlayed() {
    const recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    
    if (recentlyPlayed.length === 0) {
      document.getElementById('cardContainer').innerHTML = `
        <div class="col-12 text-center py-5">
          <h4>No recently played tracks</h4>
          <p>Play some tracks to see them here</p>
        </div>
      `;
      return;
    }
    
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    
    recentlyPlayed.forEach(track => {
      const isFavorite = this.favorites.has(track.id.toString());
      const isCurrent = this.currentTrack && this.currentTrack.id === track.id;
      
      const card = document.createElement('div');
      card.className = `col-md-4 ${isCurrent ? 'current-playing' : ''}`;
      card.innerHTML = `
        <div class="card h-100 shadow-sm genre-${track.genre.toLowerCase()}">
          <img src="${track.imageUrl}" class="card-img-top" alt="${track.artist}" />
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${track.id}">
            <i class="fas fa-heart"></i>
          </button>
          <div class="card-body">
            <h5 class="card-title">${track.title}</h5>
            <p class="card-text">${track.artist} — <em>${track.genre}</em></p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${this.formatDuration(track.duration)}</small>
              <small class="text-muted"><i class="fas fa-play"></i> ${track.plays}</small>
            </div>
            <div class="mt-3 d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary play-btn" data-id="${track.id}">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="btn btn-sm btn-outline-secondary queue-btn" data-id="${track.id}">
                <i class="fas fa-plus"></i> Queue
              </button>
              <button class="btn btn-sm btn-outline-info comment-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Reattach event listeners
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.play-btn').dataset.id);
        this.playTrack(trackId);
      });
    });
    
    document.querySelectorAll('.queue-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.queue-btn').dataset.id);
        this.addToQueue(trackId);
      });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = e.target.closest('.favorite-btn').dataset.id;
        this.toggleFavorite(trackId);
      });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.closest('.comment-btn').dataset.id);
        this.showComments(trackId);
      });
    });
    
    this.showToast('Showing your recently played tracks');
  }
  
  // Show comments for a track
  showComments(trackId) {
    const commentsContainer = document.getElementById('commentsContainer');
    const modalTitle = document.getElementById('commentModalTitle');
    const track = this.tracks.find(t => t.id === trackId);
    
    if (!track) return;
    
    modalTitle.textContent = `Comments for ${track.title}`;
    commentsContainer.innerHTML = '';
    
    if (!this.comments[trackId] || this.comments[trackId].length === 0) {
      commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
      return;
    }
    
    this.comments[trackId].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    this.comments[trackId].forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-item';
      commentElement.innerHTML = `
        <div class="comment-author">${comment.name}</div>
        <div class="comment-text">${comment.text}</div>
        <div class="comment-date">${new Date(comment.date).toLocaleString()}</div>
      `;
      commentsContainer.appendChild(commentElement);
    });
    
    // Store the current track ID for when submitting a new comment
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
      if (parseInt(btn.dataset.id) === trackId) {
        btn.dataset.current = 'true';
      } else {
        btn.removeAttribute('data-current');
      }
    });
  }
  
  // Add a comment
  addComment(trackId, name, text) {
    if (!this.comments[trackId]) {
      this.comments[trackId] = [];
    }
    
    const newComment = {
      id: this.comments[trackId].length + 1,
      name,
      text,
      date: new Date().toISOString()
    };
    
    this.comments[trackId].push(newComment);
    this.saveComments();
    this.showComments(trackId);
    this.showToast('Comment added!');
  }
  
  // Show toast message
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const musicStore = new MusicStore();
});