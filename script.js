// ==========================================================================
// DELUXE SALOON — MINIMAL HI-FI VINYL AUDIO STUDIO APPLICATION
// ==========================================================================

class DeluxeSaloonStudio {
  constructor() {
    this.tracks = [];
    this.currentTrack = null;
    this.currentIndex = 0;
    
    // Playback state
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 80;
    this.currentTime = 0;
    this.duration = 0;
    this.isShuffle = false;
    this.isRepeat = false;
    this.currentRpm = 33;
    this.currentFilter = 'all';
    this.currentViewMode = 'grid'; // 'grid' | 'list'
    this.currentTab = 'all'; // 'all' | 'favorites' | 'recent'
    
    // Persistent collections
    this.favorites = new Set();
    this.recentlyPlayed = [];
    this.queue = [];
    this.comments = {};
    
    // Web Audio & Synthetics
    this.audioContext = null;
    this.crackleNode = null;
    this.isCrackleActive = false;
    this.visualizerBars = 32;
    this.animFrameId = null;
    
    // Sleep timer & Intervals
    this.sleepTimer = null;
    this.progressInterval = null;
    this.listenerInterval = null;
    this.liveCount = 38;
    
    // YouTube Iframe integration
    this.ytPlayer = null;
    this.ytReady = false;
    
    // Equalizer Settings
    this.eqSettings = { low: 0, mid: 0, high: 0 };

    this.init();
  }

  // --- Initialization Lifecycle ---
  init() {
    this.initTrackCatalog();
    this.loadStorage();
    this.setupDOMElements();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.initVisualizer();
    this.initYouTubePlayer();
    this.startLiveSimulation();
    
    // Set initial track
    if (this.tracks.length > 0) {
      this.loadTrack(this.tracks[0], false);
    }
    
    this.render();
    this.updateFavoritesCount();
  }

  // --- Curated Hi-Fi 90s Vinyl & Studio Catalog ---
  initTrackCatalog() {
    this.tracks = [
      {
        id: 1,
        title: "Smooth Operator",
        artist: "Sade",
        album: "Diamond Life",
        genre: "Jazz",
        year: 1984,
        duration: 258,
        plays: 48210,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
        youtubeId: "4TYv2PhG89A",
        quality: "24-BIT / 96kHz VINYL MASTER"
      },
      {
        id: 2,
        title: "Breathe",
        artist: "The Prodigy",
        album: "The Fat of the Land",
        genre: "Electronic",
        year: 1996,
        duration: 234,
        plays: 39540,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        youtubeId: "rmHDhA1xCbo",
        quality: "ORIGINAL 12\" 45 RPM"
      },
      {
        id: 3,
        title: "Creep",
        artist: "Radiohead",
        album: "Pablo Honey",
        genre: "Rock",
        year: 1993,
        duration: 238,
        plays: 62400,
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
        youtubeId: "XFkzRNyygfk",
        quality: "ANALOG TAPE RE-ISSUE"
      },
      {
        id: 4,
        title: "Wonderwall",
        artist: "Oasis",
        album: "(What's the Story) Morning Glory?",
        genre: "Rock",
        year: 1995,
        duration: 258,
        plays: 58900,
        imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
        youtubeId: "6hzrDeceEKc",
        quality: "ABBEY ROAD REMASTER"
      },
      {
        id: 5,
        title: "California Love",
        artist: "2Pac ft. Dr. Dre",
        album: "All Eyez on Me",
        genre: "Hip Hop",
        year: 1995,
        duration: 285,
        plays: 51200,
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
        youtubeId: "5wBT4ggAPQ4",
        quality: "WEST COAST 12\" CUT"
      },
      {
        id: 6,
        title: "Teardrop",
        artist: "Massive Attack",
        album: "Mezzanine",
        genre: "Electronic",
        year: 1998,
        duration: 330,
        plays: 44100,
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
        youtubeId: "u7K72X4eo_s",
        quality: "HEAVYWEIGHT 180G VINYL"
      },
      {
        id: 7,
        title: "Midnight City",
        artist: "M83",
        album: "Hurry Up, We're Dreaming",
        genre: "Synthwave",
        year: 2011,
        duration: 243,
        plays: 37800,
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        youtubeId: "dX3k_QDnzHE",
        quality: "SYNTHWAVE AUDIOPHILE"
      },
      {
        id: 8,
        title: "Fly Me to the Moon",
        artist: "Frank Sinatra",
        album: "It Might as Well Be Swing",
        genre: "Jazz",
        year: 1964,
        duration: 147,
        plays: 68100,
        imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
        youtubeId: "ZEcqHA7dbwM",
        quality: "REPRISE MONO ACETATE"
      },
      {
        id: 9,
        title: "Black Hole Sun",
        artist: "Soundgarden",
        album: "Superunknown",
        genre: "Rock",
        year: 1994,
        duration: 318,
        plays: 35600,
        imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
        youtubeId: "3mbBbFH9fAg",
        quality: "SEATTLE GRUNGE MASTER"
      },
      {
        id: 10,
        title: "Autumn Leaves",
        artist: "Bill Evans Trio",
        album: "Portrait in Jazz",
        genre: "Jazz",
        year: 1960,
        duration: 325,
        plays: 42100,
        imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
        youtubeId: "r-Z8KuwI7Gc",
        quality: "RIVERSIDE VINYL TRANSFER"
      },
      {
        id: 11,
        title: "No Diggity",
        artist: "Blackstreet",
        album: "Another Level",
        genre: "Hip Hop",
        year: 1996,
        duration: 305,
        plays: 49700,
        imageUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd62977?auto=format&fit=crop&w=600&q=80",
        youtubeId: "3KL9AMGoXY8",
        quality: "90s GOLD CERTIFIED"
      },
      {
        id: 12,
        title: "Nightcall",
        artist: "Kavinsky",
        album: "OutRun",
        genre: "Synthwave",
        year: 2010,
        duration: 259,
        plays: 54300,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        youtubeId: "MV_3Dpw-BRY",
        quality: "ANALOG ELECTRO CUT"
      }
    ];
  }

