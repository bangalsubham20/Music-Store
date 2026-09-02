// Deluxe Saloon — 90s Vinyl Music Player Application
class DeluxeSaloonPlayer {
  constructor() {
    this.tracks = [];
    this.currentTrack = null;
    this.ytPlayer = null;
    this.ytReady = false;
    this.progressInterval = null;
    this.listenerInterval = null;
    this.liveCount = 32;
    
    this.queue = [];
    this.favorites = new Set();
    this.recentlyPlayed = [];
    this.comments = {};
    this.waveform = null;
    this.eqSettings = { low: 0, mid: 0, high: 0 };
    this.sleepTimer = null;
    this.isPlaying = false;
    this.volume = 80;
    this.muted = false;
    
    this.init();
  }
  
  // Initialize Deluxe Saloon application
  init() {
    this.loadTracks();
    this.loadFavorites();
    this.loadComments();
    this.setupEventListeners();
    this.setupWaveform();
    this.setupKeyboardShortcuts();
    this.initYouTubeApi();
    this.startLiveListenerSimulator();
  }

  // Live Listener Counter Simulation (Realistic 28 - 45 live listeners)
  startLiveListenerSimulator() {
    const countEl = document.getElementById('liveListenerCount');
    if (!countEl) return;

    this.listenerInterval = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2 change
      this.liveCount = Math.max(24, Math.min(48, this.liveCount + delta));
      countEl.textContent = this.liveCount;
    }, 6000);
  }

  // Initialize YouTube Iframe Player API
  initYouTubeApi() {
    const checkYt = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYt);
        this.setupYouTubePlayer();
      }
    }, 200);
  }

  setupYouTubePlayer() {
    try {
      this.playlistId = 'PLfJQluhwsUqsMa83FrBHxCqPwTnlr8YSO';
      this.ytPlayer = new YT.Player('ytPlayerContainer', {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: this.playlistId,
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            this.ytReady = true;
            this.ytPlayer.setVolume(this.volume);
            this.updateNowPlayingFromYt();
          },
          onStateChange: (event) => {
            this.handleYtStateChange(event.data);
          }
        }
      });
    } catch (e) {
      console.warn('YouTube Player initialization fallback:', e);
    }
  }

  updateNowPlayingFromYt() {
    if (!this.ytReady || !this.ytPlayer || typeof this.ytPlayer.getVideoData !== 'function') return;
    try {
      const data = this.ytPlayer.getVideoData();
      if (data && data.title) {
        const titleEl = document.getElementById('nowPlayingTitle');
        const artistEl = document.getElementById('nowPlayingArtist');
        const artImg = document.getElementById('nowPlayingArt');

        if (titleEl) titleEl.textContent = data.title;
        if (artistEl) artistEl.textContent = data.author || 'Deluxe Saloon Playlist';
        if (artImg && data.video_id) {
          artImg.src = `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`;
        }
      }
    } catch (e) {
      console.warn('Could not update now playing from YT:', e);
    }
  }

  handleYtStateChange(state) {
    const globalPlayer = document.getElementById('globalPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const vinylRecord = document.getElementById('vinylRecord');

    if (state === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      globalPlayer.classList.add('is-playing');
      if (vinylRecord) vinylRecord.classList.add('is-spinning');
      this.updateNowPlayingFromYt();
      this.startProgressTracker();
    } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
      this.isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      globalPlayer.classList.remove('is-playing');
      if (vinylRecord) vinylRecord.classList.remove('is-spinning');
      this.stopProgressTracker();

      if (state === YT.PlayerState.ENDED) {
        this.playNext();
      }
    }
  }

  startProgressTracker() {
    this.stopProgressTracker();
    this.progressInterval = setInterval(() => {
      if (this.ytReady && this.ytPlayer && this.ytPlayer.getCurrentTime) {
        const currentTime = this.ytPlayer.getCurrentTime() || 0;
        const duration = this.ytPlayer.getDuration() || (this.currentTrack ? this.currentTrack.duration : 1);
        
        if (duration > 0) {
          const percent = (currentTime / duration) * 100;
          document.getElementById('progressBar').value = percent;
          this.updateTimeDisplay(currentTime, duration);
        }
      }
    }, 500);
  }

  stopProgressTracker() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
  // Deluxe Saloon Playlist Dataset
  loadTracks() {
    this.tracks = [];
  }
  
  loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favorites = new Set(JSON.parse(savedFavorites));
    }
  }
  
  loadComments() {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    } else {
      this.comments = {
        1: [
          { id: 1, name: "SaloonListener", text: "Classic barber shop vinyl vibes!", date: "2024-05-15T10:30:00" },
          { id: 2, name: "Nostalgia90s", text: "Nothing beats 90s vinyl playback.", date: "2024-05-16T08:15:00" }
        ]
      };
      this.saveComments();
    }
  }
  
  saveComments() {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }
  
  setupEventListeners() {
    
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
      genreFilter.addEventListener('change', (e) => {
        this.renderTracks(e.target.value);
      });
    }

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.sortTracks(e.target.value);
      });
    }
    
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) this.searchTracks(searchInput.value);
      });
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
          this.renderTracks();
        }
      });
    }
    
    // Player controls
    document.getElementById('playPauseBtn').addEventListener('click', this.togglePlayPause.bind(this));
    document.getElementById('prevBtn').addEventListener('click', this.playPrevious.bind(this));
    document.getElementById('nextBtn').addEventListener('click', this.playNext.bind(this));
    document.getElementById('progressBar').addEventListener('input', this.seek.bind(this));
    document.getElementById('volumeControl').addEventListener('input', this.setVolume.bind(this));
    document.getElementById('volumeBtn').addEventListener('click', this.toggleMute.bind(this));
    
    // Drawers
    document.getElementById('ytModalBtn').addEventListener('click', this.toggleYtDrawer.bind(this));
    document.getElementById('closeYtDrawer').addEventListener('click', this.toggleYtDrawer.bind(this));
    
    document.getElementById('queueBtn').addEventListener('click', this.toggleQueue.bind(this));
    document.getElementById('closeQueue').addEventListener('click', this.toggleQueue.bind(this));
    
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
    
    document.getElementById('favoritesLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showFavorites();
    });
    
    document.getElementById('recentlyPlayedLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showRecentlyPlayed();
    });
    
    const loadMore = document.getElementById('loadMore');
    if (loadMore) {
      loadMore.addEventListener('click', this.loadMoreTracks.bind(this));
    }
  }

  setupWaveform() {
    this.waveform = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgba(255, 255, 255, 0.2)',
      progressColor: '#ffffff',
      cursorColor: '#80ced6',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 24,
      barGap: 2,
      responsive: true
    });
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        this.seekBackward();
      } else if (e.code === 'ArrowRight') {
        this.seekForward();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.increaseVolume();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.decreaseVolume();
      } else if (e.code === 'KeyM') {
        this.toggleMute();
      }
    });
  }
  

  
  createTrackCardHtml(track) {
    const isFavorite = this.favorites.has(track.id.toString());
    const isCurrent = this.currentTrack && this.currentTrack.id === track.id;

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 glass-card ${isCurrent ? 'current-playing' : ''}">
          <div class="card-img-wrapper">
            <img src="${track.imageUrl}" class="card-img-top" alt="${track.artist}" loading="lazy" />
            <div class="card-overlay">
              <button class="btn-play-overlay play-btn" data-id="${track.id}" aria-label="Play ${track.title}">
                <i class="fas ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
              </button>
            </div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${track.id}" aria-label="${isFavorite ? 'Remove favorite' : 'Add favorite'}">
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-3">
            <div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="genre-badge">${track.genre}</span>
                <span class="badge bg-dark text-warning border border-warning small px-2 py-1"><i class="fas fa-record-vinyl me-1 ${isCurrent && this.isPlaying ? 'fa-spin' : ''}"></i> 90s Vinyl</span>
              </div>
              <h5 class="track-title">${track.title}</h5>
              <p class="track-artist mb-3">${track.artist}</p>
            </div>
            <div class="d-flex align-items-center justify-content-between pt-2 border-top-glass">
              <small class="text-white-50 fw-semibold"><i class="far fa-clock me-1"></i> ${this.formatDuration(track.duration)}</small>
              <div class="d-flex gap-1">
                <button class="btn btn-card-action queue-btn" data-id="${track.id}">
                  <i class="fas fa-plus"></i> Queue
                </button>
                <button class="btn btn-card-action comment-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                  <i class="far fa-comment"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachCardListeners() {
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
  }

  renderTracks(filter = 'all') {
    const container = document.getElementById('cardContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const filteredTracks = filter === 'all' 
      ? this.tracks 
      : this.tracks.filter(track => track.genre === filter);
    
    if (filteredTracks.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-compact-disc fa-3x text-white-50 mb-3"></i>
          <h4>No Deluxe tracks found</h4>
          <p class="text-muted">No tracks match the selected filter.</p>
        </div>
      `;
      return;
    }

    filteredTracks.forEach(track => {
      container.insertAdjacentHTML('beforeend', this.createTrackCardHtml(track));
    });
    
    this.attachCardListeners();
  }
  
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
      default:
        this.tracks.sort((a, b) => a.id - b.id);
    }
    
    this.renderTracks(document.getElementById('genreFilter')?.value || 'all');
  }
  
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
    if (!container) return;
    container.innerHTML = '';
    
    if (filteredTracks.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-search fa-3x text-white-50 mb-3"></i>
          <h4>No Deluxe tracks found for "${query}"</h4>
        </div>
      `;
      return;
    }
    
    filteredTracks.forEach(track => {
      container.insertAdjacentHTML('beforeend', this.createTrackCardHtml(track));
    });
    
    this.attachCardListeners();
  }
  
  loadMoreTracks() {
    this.tracks = [];
  }
  
  // Play Track & Rotate Vinyl Artwork
  playTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    
    this.currentTrack = track;
    track.plays++;
    
    document.getElementById('nowPlayingTitle').textContent = track.title;
    document.getElementById('nowPlayingArtist').textContent = track.artist;
    document.getElementById('nowPlayingArt').src = track.imageUrl;
    document.getElementById('duration').textContent = this.formatDuration(track.duration);
    
    const vinylRecord = document.getElementById('vinylRecord');
    if (vinylRecord) vinylRecord.classList.add('is-spinning');
    
    if (this.ytReady && this.ytPlayer && this.ytPlayer.loadVideoById) {
      this.ytPlayer.loadVideoById(track.youtubeId);
      this.ytPlayer.playVideo();
    }
    
    this.showToast(`▶ Spinning Vinyl: ${track.title}`);
    this.addToRecentlyPlayed(track);
    this.renderTracks(document.getElementById('genreFilter')?.value || 'all');
  }
  
  togglePlayPause() {
    if (!this.currentTrack) {
      if (this.queue.length > 0) {
        this.playTrack(this.queue[0].id);
      } else if (this.tracks.length > 0) {
        this.playTrack(this.tracks[0].id);
      }
      return;
    }
    
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      if (this.isPlaying) {
        this.ytPlayer.pauseVideo();
      } else {
        this.ytPlayer.playVideo();
      }
    } else {
      this.isPlaying = !this.isPlaying;
      const playPauseBtn = document.getElementById('playPauseBtn');
      const vinylRecord = document.getElementById('vinylRecord');
      const globalPlayer = document.getElementById('globalPlayer');

      if (this.isPlaying) {
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (vinylRecord) vinylRecord.classList.add('is-spinning');
        if (globalPlayer) globalPlayer.classList.add('is-playing');
      } else {
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (vinylRecord) vinylRecord.classList.remove('is-spinning');
        if (globalPlayer) globalPlayer.classList.remove('is-playing');
      }
      this.renderTracks(document.getElementById('genreFilter')?.value || 'all');
    }
  }
  
  playNext() {
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.nextVideo === 'function') {
      this.ytPlayer.nextVideo();
    } else if (this.queue.length > 0) {
      const nextTrack = this.queue.shift();
      this.updateQueueDisplay();
      this.playTrack(nextTrack.id);
    } else if (this.currentTrack) {
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const nextIndex = (currentIndex + 1) % this.tracks.length;
      this.playTrack(this.tracks[nextIndex].id);
    }
  }
  
  playPrevious() {
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.previousVideo === 'function') {
      this.ytPlayer.previousVideo();
    } else if (this.currentTrack) {
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
      this.playTrack(this.tracks[prevIndex].id);
    }
  }
  
  addToQueue(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      this.queue.push(track);
      this.updateQueueDisplay();
      this.showToast(`Added to queue: ${track.title}`);
    }
  }
  
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
        <div class="small text-white-50">${this.formatDuration(track.duration)}</div>
      `;
      
      queueItem.addEventListener('click', () => {
        this.queue.splice(index, 1);
        this.playTrack(track.id);
        this.updateQueueDisplay();
      });
      
      queueList.appendChild(queueItem);
    });
    
    if (this.queue.length === 0) {
      queueList.innerHTML = '<div class="text-center py-4 text-white-50 small"><i class="fas fa-list-ul mb-2"></i><br>Queue is empty</div>';
    }
  }
  
  // Drawer Toggles
  toggleYtDrawer() {
    document.getElementById('queuePanel').classList.remove('show');
    document.getElementById('eqPanel').classList.remove('show');
    document.getElementById('sleepTimerPanel').classList.remove('show');
    document.getElementById('ytVideoDrawer').classList.toggle('show');
  }

  toggleQueue() {
    document.getElementById('ytVideoDrawer').classList.remove('show');
    document.getElementById('eqPanel').classList.remove('show');
    document.getElementById('sleepTimerPanel').classList.remove('show');
    document.getElementById('queuePanel').classList.toggle('show');
  }
  
  toggleEq() {
    document.getElementById('ytVideoDrawer').classList.remove('show');
    document.getElementById('queuePanel').classList.remove('show');
    document.getElementById('sleepTimerPanel').classList.remove('show');
    document.getElementById('eqPanel').classList.toggle('show');
  }

  toggleSleepTimer() {
    document.getElementById('ytVideoDrawer').classList.remove('show');
    document.getElementById('queuePanel').classList.remove('show');
    document.getElementById('eqPanel').classList.remove('show');
    document.getElementById('sleepTimerPanel').classList.toggle('show');
  }
  
  setEqBand(band, value) {
    this.eqSettings[band] = value;
    const valSpan = document.getElementById(`${band === 'low' ? 'bass' : band === 'mid' ? 'mid' : 'treble'}Val`);
    if (valSpan) valSpan.textContent = `${value > 0 ? '+' : ''}${value}dB`;
  }
  
  applyEqPreset(preset) {
    switch (preset) {
      case 'flat': this.eqSettings = { low: 0, mid: 0, high: 0 }; break;
      case 'rock': this.eqSettings = { low: 6, mid: 3, high: 4 }; break;
      case 'pop': this.eqSettings = { low: 4, mid: 2, high: 5 }; break;
      case 'jazz': this.eqSettings = { low: 3, mid: 5, high: 2 }; break;
    }
    
    document.querySelector('.eq-range[data-band="low"]').value = this.eqSettings.low;
    document.querySelector('.eq-range[data-band="mid"]').value = this.eqSettings.mid;
    document.querySelector('.eq-range[data-band="high"]').value = this.eqSettings.high;
    
    document.getElementById('bassVal').textContent = `${this.eqSettings.low > 0 ? '+' : ''}${this.eqSettings.low}dB`;
    document.getElementById('midVal').textContent = `${this.eqSettings.mid > 0 ? '+' : ''}${this.eqSettings.mid}dB`;
    document.getElementById('trebleVal').textContent = `${this.eqSettings.high > 0 ? '+' : ''}${this.eqSettings.high}dB`;

    document.querySelectorAll('.eq-preset').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === preset);
    });
    
    this.showToast(`Equalizer preset: ${preset.toUpperCase()}`);
  }
  
  setSleepTimer(minutes) {
    if (this.sleepTimer) clearTimeout(this.sleepTimer);
    
    if (minutes <= 0) {
      document.getElementById('timerStatus').textContent = 'Sleep timer off';
      this.showToast('Sleep timer cancelled');
      return;
    }
    
    const ms = minutes * 60 * 1000;
    this.sleepTimer = setTimeout(() => {
      if (this.ytReady && this.ytPlayer) this.ytPlayer.pauseVideo();
      this.isPlaying = false;
      document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
      document.getElementById('globalPlayer').classList.remove('is-playing');
      const vinylRecord = document.getElementById('vinylRecord');
      if (vinylRecord) vinylRecord.classList.remove('is-spinning');
      document.getElementById('timerStatus').textContent = 'Timer inactive';
      this.showToast('😴 Sleep timer: Music stopped');
    }, ms);
    
    const endTime = new Date(Date.now() + ms);
    document.getElementById('timerStatus').textContent = `Stops at ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    this.showToast(`Sleep timer set for ${minutes} min`);
  }
  
  seek(e) {
    const percent = e.target.value;
    if (this.ytReady && this.ytPlayer && this.ytPlayer.getDuration) {
      const duration = this.ytPlayer.getDuration();
      if (duration > 0) {
        this.ytPlayer.seekTo((percent / 100) * duration, true);
      }
    }
  }
  
  seekBackward() {
    if (this.ytReady && this.ytPlayer && this.ytPlayer.getCurrentTime) {
      this.ytPlayer.seekTo(Math.max(0, this.ytPlayer.getCurrentTime() - 10), true);
    }
  }
  
  seekForward() {
    if (this.ytReady && this.ytPlayer && this.ytPlayer.getCurrentTime) {
      this.ytPlayer.seekTo(Math.min(this.ytPlayer.getDuration(), this.ytPlayer.getCurrentTime() + 10), true);
    }
  }
  
  setVolume(e) {
    this.volume = parseInt(e.target.value);
    if (this.ytReady && this.ytPlayer && this.ytPlayer.setVolume) {
      this.ytPlayer.setVolume(this.volume);
    }
    this.updateVolumeUI();
  }
  
  increaseVolume() {
    this.volume = Math.min(100, this.volume + 10);
    if (this.ytReady && this.ytPlayer) this.ytPlayer.setVolume(this.volume);
    document.getElementById('volumeControl').value = this.volume;
    this.updateVolumeUI();
  }
  
  decreaseVolume() {
    this.volume = Math.max(0, this.volume - 10);
    if (this.ytReady && this.ytPlayer) this.ytPlayer.setVolume(this.volume);
    document.getElementById('volumeControl').value = this.volume;
    this.updateVolumeUI();
  }
  
  toggleMute() {
    this.muted = !this.muted;
    if (this.ytReady && this.ytPlayer) {
      if (this.muted) this.ytPlayer.mute();
      else this.ytPlayer.unMute();
    }
    this.updateVolumeUI();
    this.showToast(this.muted ? 'Muted 🔇' : 'Unmuted 🔊');
  }
  
  updateVolumeUI() {
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeControl = document.getElementById('volumeControl');
    
    if (this.muted) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute text-danger"></i>';
      return;
    }
    
    if (this.volume === 0) volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    else if (this.volume < 50) volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    else volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    
    volumeControl.value = this.volume;
  }

  updateTimeDisplay(currentTime, duration) {
    document.getElementById('currentTime').textContent = this.formatDuration(currentTime);
    document.getElementById('duration').textContent = this.formatDuration(duration);
  }
  
  formatDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  toggleFavorite(trackId) {
    const strId = trackId.toString();
    if (this.favorites.has(strId)) {
      this.favorites.delete(strId);
      this.showToast('Removed from favorites');
    } else {
      this.favorites.add(strId);
      this.showToast('Added to favorites ❤️');
    }
    
    localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
    
    const btn = document.querySelector(`.favorite-btn[data-id="${trackId}"]`);
    if (btn) btn.classList.toggle('active');
  }
  
  showFavorites() {
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';

    if (this.favorites.size === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="far fa-heart fa-3x text-white-50 mb-3"></i>
          <h4>No favorite tracks saved</h4>
        </div>
      `;
      return;
    }
    
    const favoriteTracks = this.tracks.filter(track => this.favorites.has(track.id.toString()));
    favoriteTracks.forEach(track => {
      container.insertAdjacentHTML('beforeend', this.createTrackCardHtml(track));
    });
    
    this.attachCardListeners();
    this.showToast('Showing your favorite tracks ❤️');
  }
  
  addToRecentlyPlayed(track) {
    this.recentlyPlayed = this.recentlyPlayed.filter(t => t.id !== track.id);
    this.recentlyPlayed.unshift(track);
    if (this.recentlyPlayed.length > 10) this.recentlyPlayed.pop();
    localStorage.setItem('recentlyPlayed', JSON.stringify(this.recentlyPlayed));
  }
  
  showRecentlyPlayed() {
    const recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';

    if (recentlyPlayed.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-history fa-3x text-white-50 mb-3"></i>
          <h4>No recently played tracks</h4>
        </div>
      `;
      return;
    }
    
    recentlyPlayed.forEach(track => {
      container.insertAdjacentHTML('beforeend', this.createTrackCardHtml(track));
    });
    
    this.attachCardListeners();
    this.showToast('Showing recently played tracks');
  }
  
  showComments(trackId) {
    const commentsContainer = document.getElementById('commentsContainer');
    const modalTitle = document.getElementById('commentModalTitle');
    const track = this.tracks.find(t => t.id === trackId);
    
    if (!track) return;
    
    modalTitle.innerHTML = `<i class="far fa-comments me-2"></i> Comments for "${track.title}"`;
    commentsContainer.innerHTML = '';
    
    if (!this.comments[trackId] || this.comments[trackId].length === 0) {
      commentsContainer.innerHTML = '<p class="text-white-50 small text-center py-3">No comments yet. Be the first to share your thoughts!</p>';
    } else {
      const sortedComments = [...this.comments[trackId]].sort((a, b) => new Date(b.date) - new Date(a.date));
      sortedComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="comment-author">${comment.name}</div>
            <div class="comment-date">${new Date(comment.date).toLocaleDateString()}</div>
          </div>
          <div class="comment-text">${comment.text}</div>
        `;
        commentsContainer.appendChild(commentElement);
      });
    }

    const commentForm = document.getElementById('commentForm');
    commentForm.onsubmit = (e) => {
      e.preventDefault();
      const text = document.getElementById('commentText').value.trim();
      const name = document.getElementById('commentName').value.trim();
      if (text && name) {
        this.addComment(trackId, name, text);
        document.getElementById('commentText').value = '';
        document.getElementById('commentName').value = '';
      }
    };
  }
  
  addComment(trackId, name, text) {
    if (!this.comments[trackId]) this.comments[trackId] = [];
    
    const newComment = {
      id: this.comments[trackId].length + 1,
      name,
      text,
      date: new Date().toISOString()
    };
    
    this.comments[trackId].push(newComment);
    this.saveComments();
    this.showComments(trackId);
    this.showToast('Comment posted! 💬');
  }
  
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2800);
  }
}

// Global YouTube Iframe hook
window.onYouTubeIframeAPIReady = function() {
  if (window.saloonPlayerApp) {
    window.saloonPlayerApp.setupYouTubePlayer();
  }
};

// Launch Deluxe Saloon app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.saloonPlayerApp = new DeluxeSaloonPlayer();
});