  // --- Local Storage Management ---
  loadStorage() {
    try {
      const savedFavs = localStorage.getItem('deluxe_favorites');
      if (savedFavs) this.favorites = new Set(JSON.parse(savedFavs));
      
      const savedRecent = localStorage.getItem('deluxe_recent');
      if (savedRecent) this.recentlyPlayed = JSON.parse(savedRecent);
      
      const savedComments = localStorage.getItem('deluxe_comments');
      if (savedComments) {
        this.comments = JSON.parse(savedComments);
      } else {
        this.comments = {
          1: [
            { id: 1, name: "Miles Davis Fan", text: "Silky 90s mastering on this vinyl cut! Pure warmth.", date: "2024-06-12" },
            { id: 2, name: "VinylJunkie", text: "The sax tone on 33 RPM is simply divine.", date: "2024-07-01" }
          ],
          3: [
            { id: 1, name: "Oxford90s", text: "That heavy guitar crunch will forever define the decade.", date: "2024-05-18" }
          ]
        };
        this.saveComments();
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }
  }

  saveStorage() {
    localStorage.setItem('deluxe_favorites', JSON.stringify(Array.from(this.favorites)));
    localStorage.setItem('deluxe_recent', JSON.stringify(this.recentlyPlayed));
  }

  saveComments() {
    localStorage.setItem('deluxe_comments', JSON.stringify(this.comments));
  }

  // --- Live Listener Simulation ---
  startLiveSimulation() {
    const countEl = document.getElementById('liveListenerCount');
    if (!countEl) return;
    this.listenerInterval = setInterval(() => {
      const shift = Math.floor(Math.random() * 5) - 2;
      this.liveCount = Math.max(26, Math.min(52, this.liveCount + shift));
      countEl.textContent = this.liveCount;
    }, 5000);
  }

  // --- YouTube Player Setup ---
  initYouTubePlayer() {
    const checkYt = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYt);
        this.createYtPlayerInstance();
      }
    }, 250);
  }

  createYtPlayerInstance() {
    try {
      this.ytPlayer = new YT.Player('ytPlayerContainer', {
        height: '100%',
        width: '100%',
        videoId: this.currentTrack ? this.currentTrack.youtubeId : '4TYv2PhG89A',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: () => {
            this.ytReady = true;
            if (this.ytPlayer.setVolume) this.ytPlayer.setVolume(this.volume);
          },
          onStateChange: (e) => this.handleYtStateChange(e.data)
        }
      });
    } catch (err) {
      console.warn("YouTube Player initialization warning:", err);
    }
  }

  handleYtStateChange(state) {
    if (state === YT.PlayerState.PLAYING) {
      this.setPlaybackUI(true);
      this.startProgressTracker();
    } else if (state === YT.PlayerState.PAUSED) {
      this.setPlaybackUI(false);
      this.stopProgressTracker();
    } else if (state === YT.PlayerState.ENDED) {
      this.setPlaybackUI(false);
      this.stopProgressTracker();
      this.playNext();
    }
  }

  // --- Web Audio Vinyl Crackle Generator ---
  initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioContext = new AudioCtx();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  toggleVinylCrackle(enabled) {
    this.initAudioContext();
    if (!this.audioContext) return;

    if (enabled) {
      if (this.crackleNode) return;
      const bufferSize = this.audioContext.sampleRate * 2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Procedural vinyl dust pops and surface friction noise
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const pop = Math.random() > 0.9994 ? (Math.random() * 2 - 1) * 0.4 : 0;
        data[i] = white * 0.007 + pop;
      }

      this.crackleNode = this.audioContext.createBufferSource();
      this.crackleNode.buffer = buffer;
      this.crackleNode.loop = true;

      // Filter to simulate authentic warm analog warmth
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2800;

      const gain = this.audioContext.createGain();
      gain.gain.value = 0.8;

      this.crackleNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);

      this.crackleNode.start(0);
      this.isCrackleActive = true;
      this.showToast("📻 Vinyl crackle ambience: ON");
    } else {
      if (this.crackleNode) {
        try {
          this.crackleNode.stop();
          this.crackleNode.disconnect();
        } catch (e) {}
        this.crackleNode = null;
      }
      this.isCrackleActive = false;
      this.showToast("Vinyl crackle ambience: OFF");
    }
  }

  // --- Audio Visualizer Canvas ---
  initVisualizer() {
    const canvas = document.getElementById('visualizerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      this.animFrameId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const count = this.visualizerBars;
      const barWidth = canvas.width / count - 2;

      for (let i = 0; i < count; i++) {
        let h = 3;
        if (this.isPlaying) {
          // Dynamic simulated frequencies with realistic music bounce
          const t = Date.now() * 0.004;
          const wave = Math.sin(t + i * 0.3) * 0.5 + 0.5;
          const randomFactor = Math.random() * 0.3;
          h = Math.max(3, (wave + randomFactor) * (canvas.height - 6));
        }

        const x = i * (barWidth + 2);
        const y = canvas.height - h;

        // Elegant Studio Gold / Cyan Gradient
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#d4af37');
        grad.addColorStop(1, '#0e7490');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 2);
        ctx.fill();
      }
    };

    draw();
  }

  // --- DOM Setup & Event Binding ---
  setupDOMElements() {
    // Top Tabs
    const tabAll = document.getElementById('tabAll');
    const tabFavs = document.getElementById('tabFavorites');
    const tabRecent = document.getElementById('tabRecent');
    const mobileTabAll = document.getElementById('mobileTabAll');
    const mobileTabFavs = document.getElementById('mobileTabFavorites');
    const mobileTabRecent = document.getElementById('mobileTabRecent');

    const setTab = (tab) => {
      this.currentTab = tab;
      [tabAll, tabFavs, tabRecent, mobileTabAll, mobileTabFavs, mobileTabRecent].forEach(b => {
        if (b) b.classList.remove('active');
      });

      if (tab === 'all') {
        if (tabAll) tabAll.classList.add('active');
        if (mobileTabAll) mobileTabAll.classList.add('active');
        document.getElementById('librarySectionTitle').textContent = "Vinyl Master Vault";
      } else if (tab === 'favorites') {
        if (tabFavs) tabFavs.classList.add('active');
        if (mobileTabFavs) mobileTabFavs.classList.add('active');
        document.getElementById('librarySectionTitle').textContent = "Saved Favorites ❤️";
      } else if (tab === 'recent') {
        if (tabRecent) tabRecent.classList.add('active');
        if (mobileTabRecent) mobileTabRecent.classList.add('active');
        document.getElementById('librarySectionTitle').textContent = "Playback History";
      }

      const mobileDrawer = document.getElementById('mobileNavCollapse');
      if (mobileDrawer) mobileDrawer.classList.remove('show');

      this.render();
    };

    if (tabAll) tabAll.addEventListener('click', () => setTab('all'));
    if (tabFavs) tabFavs.addEventListener('click', () => setTab('favorites'));
    if (tabRecent) tabRecent.addEventListener('click', () => setTab('recent'));
    if (mobileTabAll) mobileTabAll.addEventListener('click', () => setTab('all'));
    if (mobileTabFavs) mobileTabFavs.addEventListener('click', () => setTab('favorites'));
    if (mobileTabRecent) mobileTabRecent.addEventListener('click', () => setTab('recent'));

    // Brand link resets to Library
    const brandLink = document.getElementById('brandHomeLink');
    if (brandLink) brandLink.addEventListener('click', (e) => { e.preventDefault(); setTab('all'); });

    // Mobile nav toggle
    const mobBtn = document.getElementById('mobileMenuBtn');
    if (mobBtn) {
      mobBtn.addEventListener('click', () => {
        document.getElementById('mobileNavCollapse')?.classList.toggle('show');
      });
    }

    // Search Bar
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const clearSearch = document.getElementById('clearSearchBtn');

    const handleSearch = (val) => {
      const q = val.trim().toLowerCase();
      if (clearSearch) clearSearch.classList.toggle('d-none', q === '');
      this.searchQuery = q;
      this.render();
    };

    if (searchInput) searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    if (mobileSearchInput) mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (mobileSearchInput) mobileSearchInput.value = '';
        handleSearch('');
      });
    }

    // View Mode Toggle (Grid vs List)
    const gridBtn = document.getElementById('viewGridBtn');
    const listBtn = document.getElementById('viewListBtn');
    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        this.currentViewMode = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        this.render();
      });
      listBtn.addEventListener('click', () => {
        this.currentViewMode = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        this.render();
      });
    }

    // Genre filter pills
    document.querySelectorAll('.genre-filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.genre-filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.genre;
        this.render();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.render();
      });
    }

    // RPM Speed Pills on Turntable Deck
    const rpm33 = document.getElementById('rpm33Btn');
    const rpm45 = document.getElementById('rpm45Btn');
    const vinylDisc = document.getElementById('vinylDisc');

    if (rpm33 && rpm45) {
      rpm33.addEventListener('click', () => {
        rpm33.classList.add('active');
        rpm45.classList.remove('active');
        vinylDisc.classList.remove('speed-45');
        this.currentRpm = 33;
        this.showToast("Turntable Speed: 33 ⅓ RPM");
      });
      rpm45.addEventListener('click', () => {
        rpm45.classList.add('active');
        rpm33.classList.remove('active');
        vinylDisc.classList.add('speed-45');
        this.currentRpm = 45;
        this.showToast("Turntable Speed: 45 RPM Single");
      });
    }

    // Vinyl crackle ambience switch
    const crackleSwitch = document.getElementById('vinylCrackleSwitch');
    if (crackleSwitch) {
      crackleSwitch.addEventListener('change', (e) => {
        this.toggleVinylCrackle(e.target.checked);
      });
    }

    // Turntable direct vinyl disc click to toggle playback
    if (vinylDisc) {
      vinylDisc.addEventListener('click', () => this.togglePlayPause());
    }
  }

  setupEventListeners() {
    // Play/Pause (both deck and bottom dock)
    const playPauseBtn = document.getElementById('playPauseBtn');
    const deckPlayBtn = document.getElementById('deckPlayBtn');
    if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    if (deckPlayBtn) deckPlayBtn.addEventListener('click', () => this.togglePlayPause());

    // Next / Prev (both deck and dock)
    document.getElementById('prevBtn')?.addEventListener('click', () => this.playPrevious());
    document.getElementById('deckPrevBtn')?.addEventListener('click', () => this.playPrevious());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.playNext());
    document.getElementById('deckNextBtn')?.addEventListener('click', () => this.playNext());

    // Shuffle & Repeat
    const shuffleBtn = document.getElementById('shuffleBtn');
    const deckShuffleBtn = document.getElementById('deckShuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.isShuffle = !this.isShuffle;
        shuffleBtn.classList.toggle('active', this.isShuffle);
        if (deckShuffleBtn) deckShuffleBtn.classList.toggle('active', this.isShuffle);
        this.showToast(this.isShuffle ? "🔀 Shuffle mode: ON" : "Shuffle mode: OFF");
      });
    }
    if (deckShuffleBtn) {
      deckShuffleBtn.addEventListener('click', () => {
        this.isShuffle = !this.isShuffle;
        deckShuffleBtn.classList.toggle('active', this.isShuffle);
        if (shuffleBtn) shuffleBtn.classList.toggle('active', this.isShuffle);
        this.showToast(this.isShuffle ? "🔀 Shuffle mode: ON" : "Shuffle mode: OFF");
      });
    }
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        this.isRepeat = !this.isRepeat;
        repeatBtn.classList.toggle('active', this.isRepeat);
        this.showToast(this.isRepeat ? "🔁 Repeat track: ON" : "Repeat track: OFF");
      });
    }

    // Favorite button on deck & dock
    const deckFavBtn = document.getElementById('deckFavBtn');
    const dockFavBtn = document.getElementById('dockFavBtn');
    const toggleCurrentFav = () => {
      if (this.currentTrack) this.toggleFavorite(this.currentTrack.id);
    };
    if (deckFavBtn) deckFavBtn.addEventListener('click', toggleCurrentFav);
    if (dockFavBtn) dockFavBtn.addEventListener('click', toggleCurrentFav);

    // Progress bar seeking
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.addEventListener('input', (e) => {
        const percent = parseFloat(e.target.value);
        if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.getDuration === 'function') {
          const duration = this.ytPlayer.getDuration() || (this.currentTrack ? this.currentTrack.duration : 100);
          this.ytPlayer.seekTo((percent / 100) * duration, true);
        } else if (this.currentTrack) {
          this.currentTime = (percent / 100) * this.currentTrack.duration;
          this.updateTimeDisplay(this.currentTime, this.currentTrack.duration);
        }
      });
    }

    // Volume & Mute
    const volControl = document.getElementById('volumeControl');
    const volBtn = document.getElementById('volumeBtn');
    if (volControl) {
      volControl.addEventListener('input', (e) => {
        this.volume = parseInt(e.target.value);
        if (this.isMuted) this.isMuted = false;
        if (this.ytReady && this.ytPlayer && this.ytPlayer.setVolume) {
          this.ytPlayer.setVolume(this.volume);
          if (this.ytPlayer.unMute) this.ytPlayer.unMute();
        }
        this.updateVolumeUI();
      });
    }
    if (volBtn) {
      volBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        if (this.ytReady && this.ytPlayer) {
          if (this.isMuted && this.ytPlayer.mute) this.ytPlayer.mute();
          else if (!this.isMuted && this.ytPlayer.unMute) this.ytPlayer.unMute();
        }
        this.updateVolumeUI();
        this.showToast(this.isMuted ? "Muted 🔇" : "Unmuted 🔊");
      });
    }

    // Drawers (YouTube, Queue, Equalizer, Sleep Timer)
    document.getElementById('ytModalBtn')?.addEventListener('click', () => this.toggleDrawer('ytVideoDrawer'));
    document.getElementById('closeYtDrawer')?.addEventListener('click', () => this.toggleDrawer(null));

    document.getElementById('queueBtn')?.addEventListener('click', () => this.toggleDrawer('queuePanel'));
    document.getElementById('closeQueue')?.addEventListener('click', () => this.toggleDrawer(null));
    document.getElementById('clearQueueBtn')?.addEventListener('click', () => this.clearQueue());

    document.getElementById('eqBtn')?.addEventListener('click', () => this.toggleDrawer('eqPanel'));
    document.getElementById('closeEq')?.addEventListener('click', () => this.toggleDrawer(null));

    document.getElementById('sleepTimerBtn')?.addEventListener('click', () => this.toggleDrawer('sleepTimerPanel'));
    document.getElementById('closeSleepTimer')?.addEventListener('click', () => this.toggleDrawer(null));

    // Equalizer sliders
    document.querySelectorAll('.eq-range').forEach(range => {
      range.addEventListener('input', (e) => {
        const band = e.target.dataset.band;
        const val = parseInt(e.target.value);
        this.eqSettings[band] = val;
        const label = document.getElementById(`${band === 'low' ? 'bass' : band === 'mid' ? 'mid' : 'treble'}Val`);
        if (label) label.textContent = `${val > 0 ? '+' : ''}${val}dB`;
      });
    });

    // Equalizer presets
    document.querySelectorAll('.eq-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.eq-preset').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        this.applyEqPreset(e.target.dataset.preset);
      });
    });

    // Sleep timer options
    document.querySelectorAll('.timer-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setSleepTimer(parseInt(e.target.dataset.minutes));
      });
    });
    document.getElementById('setCustomTimer')?.addEventListener('click', () => {
      const mins = parseInt(document.getElementById('customTimer')?.value);
      if (mins >= 0) this.setSleepTimer(mins);
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        this.seekRelative(10);
      } else if (e.code === 'ArrowLeft') {
        this.seekRelative(-10);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.changeVolume(5);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.changeVolume(-5);
      } else if (e.code === 'KeyM') {
        this.isMuted = !this.isMuted;
        this.updateVolumeUI();
      } else if (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
      }
    });
  }

  // --- Track Selection & Playback Logic ---
  loadTrack(track, autoPlay = true) {
    if (!track) return;
    this.currentTrack = track;
    this.currentIndex = this.tracks.findIndex(t => t.id === track.id);
    this.duration = track.duration;
    this.currentTime = 0;

    // Update Left Turntable Deck
    const vinylCenterImg = document.getElementById('vinylCenterImg');
    const deckTrackTitle = document.getElementById('deckTrackTitle');
    const deckTrackArtist = document.getElementById('deckTrackArtist');
    const deckGenre = document.getElementById('deckGenre');
    const deckAudioQuality = document.getElementById('deckAudioQuality');

    if (vinylCenterImg) vinylCenterImg.src = track.imageUrl;
    if (deckTrackTitle) deckTrackTitle.textContent = track.title;
    if (deckTrackArtist) deckTrackArtist.textContent = `${track.artist} — ${track.album} (${track.year})`;
    if (deckGenre) deckGenre.textContent = track.genre;
    if (deckAudioQuality) deckAudioQuality.innerHTML = `<i class="fas fa-gem me-1 text-warning"></i> ${track.quality}`;

    // Update Bottom Dock
    const nowPlayingArt = document.getElementById('nowPlayingArt');
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    const durationEl = document.getElementById('duration');

    if (nowPlayingArt) nowPlayingArt.src = track.imageUrl;
    if (nowPlayingTitle) nowPlayingTitle.textContent = track.title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = track.artist;
    if (durationEl) durationEl.textContent = this.formatDuration(track.duration);

    // Update Favorite Buttons state
    this.updateCurrentFavIcon();

    // Reset scrubber
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.value = 0;
    this.updateTimeDisplay(0, track.duration);

    // Add to recently played
    this.addToRecentlyPlayed(track);

    // YouTube track synchronization
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
      if (autoPlay) {
        this.ytPlayer.loadVideoById(track.youtubeId);
      } else {
        this.ytPlayer.cueVideoById(track.youtubeId);
      }
    }

    if (autoPlay) {
      this.setPlaybackUI(true);
      this.startProgressTracker();
      this.showToast(`▶ Spinning Vinyl: ${track.title}`);
    }

    // Refresh active states in track list
    this.render();
  }

  togglePlayPause() {
    if (!this.currentTrack) {
      if (this.tracks.length > 0) this.loadTrack(this.tracks[0], true);
      return;
    }

    this.initAudioContext();

    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      if (this.isPlaying) {
        this.ytPlayer.pauseVideo();
      } else {
        this.ytPlayer.playVideo();
      }
    } else {
      // Local simulated playback toggle
      this.setPlaybackUI(!this.isPlaying);
      if (this.isPlaying) {
        this.startProgressTracker();
        this.showToast(`▶ Playing: ${this.currentTrack.title}`);
      } else {
        this.stopProgressTracker();
      }
    }
  }

  setPlaybackUI(playing) {
    this.isPlaying = playing;

    // Turntable elements
    const vinylDisc = document.getElementById('vinylDisc');
    const tonearm = document.getElementById('tonearmAssembly');
    const powerLamp = document.getElementById('powerLamp');
    const deckPlayIcon = document.getElementById('deckPlayIcon');
    const mainPlayIcon = document.getElementById('mainPlayIcon');
    const dockVinyl = document.getElementById('dockVinylMini');

    if (playing) {
      if (vinylDisc) vinylDisc.classList.add('is-spinning');
      if (tonearm) tonearm.classList.add('is-tracking');
      if (powerLamp) powerLamp.classList.add('active');
      if (deckPlayIcon) deckPlayIcon.className = 'fas fa-pause';
      if (mainPlayIcon) mainPlayIcon.className = 'fas fa-pause';
      if (dockVinyl) dockVinyl.classList.add('is-spinning');
    } else {
      if (vinylDisc) vinylDisc.classList.remove('is-spinning');
      if (tonearm) tonearm.classList.remove('is-tracking');
      if (powerLamp) powerLamp.classList.remove('active');
      if (deckPlayIcon) deckPlayIcon.className = 'fas fa-play';
      if (mainPlayIcon) mainPlayIcon.className = 'fas fa-play';
      if (dockVinyl) dockVinyl.classList.remove('is-spinning');
    }
  }

  playNext() {
    if (this.isRepeat && this.currentTrack) {
      this.loadTrack(this.currentTrack, true);
      return;
    }

    if (this.queue.length > 0) {
      const nextTrack = this.queue.shift();
      this.updateQueueBadge();
      this.loadTrack(nextTrack, true);
      return;
    }

    if (this.isShuffle && this.tracks.length > 1) {
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * this.tracks.length);
      } while (randIndex === this.currentIndex);
      this.loadTrack(this.tracks[randIndex], true);
      return;
    }

    const nextIndex = (this.currentIndex + 1) % this.tracks.length;
    this.loadTrack(this.tracks[nextIndex], true);
  }

  playPrevious() {
    if (this.currentTime > 4) {
      // Seek back to track start if played more than 4 seconds
      if (this.ytReady && this.ytPlayer && this.ytPlayer.seekTo) {
        this.ytPlayer.seekTo(0, true);
      }
      this.currentTime = 0;
      return;
    }

    const prevIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(this.tracks[prevIndex], true);
  }

  seekRelative(deltaSeconds) {
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
      const current = this.ytPlayer.getCurrentTime() || 0;
      this.ytPlayer.seekTo(Math.max(0, current + deltaSeconds), true);
    } else if (this.currentTrack) {
      this.currentTime = Math.max(0, Math.min(this.currentTrack.duration, this.currentTime + deltaSeconds));
      this.updateTimeDisplay(this.currentTime, this.currentTrack.duration);
    }
  }

  changeVolume(delta) {
    this.volume = Math.max(0, Math.min(100, this.volume + delta));
    const volControl = document.getElementById('volumeControl');
    if (volControl) volControl.value = this.volume;
    if (this.ytReady && this.ytPlayer && this.ytPlayer.setVolume) {
      this.ytPlayer.setVolume(this.volume);
    }
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    const volIcon = document.getElementById('volIcon');
    if (!volIcon) return;

    if (this.isMuted || this.volume === 0) {
      volIcon.className = 'fas fa-volume-xmark text-danger';
    } else if (this.volume < 45) {
      volIcon.className = 'fas fa-volume-low';
    } else {
      volIcon.className = 'fas fa-volume-high';
    }
  }

  startProgressTracker() {
    this.stopProgressTracker();
    this.progressInterval = setInterval(() => {
      let cur = 0;
      let dur = this.currentTrack ? this.currentTrack.duration : 1;

      if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        cur = this.ytPlayer.getCurrentTime() || 0;
        dur = this.ytPlayer.getDuration() || dur;
      } else {
        this.currentTime += 0.5;
        cur = this.currentTime;
        if (cur >= dur) {
          this.playNext();
          return;
        }
      }

      this.currentTime = cur;
      this.duration = dur;

      const percent = (cur / dur) * 100;
      const progressBar = document.getElementById('progressBar');
      if (progressBar) progressBar.value = percent;
      this.updateTimeDisplay(cur, dur);
    }, 500);
  }

  stopProgressTracker() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  updateTimeDisplay(currentTime, duration) {
    const curEl = document.getElementById('currentTime');
    const durEl = document.getElementById('duration');
    if (curEl) curEl.textContent = this.formatDuration(currentTime);
    if (durEl) durEl.textContent = this.formatDuration(duration);
  }

  formatDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // --- Favorites Management ---
  toggleFavorite(trackId) {
    const strId = trackId.toString();
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;

    if (this.favorites.has(strId)) {
      this.favorites.delete(strId);
      this.showToast(`Removed "${track.title}" from favorites`);
    } else {
      this.favorites.add(strId);
      this.showToast(`Saved "${track.title}" to favorites ❤️`);
    }

    this.saveStorage();
    this.updateFavoritesCount();
    this.updateCurrentFavIcon();
    this.render();
  }

  updateFavoritesCount() {
    const count = this.favorites.size;
    const desktopBadge = document.getElementById('favoritesCount');
    const mobileBadge = document.getElementById('mobileFavCount');
    if (desktopBadge) desktopBadge.textContent = count;
    if (mobileBadge) mobileBadge.textContent = count;
  }

  updateCurrentFavIcon() {
    if (!this.currentTrack) return;
    const isFav = this.favorites.has(this.currentTrack.id.toString());
    const deckFavIcon = document.getElementById('deckFavIcon');
    const dockFavIcon = document.getElementById('dockFavIcon');

    if (deckFavIcon) {
      deckFavIcon.className = isFav ? 'fas fa-heart text-danger' : 'far fa-heart';
    }
    if (dockFavIcon) {
      dockFavIcon.className = isFav ? 'fas fa-heart text-danger' : 'far fa-heart';
    }
  }

  addToRecentlyPlayed(track) {
    this.recentlyPlayed = this.recentlyPlayed.filter(t => t.id !== track.id);
    this.recentlyPlayed.unshift(track);
    if (this.recentlyPlayed.length > 12) this.recentlyPlayed.pop();
    this.saveStorage();
  }

  // --- Queue System ---
  addToQueue(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    this.queue.push(track);
    this.updateQueueBadge();
    this.showToast(`Added to queue: "${track.title}"`);
    this.renderQueueDrawer();
  }

  clearQueue() {
    this.queue = [];
    this.updateQueueBadge();
    this.renderQueueDrawer();
    this.showToast("Queue cleared");
  }

  updateQueueBadge() {
    const dot = document.getElementById('queueBadgeDot');
    const countBadge = document.getElementById('queueItemCount');
    if (dot) dot.classList.toggle('d-none', this.queue.length === 0);
    if (countBadge) countBadge.textContent = this.queue.length;
  }

  renderQueueDrawer() {
    const container = document.getElementById('queueList');
    if (!container) return;

    if (this.queue.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-white-50 small">
          <i class="fas fa-list-ul mb-2 fs-5 opacity-50"></i>
          <div>Playback queue is empty</div>
          <div class="text-dim extra-small mt-1">Click + Queue on any track to add</div>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    this.queue.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <img src="${track.imageUrl}" class="queue-item-img" alt="${track.title}" />
        <div class="queue-item-info">
          <div class="queue-item-title">${track.title}</div>
          <div class="queue-item-artist">${track.artist}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="text-white-50 small font-mono">${this.formatDuration(track.duration)}</span>
          <button class="btn btn-sm text-danger p-0 delete-queue-btn" data-index="${index}" title="Remove">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.delete-queue-btn')) {
          e.stopPropagation();
          this.queue.splice(index, 1);
          this.updateQueueBadge();
          this.renderQueueDrawer();
          return;
        }
        this.queue.splice(index, 1);
        this.updateQueueBadge();
        this.renderQueueDrawer();
        this.loadTrack(track, true);
      });

      container.appendChild(item);
    });
  }

  // --- Drawer Management ---
  toggleDrawer(drawerId) {
    const drawers = ['ytVideoDrawer', 'queuePanel', 'eqPanel', 'sleepTimerPanel'];
    drawers.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === drawerId) {
        const isShown = el.classList.contains('show');
        el.classList.toggle('show', !isShown);
        if (!isShown && id === 'queuePanel') this.renderQueueDrawer();
      } else {
        el.classList.remove('show');
      }
    });
  }

  // --- Equalizer & Sleep Timer ---
  applyEqPreset(preset) {
    switch (preset) {
      case 'vinyl': this.eqSettings = { low: 5, mid: 2, high: -2 }; break;
      case 'rock': this.eqSettings = { low: 6, mid: 2, high: 5 }; break;
      case 'pop': this.eqSettings = { low: 3, mid: 3, high: 4 }; break;
      case 'jazz': this.eqSettings = { low: 4, mid: 5, high: 2 }; break;
      default: this.eqSettings = { low: 0, mid: 0, high: 0 };
    }

    const lowSlider = document.querySelector('.eq-range[data-band="low"]');
    const midSlider = document.querySelector('.eq-range[data-band="mid"]');
    const highSlider = document.querySelector('.eq-range[data-band="high"]');

    if (lowSlider) lowSlider.value = this.eqSettings.low;
    if (midSlider) midSlider.value = this.eqSettings.mid;
    if (highSlider) highSlider.value = this.eqSettings.high;

    document.getElementById('bassVal').textContent = `${this.eqSettings.low > 0 ? '+' : ''}${this.eqSettings.low}dB`;
    document.getElementById('midVal').textContent = `${this.eqSettings.mid > 0 ? '+' : ''}${this.eqSettings.mid}dB`;
    document.getElementById('trebleVal').textContent = `${this.eqSettings.high > 0 ? '+' : ''}${this.eqSettings.high}dB`;

    this.showToast(`Audio Equalizer: ${preset.toUpperCase()}`);
  }

  setSleepTimer(minutes) {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }

    const statusEl = document.getElementById('timerStatus');
    if (minutes <= 0) {
      if (statusEl) statusEl.textContent = "Timer inactive";
      this.showToast("Sleep timer deactivated");
      return;
    }

    const ms = minutes * 60 * 1000;
    const endTime = new Date(Date.now() + ms);

    if (statusEl) {
      statusEl.textContent = `Music stops at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    this.sleepTimer = setTimeout(() => {
      if (this.ytReady && this.ytPlayer && this.ytPlayer.pauseVideo) {
        this.ytPlayer.pauseVideo();
      }
      this.setPlaybackUI(false);
      this.stopProgressTracker();
      if (statusEl) statusEl.textContent = "Timer inactive";
      this.showToast("😴 Sleep timer: Vinyl playback paused");
    }, ms);

    this.showToast(`Sleep timer set for ${minutes} minutes`);
  }

  // --- Liner Notes & Comments Modal ---
  openCommentsModal(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;

    const modalTitle = document.getElementById('commentModalTitle');
    const container = document.getElementById('commentsContainer');
    const form = document.getElementById('commentForm');

    if (modalTitle) modalTitle.innerHTML = `<i class="far fa-comments me-2 text-warning"></i> Liner Notes: "${track.title}"`;
    if (container) {
      const notes = this.comments[trackId] || [];
      if (notes.length === 0) {
        container.innerHTML = `<p class="text-white-50 small text-center py-3">No liner notes yet. Be the first to share memories of this track!</p>`;
      } else {
        container.innerHTML = notes.map(n => `
          <div class="comment-item p-2 mb-2 rounded bg-black-25 border border-white-05">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold text-warning small">${n.name}</span>
              <span class="text-white-50 extra-small">${n.date}</span>
            </div>
            <div class="text-white-75 small">${n.text}</div>
          </div>
        `).join('');
      }
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('commentName');
        const textInput = document.getElementById('commentText');
        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (name && text) {
          if (!this.comments[trackId]) this.comments[trackId] = [];
          this.comments[trackId].push({
            id: Date.now(),
            name,
            text,
            date: new Date().toISOString().split('T')[0]
          });
          this.saveComments();
          nameInput.value = '';
          textInput.value = '';
          this.openCommentsModal(trackId);
          this.showToast("Liner note posted!");
        }
      };
    }
  }

  // --- Filtering & Sorting ---
  getVisibleTracks() {
    let list = [...this.tracks];

    // Source tab filter
    if (this.currentTab === 'favorites') {
      list = list.filter(t => this.favorites.has(t.id.toString()));
    } else if (this.currentTab === 'recent') {
      list = this.recentlyPlayed;
    }

    // Genre filter
    if (this.currentFilter && this.currentFilter !== 'all') {
      list = list.filter(t => t.genre.toLowerCase() === this.currentFilter.toLowerCase());
    }

    // Search query filter
    if (this.searchQuery) {
      list = list.filter(t => 
        t.title.toLowerCase().includes(this.searchQuery) ||
        t.artist.toLowerCase().includes(this.searchQuery) ||
        t.genre.toLowerCase().includes(this.searchQuery) ||
        t.album.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sorting
    if (this.currentSort === 'popularity') {
      list.sort((a, b) => b.plays - a.plays);
    } else if (this.currentSort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.currentSort === 'artist') {
      list.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (this.currentSort === 'year') {
      list.sort((a, b) => b.year - a.year);
    }

    return list;
  }

  // --- Render HTML for Grid Cards and List Rows ---
  render() {
    const container = document.getElementById('cardContainer');
    const totalBadge = document.getElementById('totalTracksBadge');
    if (!container) return;

    const visibleTracks = this.getVisibleTracks();
    if (totalBadge) totalBadge.textContent = `${visibleTracks.length} ${visibleTracks.length === 1 ? 'Track' : 'Tracks'}`;

    if (this.currentViewMode === 'list') {
      container.className = 'track-collection-container view-list';
    } else {
      container.className = 'track-collection-container row g-3 g-md-4';
    }

    if (visibleTracks.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-compact-disc fa-3x text-white-50 mb-3 opacity-50"></i>
          <h4 class="text-white fw-bold">No Vinyl Tracks Found</h4>
          <p class="text-white-50 small">Try selecting another genre filter or clearing your search.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    visibleTracks.forEach(track => {
      const isCurrent = this.currentTrack && this.currentTrack.id === track.id;
      const isFav = this.favorites.has(track.id.toString());

      if (this.currentViewMode === 'list') {
        const row = document.createElement('div');
        row.className = 'w-100';
        row.innerHTML = `
          <div class="track-row ${isCurrent ? 'is-active' : ''}" data-id="${track.id}">
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-link text-white-50 play-trigger-btn me-3 p-0" title="Play">
                <i class="fas ${isCurrent && this.isPlaying ? 'fa-pause text-warning' : 'fa-play'}"></i>
              </button>
              <img src="${track.imageUrl}" class="track-row-thumb" alt="${track.title}" />
              <div class="track-row-meta">
                <div class="track-row-title text-truncate">${track.title}</div>
                <div class="track-row-artist text-truncate">${track.artist} • <span class="text-white-50">${track.genre}</span></div>
              </div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <span class="badge-audiophile d-none d-md-inline-block">${track.year}</span>
              <span class="text-white-50 small font-mono">${this.formatDuration(track.duration)}</span>
              <button class="btn-card-fav-inline btn-link text-white-50 fav-trigger-btn" data-id="${track.id}">
                <i class="${isFav ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
              </button>
              <button class="btn-card-mini-action queue-trigger-btn" data-id="${track.id}">
                <i class="fas fa-plus"></i> Queue
              </button>
            </div>
          </div>
        `;
        container.appendChild(row);
      } else {
        // Grid Card
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-xl-4';
        col.innerHTML = `
          <div class="track-card ${isCurrent ? 'is-active' : ''}" data-id="${track.id}">
            <div class="track-card-media">
              <img src="${track.imageUrl}" class="track-card-img" alt="${track.title}" loading="lazy" />
              
              <div class="track-vinyl-peek">
                <div class="track-vinyl-peek-center"></div>
              </div>

              <div class="track-card-overlay">
                <button class="btn-card-play play-trigger-btn" aria-label="Play ${track.title}">
                  <i class="fas ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                </button>
              </div>

              <button class="btn-card-fav fav-trigger-btn ${isFav ? 'active' : ''}" data-id="${track.id}" aria-label="Favorite">
                <i class="fas fa-heart"></i>
              </button>
            </div>

            <div class="track-card-body">
              <div>
                <div class="track-badge-row">
                  <span class="card-genre-pill">${track.genre}</span>
                  <span class="card-vinyl-tag"><i class="fas fa-record-vinyl ${isCurrent && this.isPlaying ? 'fa-spin' : ''}"></i> ${track.year}</span>
                </div>
                <h4 class="card-track-title text-truncate">${track.title}</h4>
                <p class="card-track-artist text-truncate">${track.artist}</p>
              </div>

              <div class="card-footer-row">
                <span><i class="far fa-clock me-1"></i> ${this.formatDuration(track.duration)}</span>
                <div class="card-action-btns">
                  <button class="btn-card-mini-action queue-trigger-btn" data-id="${track.id}">
                    <i class="fas fa-plus me-1"></i> Queue
                  </button>
                  <button class="btn-card-mini-action comment-trigger-btn" data-id="${track.id}" data-bs-toggle="modal" data-bs-target="#commentModal">
                    <i class="far fa-comment"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        container.appendChild(col);
      }
    });

    this.bindCardEventListeners();
  }

  bindCardEventListeners() {
    // Play button trigger
    document.querySelectorAll('.play-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.target.closest('[data-id]');
        const id = parseInt(card.dataset.id);
        const track = this.tracks.find(t => t.id === id);
        if (track) {
          if (this.currentTrack && this.currentTrack.id === track.id) {
            this.togglePlayPause();
          } else {
            this.loadTrack(track, true);
          }
        }
      });
    });

    // Entire row or card click plays track
    document.querySelectorAll('.track-row, .track-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.fav-trigger-btn') || e.target.closest('.queue-trigger-btn') || e.target.closest('.comment-trigger-btn')) return;
        const id = parseInt(el.dataset.id);
        const track = this.tracks.find(t => t.id === id);
        if (track) {
          if (this.currentTrack && this.currentTrack.id === track.id) {
            this.togglePlayPause();
          } else {
            this.loadTrack(track, true);
          }
        }
      });
    });

    // Favorite button
    document.querySelectorAll('.fav-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.toggleFavorite(id);
      });
    });

    // Queue button
    document.querySelectorAll('.queue-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.addToQueue(id);
      });
    });

    // Comment / Liner note button
    document.querySelectorAll('.comment-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.openCommentsModal(id);
      });
    });
  }

  // --- Toast Notification Helper ---
  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

// Global YouTube Iframe callback hook
window.onYouTubeIframeAPIReady = function() {
  if (window.deluxeStudioApp && !window.deluxeStudioApp.ytReady) {
    window.deluxeStudioApp.createYtPlayerInstance();
  }
};

// Launch application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.deluxeStudioApp = new DeluxeSaloonStudio();
});