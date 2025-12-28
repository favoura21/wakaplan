const SUPABASE_URL = 'https://ahacsiaelpkzdprntxhz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYWNzaWFlbHBremRwcm50eGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjE3NTIsImV4cCI6MjA2MDQzNzc1Mn0.nSx-crmQlb9gNosMejHAXnRvIxdY36XCZFs53KzFr6E';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    document.addEventListener('DOMContentLoaded', async function() {
      const { data: { user } } = await supabase.auth.getUser();
      const vendorDashboardNavItem = document.getElementById('vendorDashboardNavItem');
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        if (profile && profile.user_type === 'vendor') {
          const { data: vendorRow } = await supabase
            .from('vendors')
            .select('user_id')
            .eq('user_id', user.id)
            .single();
          if (!vendorRow) {
            if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'none';
          } else {
            if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = '';
          }
        } else {
          if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'none';
        }
      } else {
        if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'none';
      }
    });

  

    // ─── 2) REFERENCES ──────────────────────────────────────────────────────────
    const mainContent        = document.getElementById('mainContent')
    const listingView        = document.getElementById('listingView')
    const detailView         = document.getElementById('detailView')
    const vendorsContainer   = document.getElementById('vendorsContainer')
    const searchBtn          = document.getElementById('searchBtn')
    const categorySelect     = document.getElementById('categorySelect')
    const locationSelect     = document.getElementById('locationSelect')
    const priceRangeSelect   = document.getElementById('priceRangeSelect')
    const loadMoreBtn        = document.getElementById('loadMoreBtn')
    const vendorBusinessName = document.getElementById('vendorBusinessName')
    const vendorFullName     = document.getElementById('vendorFullName')
    const vendorCategory     = document.getElementById('vendorCategory')
    const vendorLocation     = document.getElementById('vendorLocation')
    const vendorPriceRange   = document.getElementById('vendorPriceRange')
    const vendorDescription  = document.getElementById('vendorDescription')
    const vendorMainImage    = document.getElementById('vendorMainImage')
    const vendorExperience   = document.getElementById('vendorExperience')
    const vendorTravel       = document.getElementById('vendorTravel')
    const vendorNotice       = document.getElementById('vendorNotice')
    const vendorWeekends     = document.getElementById('vendorWeekends')
    const vendorUnique       = document.getElementById('vendorUnique')
    const vendorEmail        = document.getElementById('vendorEmail')
    const vendorPricingType  = document.getElementById('vendorPricingType')
    const vendorPriceRangeBadge = document.getElementById('vendorPriceRangeBadge')
    const vendorDirectBooking   = document.getElementById('vendorDirectBooking')
    const vendorSocialLinks     = document.getElementById('vendorSocialLinks')
    const categorySpecificSection = document.getElementById('categorySpecificSection')
    const vendorPortfolio      = document.getElementById('vendorPortfolio')
    const contactVendorBtn     = document.getElementById('contactVendorBtn')
    const vendorReviews        = document.getElementById('vendorReviews')
    const reviewForm           = document.getElementById('reviewForm')
    const reviewRating         = document.getElementById('reviewRating')
    const reviewContent        = document.getElementById('reviewContent')
    const vendorAddress        = document.getElementById('vendorAddress')
    const vendorRatingAbout    = document.getElementById('vendorRatingAbout')
    const vendorReviewsCount   = document.getElementById('vendorReviewsCount')

    let page = 0, perPage = 6

    // Portfolio Modal Function
    // Add Next/Prev navigation to portfolio modal
    let portfolioImages = [];
    let currentPortfolioIndex = 0;
    let portfolioKeyListener = null;

    function attachPortfolioModalNavListeners() {
      const nextBtn = document.getElementById('portfolioNextBtn');
      const prevBtn = document.getElementById('portfolioPrevBtn');
      if (nextBtn) {
        nextBtn.onclick = showNextPortfolioImage;
        nextBtn.style.pointerEvents = 'auto';
        nextBtn.style.display = '';
      }
      if (prevBtn) {
        prevBtn.onclick = showPrevPortfolioImage;
        prevBtn.style.pointerEvents = 'auto';
        prevBtn.style.display = '';
      }
      console.log('Portfolio modal nav listeners attached:', !!nextBtn, !!prevBtn);
    }

    function openPortfolioModal(imageUrl, caption) {
      const modalImage = document.getElementById('modalImage');
      const modalCaption = document.getElementById('modalCaption');
      const portfolioModalEl = document.getElementById('portfolioModal');
      const portfolioModal = new bootstrap.Modal(portfolioModalEl);

      // Find all images in the portfolio
      const portfolioGrid = document.getElementById('vendorPortfolio');
      portfolioImages = Array.from(portfolioGrid.querySelectorAll('.portfolio-item img')).map(img => ({
        src: img.src,
        caption: img.closest('.portfolio-item').querySelector('.portfolio-caption')?.textContent || ''
      }));
      // Set current index
      currentPortfolioIndex = portfolioImages.findIndex(img => img.src === imageUrl);
      if (currentPortfolioIndex === -1) currentPortfolioIndex = 0;

      // Show loading state
      modalImage.style.opacity = '0.5';
      modalImage.src = imageUrl;
      if (caption) {
        modalCaption.textContent = caption;
        modalCaption.style.display = 'block';
      } else {
        modalCaption.style.display = 'none';
      }
      portfolioModal.show();

      // Load the actual image
      const img = new Image();
      img.onload = () => {
        modalImage.src = imageUrl;
        modalImage.style.opacity = '1';
      };
      img.onerror = () => {
        modalImage.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
        modalImage.style.opacity = '1';
      };
      img.src = imageUrl;

      // Remove any previous keydown listener
      if (portfolioKeyListener) {
        document.removeEventListener('keydown', portfolioKeyListener);
      }
      // Add keyboard support (only one listener at a time)
      portfolioKeyListener = (e) => {
        if (e.key === 'Escape') {
          portfolioModal.hide();
        } else if (e.key === 'ArrowRight') {
          showNextPortfolioImage();
        } else if (e.key === 'ArrowLeft') {
          showPrevPortfolioImage();
        }
      };
      document.addEventListener('keydown', portfolioKeyListener);
      portfolioModalEl.addEventListener('hidden.bs.modal', () => {
        document.removeEventListener('keydown', portfolioKeyListener);
        portfolioKeyListener = null;
      }, { once: true });
      attachPortfolioModalNavListeners();
    }

    function showNextPortfolioImage() {
      if (!portfolioImages.length) return;
      currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioImages.length;
      const img = portfolioImages[currentPortfolioIndex];
      // Only update modal content, don't re-add listeners
      updatePortfolioModalContent(img.src, img.caption);
    }
    function showPrevPortfolioImage() {
      if (!portfolioImages.length) return;
      currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioImages.length) % portfolioImages.length;
      const img = portfolioImages[currentPortfolioIndex];
      updatePortfolioModalContent(img.src, img.caption);
    }
    function updatePortfolioModalContent(imageUrl, caption) {
      const modalImage = document.getElementById('modalImage');
      const modalCaption = document.getElementById('modalCaption');
      modalImage.style.opacity = '0.5';
      modalImage.src = imageUrl;
      if (caption) {
        modalCaption.textContent = caption;
        modalCaption.style.display = 'block';
      } else {
        modalCaption.style.display = 'none';
      }
      const img = new Image();
      img.onload = () => {
        modalImage.src = imageUrl;
        modalImage.style.opacity = '1';
      };
      img.onerror = () => {
        modalImage.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
        modalImage.style.opacity = '1';
      };
      img.src = imageUrl;
    }

    // Typewriter Animation
    class TypewriterAnimation {
      constructor(element, messages, options = {}) {
        this.element = element;
        this.messages = messages;
        this.currentMessageIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.startDelay = options.startDelay || 1000;
        
        this.init();
      }

      init() {
        setTimeout(() => {
          this.type();
        }, this.startDelay);
      }

      type() {
        const currentMessage = this.messages[this.currentMessageIndex];
        
        if (this.isDeleting) {
          // Deleting characters
          this.element.innerHTML = currentMessage.substring(0, this.currentCharIndex - 1);
          this.currentCharIndex--;
          
          if (this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
            setTimeout(() => this.type(), 500);
            return;
          }
        } else {
          // Typing characters
          this.element.innerHTML = currentMessage.substring(0, this.currentCharIndex + 1);
          this.currentCharIndex++;
          
          if (this.currentCharIndex === currentMessage.length) {
            setTimeout(() => {
              this.isDeleting = true;
              this.type();
            }, this.pauseTime);
            return;
          }
        }
        
        const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        setTimeout(() => this.type(), speed);
      }
    }

    // Initialize typewriter animation when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      const typewriterElement = document.getElementById('typewriter-text');
      if (typewriterElement) {
        const messages = [
          'From weddings to concerts, secure the perfect venue, stress-free with <span class="orange">WakaPlan</span>.',
          'Your Event, <span class="green">No Stress</span>. Find Trusted Vendors on <span class="orange">WakaPlan</span>.',
          'Plan your perfect event with <span class="blue">trusted Nigerian vendors</span> on <span class="orange">WakaPlan</span>.',
          'From DJs to decorators, book <span class="purple">quality vendors</span> with <span class="orange">WakaPlan</span>.',
          'Make your event unforgettable with <span class="pink">professional vendors</span> on <span class="orange">WakaPlan</span>.',
          'Stress-free event planning with <span class="yellow">verified vendors</span> on <span class="orange">WakaPlan</span>.',
          'Your dream event starts here with <span class="red">trusted vendors</span> on <span class="orange">WakaPlan</span>.'
        ];
        
        new TypewriterAnimation(typewriterElement, messages, {
          typeSpeed: 80,
          deleteSpeed: 40,
          pauseTime: 3000,
          startDelay: 1000
        });
      }
    });

    // Initialize Bootstrap components
    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search)
      const vendorUserId = urlParams.get('user_id')
      const searchParam = urlParams.get('search')
      
      if (vendorUserId) {
        showVendorDetail(vendorUserId)
      } else {
        loadInitial()
        
        // Handle search parameter from URL
        if (searchParam) {
          const searchInput = document.getElementById('navbarSearchInput');
          const searchInputMobile = document.getElementById('navbarSearchInputMobile');
          if (searchInput) searchInput.value = searchParam;
          if (searchInputMobile) searchInputMobile.value = searchParam;
          
          // Perform search after a short delay to ensure page is loaded
          setTimeout(() => {
            performSearch(searchParam);
          }, 100);
        }
      }
      loadHeroAds()
      attachPortfolioModalNavListeners();
      setupUniformNavigation();
      // Optionally, observe DOM changes to re-attach if needed
      const observer = new MutationObserver(() => {
        attachPortfolioModalNavListeners();
      });
      const modal = document.getElementById('portfolioModal');
      if (modal) {
        observer.observe(modal, { childList: true, subtree: true });
      }
    })

    // Parse a price string like "₦10,000 - ₦50,000", "10000-50000", "10500", etc.
    function parsePriceRange(priceStr) {
      if (!priceStr) return { min: null, max: null };
      let clean = priceStr.replace(/₦|,/g, '').trim();
      if (clean.includes('-')) {
        let [min, max] = clean.split('-').map(s => parseInt(s.trim(), 10));
        if (isNaN(min)) min = null;
        if (isNaN(max)) max = null;
        return { min, max };
      } else {
        let val = parseInt(clean, 10);
        if (isNaN(val)) return { min: null, max: null };
        return { min: val, max: val };
      }
    }
    // Parse the selected filter value (e.g., "₦10,000 - ₦50,000")
    function parseFilterRange(filterStr) {
      if (!filterStr) return { min: null, max: null };
      let clean = filterStr.replace(/₦|,/g, '').trim();
      if (clean.includes('-')) {
        let [min, max] = clean.split('-').map(s => parseInt(s.trim(), 10));
        if (isNaN(min)) min = null;
        if (isNaN(max)) max = null;
        return { min, max };
      } else if (clean.endsWith('+')) {
        let min = parseInt(clean.replace('+', '').trim(), 10);
        return { min, max: Infinity };
      } else {
        let val = parseInt(clean, 10);
        return { min: val, max: val };
      }
    }
    // Check if two ranges overlap
    function rangesOverlap(a, b) {
      if (a.min == null || a.max == null || b.min == null || b.max == null) return false;
      return a.max >= b.min && b.max >= a.min;
    }

    function getVendorProfileImage(vendor, isBanner = false) {
      // Try vendor table profile_image_url first
      if (vendor.profile_image_url) {
        return vendor.profile_image_url;
      }
      
      // Fallback to profiles table profile_image_url
      if (vendor.profiles && vendor.profiles.profile_image_url) {
        return vendor.profiles.profile_image_url;
      }
      
      // Final fallback to category-based placeholder
      const category = vendor.category?.toLowerCase().replace(/\s/g,'') || 'event';
      const size = isBanner ? '1200x800' : '600x400';
      return `https://source.unsplash.com/random/${size}/?${category},event`;
    }

    async function fetchVendors({ search = '', category = '', location = '', priceRange = '', page = 0 }) {
      let query = supabase
        .from('vendors')
        .select(`
          id,
          user_id,
          business_name,
          full_name,
          category,
          description,
          price_range,
          country,
          state,
          profile_image_url
        `)
        .range(page * perPage, page * perPage + perPage - 1)

      if (search) {
        const q = `%${search}%`
        query = query.or(`business_name.ilike.${q},full_name.ilike.${q},description.ilike.${q}`)
      }
      if (category) {
        query = query.ilike('category', category)
      }
      if (location) {
        const loc = `%${location}%`
        query = query.or(`country.ilike.${loc},state.ilike.${loc}`)
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching vendors:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('No vendors found');
        return [];
      }
      
      console.log(`Found ${data.length} vendors`);
      
      // Fetch ratings and profile images for each vendor
      for (const vendor of data) {
        // Fetch profile image from profiles table if not in vendors table
        if (!vendor.profile_image_url) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('profile_image_url')
              .eq('id', vendor.user_id)
              .single();
            if (!profileError && profile && profile.profile_image_url) {
              vendor.profiles = { profile_image_url: profile.profile_image_url };
            }
          } catch (err) {
            console.log(`No profile found for vendor ${vendor.user_id}`);
          }
        }

        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('vendor_id', vendor.user_id);
        if (reviews && reviews.length) {
          const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
          vendor.rating = (sum / reviews.length).toFixed(1);
          vendor.reviewCount = reviews.length;
        } else {
          vendor.rating = '3.5';
          vendor.reviewCount = 0;
        }
        // Fetch special data for each vendor (Venue example)
        if (vendor.category === 'Venue') {
          const { data: venueData } = await supabase
            .from('venue_data')
            .select('capacity, amenities, parking')
            .eq('vendor_id', vendor.user_id)
            .single();
          vendor.venueData = venueData;
        }
        // Add similar blocks for other categories if needed
      }
      // Robust price filtering in JS
      if (priceRange) {
        const filterRange = parseFilterRange(priceRange);
        return (data || []).filter(vendor => {
          const vendorRange = parsePriceRange(vendor.price_range);
          return rangesOverlap(vendorRange, filterRange);
        });
      }
      return data || []
    }

    function renderVendors(list, append = false) {
      if (!append) vendorsContainer.innerHTML = ''
      if (!list.length && !append) {
        vendorsContainer.innerHTML = `
          <div class="no-results animate__animated animate__fadeIn">
            <i class="bi bi-emoji-frown"></i>
            <h4>No vendors found</h4>
            <p class="text-muted">Try adjusting your search filters</p>
          </div>`
        loadMoreBtn.style.display = 'none'
        return
      }
      const html = list.map(v => `
        <div class="col-lg-4 col-md-6">
          <a href="?user_id=${v.user_id}" class="card-link">
            <div class="card vendor-card h-100">
              <img src="${
                getVendorProfileImage(v)
              }"
                   class="vendor-img" alt="${v.category}">
              <div class="card-body">
                <div class="category">${v.category?.toUpperCase()}</div>
                <div class="vendor-name">${v.business_name}</div>
                <div class="owner">${v.full_name}</div>
                <div class="desc">${v.description?.substring(0, 100)}${v.description?.length > 100 ? '...' : ''}</div>
                <div class="rating"><span>★</span> ${v.rating || '4.0'}</div>
                <div class="location-price">
                  <div class="location">${v.country || 'Nigeria'}, ${v.state || 'Lagos'}</div>
                  <div class="price">${
                    (() => {
                      if (!v.price_range) return '₦60,000';
                      let val = v.price_range.trim();
                      // Remove any existing Naira symbol for processing
                      if (val.startsWith('₦')) val = val.slice(1).trim();
                      // Check if it's a range
                      if (val.includes('-')) {
                        const [min, max] = val.split('-').map(s => s.trim().replace(/,/g, ''));
                        const minNum = Number(min);
                        const maxNum = Number(max);
                        if (!isNaN(minNum) && !isNaN(maxNum)) {
                          return `₦${minNum.toLocaleString()}`;
                        }
                        // If not numbers, just prepend ₦
                        return `₦${val.split('-')[0]}`;
                      } else {
                        // Single value
                        const num = Number(val.replace(/,/g, ''));
                        if (!isNaN(num)) {
                          return `₦${num.toLocaleString()}`;
                        }
                        return `₦${val}`;
                      }
                    })()
                  }</div>
                </div>
              </div>
            </div>
          </a>
        </div>
      `).join('')
      vendorsContainer.insertAdjacentHTML('beforeend', html)
      loadMoreBtn.style.display = list.length < perPage ? 'none' : 'block'
      updateSaveButtons();
      addVendorCardClickHandlers();
    }

    async function loadInitial() {
      page = 0
      const navbarSearchInput = document.getElementById('navbarSearchInput');
      const navbarSearchInputMobile = document.getElementById('navbarSearchInputMobile');
      const searchTerm = (navbarSearchInput ? navbarSearchInput.value.trim() : '') || 
                        (navbarSearchInputMobile ? navbarSearchInputMobile.value.trim() : '');
      
      let list = await fetchVendors({
        search: searchTerm,
        category: categorySelect ? categorySelect.value : '',
        location: locationSelect ? locationSelect.value : '',
        priceRange: priceRangeSelect ? priceRangeSelect.value : '',
        page
      })
      if (showOnlySaved) {
        list = list.filter(v => savedVendors.has(v.user_id));
      }
      renderVendors(list, false)
      // Show hero slider on main listing view
      const heroSlider = document.getElementById('hero-slider');
      if (heroSlider) heroSlider.style.display = '';
    }

    async function loadMore() {
      page++
      const navbarSearchInput = document.getElementById('navbarSearchInput');
      const navbarSearchInputMobile = document.getElementById('navbarSearchInputMobile');
      const searchTerm = (navbarSearchInput ? navbarSearchInput.value.trim() : '') || 
                        (navbarSearchInputMobile ? navbarSearchInputMobile.value.trim() : '');
      
      const more = await fetchVendors({
        search: searchTerm,
        category: categorySelect ? categorySelect.value : '',
        location: locationSelect ? locationSelect.value : '',
        priceRange: priceRangeSelect ? priceRangeSelect.value : '',
        page
      })
      renderVendors(more, true)
    }

    function debounce(fn, delay = 500) {
      let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
      }
    }

    if (searchBtn) searchBtn.addEventListener('click', loadInitial)
    if (categorySelect) categorySelect.addEventListener('change', loadInitial)
    if (locationSelect) locationSelect.addEventListener('change', loadInitial)
    if (priceRangeSelect) priceRangeSelect.addEventListener('change', loadInitial)
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMore)
    async function showVendorDetail(vendorUserId) {
      try {
        // Hide listing view, show detail view
        listingView.classList.add('d-none');
        detailView.classList.remove('d-none');
        
        // Hide hero section on vendor detail page
        const heroSection = document.getElementById('heroSection');
        if (heroSection) heroSection.style.display = 'none';
        
        // Hide hero slider on vendor detail page
        const heroSlider = document.getElementById('hero-slider');
        if (heroSlider) heroSlider.style.display = 'none';

        // 1. Fetch vendor data with profile image fallback
        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', vendorUserId)
          .single();
          
        // Fetch profile image from profiles table if not in vendors table
        if (vendor && !vendor.profile_image_url) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('profile_image_url')
              .eq('id', vendor.user_id)
              .single();
            if (!profileError && profile && profile.profile_image_url) {
              vendor.profiles = { profile_image_url: profile.profile_image_url };
            }
          } catch (err) {
            console.log(`No profile found for vendor ${vendor.user_id}`);
          }
        }
        if (vendorError || !vendor) {
          throw vendorError || new Error('Vendor not found');
        }

        // 2. Fetch images for portfolio
        let images = [];
        try {
          // First, let's test if we can access the vendor_images table at all
          const { data: testData, error: testError } = await supabase
            .from('vendor_images')
            .select('count')
            .limit(1);
          
          // Query vendor_images table using the correct vendor_id field
          // Try both string and UUID formats
          let { data: imagesData, error: imagesError } = await supabase
            .from('vendor_images')
            .select('*')
            .eq('vendor_id', vendorUserId);
          
          // If that fails, try with the vendor's user_id from the vendor record
          if (imagesError || !imagesData || imagesData.length === 0) {
            const { data: altImagesData, error: altImagesError } = await supabase
              .from('vendor_images')
              .select('*')
              .eq('vendor_id', vendor.user_id);
            
            if (!altImagesError && altImagesData) {
              imagesData = altImagesData;
              imagesError = null;
            }
          }
          
          if (imagesError) {
            console.error('Error fetching vendor images:', imagesError);
            images = [];
          } else {
            images = imagesData || [];
          }
          
        } catch (err) {
          console.error('Portfolio loading error:', err);
          images = [];
        }

        // 3. Populate header fields
        if (vendorMainImage) {
          vendorMainImage.src = getVendorProfileImage(vendor, true); // true for banner size
          vendorMainImage.alt = vendor.business_name || 'Vendor image';
        }
        if (vendorBusinessName) vendorBusinessName.textContent = vendor.business_name || 'N/A';
        if (vendorFullName) vendorFullName.textContent = vendor.full_name || '';
        if (vendorCategory) {
        vendorCategory.textContent = vendor.category || 'N/A';
        vendorCategory.className = 'vendor-category ' + getCategoryBadgeClass(vendor.category);
        }
        // Format location properly
        const locationText = [vendor.state, vendor.country].filter(Boolean).join(', ') || 'Location not specified';
        if (vendorLocation) vendorLocation.textContent = locationText;
        
        // Format price range with proper currency
        const priceText = vendor.price_range ? `₦${vendor.price_range}` : 'Price not specified';
        if (vendorPriceRange) vendorPriceRange.textContent = priceText;
        if (vendorPriceRangeBadge) vendorPriceRangeBadge.textContent = priceText;
        
        // Handle description with fallback
        if (vendorDescription) vendorDescription.textContent = vendor.description || 'No description available for this vendor.';
        
        // Format experience properly
        const experienceText = vendor.experience ? `${vendor.experience} years` : 'Experience not specified';
        if (vendorExperience) vendorExperience.textContent = experienceText;
        
        // Format travel information
        const travelText = vendor.travel === 'yes' ? 'Willing to travel' : vendor.travel === 'no' ? 'Local only' : 'Travel not specified';
        if (vendorTravel) vendorTravel.textContent = travelText;
        
        // Format notice period
        const noticeText = vendor.notice ? `${vendor.notice} days notice required` : 'Notice period not specified';
        if (vendorNotice) vendorNotice.textContent = noticeText;
        
        // Format weekends availability
        const weekendsText = vendor.weekends === 'yes' ? 'Available on weekends' : vendor.weekends === 'no' ? 'Weekdays only' : 'Weekend availability not specified';
        if (vendorWeekends) vendorWeekends.textContent = weekendsText;
        
        // Handle unique offering
        if (vendorUnique) vendorUnique.textContent = vendor.unique || 'No unique offering specified by this vendor.';
        
        // Handle email
        if (vendorEmail) vendorEmail.textContent = vendor.email || 'Email not provided';
        
        // Format pricing type
        const pricingTypeText = vendor.pricing_type ? vendor.pricing_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Pricing type not specified';
        if (vendorPricingType) vendorPricingType.textContent = pricingTypeText;
        
        // Format direct booking
        const directBookingText = vendor.direct_booking === 'platform' ? 'Platform only' : vendor.direct_booking === 'both' ? 'Platform and direct' : 'Booking method not specified';
        if (vendorDirectBooking) vendorDirectBooking.textContent = directBookingText;
        
        // Set up contact button
        if (contactVendorBtn) contactVendorBtn.href = `messages.html?vendorId=${vendor.user_id}`;
        
        // Handle address
        if (vendorAddress) vendorAddress.textContent = vendor.address || 'Address not provided';
        
        // Handle ratings
        if (vendorRatingAbout) vendorRatingAbout.textContent = vendor.rating || 'N/A';
        if (vendorReviewsCount) vendorReviewsCount.textContent = vendor.reviews_count || '0';

        // 4. Load and display real average rating and review count
        const { data: allReviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('vendor_id', vendorUserId);
        let avgRating = '3.5', reviewCount = 3;
        if (allReviews && allReviews.length) {
          const sum = allReviews.reduce((s, r) => s + (r.rating || 0), 0);
          avgRating = (sum / allReviews.length).toFixed(1);
          reviewCount = allReviews.length;
        }
        if (vendorRating) vendorRating.textContent = avgRating;
        if (vendorRatingAbout) vendorRatingAbout.textContent = avgRating;
        if (vendorReviewsCount) vendorReviewsCount.textContent = reviewCount;

        // 5. Load category-specific data (if table exists for that category)
        let categoryData = null;
        const tbl = getCategoryTableName(vendor.category);
        if (tbl) {
          // Try both vendor_id and vendor_user_id as the category tables might use different field names
          let { data: catData, error: catError } = await supabase
            .from(tbl)
            .select('*')
            .eq('vendor_user_id', vendorUserId)
            .single();
          
          // If that fails, try with vendor_id
          if (catError) {
            console.log(`Trying with vendor_id for ${tbl}:`, catError.message);
            const { data: altCatData, error: altCatError } = await supabase
              .from(tbl)
              .select('*')
              .eq('vendor_id', vendorUserId)
              .single();
            
            if (!altCatError) {
              catData = altCatData;
              catError = null;
            } else {
              console.log(`Both vendor_user_id and vendor_id failed for ${tbl}:`, altCatError.message);
            }
          }
          
          if (!catError) {
            categoryData = catData;
          }
          
          // Debug log for specialty data fetch
          console.log('[Category Data Fetch]', {
            category: vendor.category,
            tbl: tbl || null,
            vendorUserId: vendorUserId || null,
            catData: catData || null,
            catError: catError || null
          });
          
          // Store debug info for printing on page
          var venueDataFetchDebug = {
            category: vendor.category,
            tbl: tbl || null,
            vendorUserId: vendorUserId || null,
            catData: catData || null,
            catError: catError || null
          };
        }
        if (categoryData) {
          categorySpecificSection.innerHTML = generateCategorySpecificHTML(vendor.category, categoryData);
        } else if (tbl) {
          // Show a message when category table exists but no data found
          const categoryTitle = vendor.category ? vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1).toLowerCase() : 'Vendor';
          categorySpecificSection.innerHTML = `
            <div class="vendor-section text-center p-4" style="background:#f8fbff;border-radius:1.5rem;box-shadow:0 2px 8px rgba(44,62,80,0.07);">
              <div class="mb-3">
                <span style="font-size:2rem;color:#2196f3;"><i class="bi bi-info-circle-fill"></i></span>
              </div>
              <h3 class="vendor-section-title mb-3" style="color:#1976d2;font-weight:800;font-size:1.5rem;">
                ${categoryTitle} Details
              </h3>
              <div class="alert alert-info p-3" style="background:#e3f6fd;color:#1976d2;font-size:1.13rem;border-radius:1rem;">
                <i class="bi bi-info-circle me-2"></i>
                No specific ${categoryTitle.toLowerCase()} details have been added yet.<br />
                This vendor may still be setting up their profile.
              </div>
            </div>`;
        } else {
          categorySpecificSection.innerHTML = '';
        }

        // Debug info removed for production - only log to console
        console.log('[Vendor Debug]', {
          vendorId: vendor.user_id,
          category: vendor.category,
          vendorData: vendor,
          categoryData: categoryData
        });

        // 6. Build social links (instagram, facebook, tiktok)
        let socialHtml = '';
        ['instagram', 'facebook', 'tiktok'].forEach(platform => {
          const url = vendor[platform];
          if (url) {
            const iconClass = platform === 'tiktok' ? 'bi-tiktok' : `bi-${platform}`;
            const btnClass = platform === 'facebook' ? 'btn-outline-primary' : 'btn-outline-dark';
            socialHtml += `
              <a href="${url}" class="btn ${btnClass} me-2 mb-2" target="_blank" rel="noopener">
                <i class="bi ${iconClass}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>`;
          }
        });
        vendorSocialLinks.innerHTML = socialHtml || '<p>No social links provided</p>';

        // 7. Render portfolio images safely
        if (images && Array.isArray(images) && images.length > 0) {
          let portfolioHtml = '';
          images.forEach((img, index) => {
            const imageUrl = img.image_url || img.url || img.src || 'https://via.placeholder.com/600x400?text=Portfolio+Image';
            const captionHtml = img.caption
              ? `<div class="portfolio-caption">${img.caption}</div>`
              : '';
            portfolioHtml += `
              <div class="portfolio-item" onclick="openPortfolioModal('${imageUrl}', '${img.caption || ''}')">
                <img src="${imageUrl}" alt="${img.caption || 'Portfolio image'}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Found'" />
                ${captionHtml}
              </div>`;
          });
          vendorPortfolio.innerHTML = portfolioHtml;
        } else {
          vendorPortfolio.innerHTML = `
            <div class="text-center py-4">
              <i class="bi bi-images text-muted" style="font-size: 3rem;"></i>
              <p class="text-muted mt-2">No portfolio images available yet.</p>
              <small class="text-muted">This vendor hasn't uploaded any portfolio images.</small>
            </div>`;
        }

        // 8. Load existing reviews and set up the review form
        await loadReviews(vendorUserId);
        reviewForm.onsubmit = async e => {
          e.preventDefault();
          const { data: { user }, error: authErr } = await supabase.auth.getUser();
          if (authErr || !user) {
            return alert('You must be signed in to leave a review.');
          }
          
          // Check if the current user is the vendor (prevent self-reviewing)
          if (user.id === vendorUserId) {
            return alert('You cannot review your own vendor profile.');
          }
          
          const ratingVal = parseInt(reviewRating.value, 10);
          const contentVal = reviewContent.value.trim();
          
          // Check if user has already reviewed this vendor
          const { data: existingReview, error: checkError } = await supabase
            .from('reviews')
            .select('id')
            .eq('vendor_id', vendorUserId)
            .eq('reviewer_user_id', user.id)
            .single();
            
          if (existingReview) {
            return alert('You have already reviewed this vendor. You can only leave one review per vendor.');
          }
          
          const { error: insertErr } = await supabase
            .from('reviews')
            .insert([{
              vendor_id: vendorUserId,
              reviewer_user_id: user.id,
              rating: ratingVal,
              content: contentVal
            }]);
          if (insertErr) {
            console.error('Insert error:', insertErr);
            return alert('Failed to submit review.');
          }
          reviewForm.reset();
          await loadReviews(vendorUserId);
        };

        // In showVendorDetail, replace any top-level await code for portfolio and calendar with:
        (async () => {
          // Fetch and display portfolio images from vendor_portfolios table
          const { data: images, error: portfolioError } = await supabase
            .from('vendor_portfolios')
            .select('file_url, caption')
            .eq('vendor_id', vendorUserId);
          let portfolioHtml = '<div class="portfolio-grid">';
          (images||[]).forEach(img => {
            portfolioHtml += `
              <div class="portfolio-item">
                <img src="${img.file_url}" class="img-fluid" alt="${img.caption || 'Portfolio image'}" />
                ${img.caption ? `<div class="portfolio-caption">${img.caption}</div>` : ''}
              </div>
            `;
          });
          portfolioHtml += '</div>';
          document.getElementById('vendorPortfolio').innerHTML = portfolioHtml;

          // Render the vendor calendar
          await renderVendorCalendar(vendorUserId);
        })();

        // --- BEGIN: Specialty Info UI Section ---
        // Remove any previous specialty info blocks
        const oldSpecialty = detailView.querySelector('.vendor-specialty-info');
        if (oldSpecialty) oldSpecialty.remove();
        // Also remove any old debug info blocks
        const oldDebug = detailView.querySelector('.vendor-debug-info');
        if (oldDebug) oldDebug.remove();
        // Insert a modern Vendor Details section with specialty info
        if (tbl && categoryData) {
          // Define aboutSection before using it
          const aboutSection = detailView.querySelector('.vendor-section');
          // Remove all previous specialty info blocks to prevent duplicates
          detailView.querySelectorAll('.category-details').forEach(el => {
            if (el.parentElement && el.parentElement !== aboutSection) {
              el.parentElement.remove();
            }
          });
          detailView.querySelectorAll('.vendor-section-title').forEach(el => {
            if (el.textContent?.toLowerCase().includes(vendor.category.toLowerCase() + ' details') && el.parentElement && el.parentElement !== aboutSection) {
              el.parentElement.remove();
            }
          });
          // Insert after the main vendor-section (About)
          if (aboutSection) {
            aboutSection.insertAdjacentHTML('afterend', generateCategorySpecificHTML(vendor.category, categoryData));
          }
        }
        // --- END: Specialty Info UI Section ---

        // 0. Check if current user is the vendor
        let showPortfolioUpload = false;
        let currentUserId = null;
        if (window.supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          currentUserId = session && session.user && session.user.id;
        }
        if (currentUserId && currentUserId === vendor.user_id) {
          showPortfolioUpload = true;
        }
        const uploadSection = document.getElementById('portfolioUploadSection');
        if (uploadSection) {
          uploadSection.style.display = showPortfolioUpload ? '' : 'none';
          console.debug('[Portfolio Upload UI]', { currentUserId, vendorUserId: vendor.user_id, showPortfolioUpload });
        }
        
        // Hide review form if current user is the vendor
        const reviewSection = document.querySelector('.vendor-section:has(#reviewForm)');
        if (reviewSection && currentUserId === vendor.user_id) {
          reviewSection.style.display = 'none';
        }

      } catch (err) {
        console.error('Error loading vendor details:', err);
        detailView.innerHTML = `
          <div class="container text-center py-5">
            <i class="bi bi-exclamation-triangle-fill text-danger display-4 mb-3"></i>
            <h2>Error Loading Vendor</h2>
            <p class="lead">We couldn't load the vendor details. Please try again later.</p>
            <a href="index.html" class="btn btn-primary mt-3">
              <i class="bi bi-arrow-left me-2"></i>Back to Vendor List
            </a>
          </div>`;
      }
    }

    async function loadReviews(vendorUserId) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', vendorUserId)
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error loading reviews:', error)
        vendorReviews.innerHTML = '<p class="text-muted">Could not load reviews.</p>'
        return
      }
      if (!data.length) {
        vendorReviews.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review!</p>'
        return
      }
      vendorReviews.innerHTML = data.map(r => `
        <div class="vendor-review-card mb-4 p-3 rounded shadow-sm bg-white border-0">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-primary">${r.reviewer_name || 'Anonymous'}</span>
              <span class="review-stars">${'<i class="bi bi-star-fill text-warning"></i>'.repeat(r.rating)}</span>
          </div>
            <span class="review-date text-muted small">${new Date(r.created_at).toLocaleDateString()}</span>
          </div>
          <div class="review-content">${r.content}</div>
        </div>
      `).join('')
    }

    function getCategoryTableName(category) {
      if (!category) return null;
      const map = {
        'dj':           'dj_data',
        'caterer':      'caterer_data',
        'venue':        'venue_data',
        'decorator':    'decorator_data',
        'photographer': 'photographer_data',
        'videographer':'videographer_data',
        'florist':      'florist_data',
        'baker':        'baker_data',
        'bouncer':      'bouncer_data',
        'vehicle rental':'vehicle_rental_data'
      };
      return map[category.toLowerCase()] || null;
    }

    function getCategoryBadgeClass(category) {
      const map = {
        'DJ':            'dj-badge',
        'Caterer':       'caterer-badge',
        'Venue':         'venue-badge',
        'Decorator':     'decorator-badge',
        'Photographer':  'photographer-badge',
        'Videographer':  'videographer-badge',
        'Florist':       'florist-badge',
        'Baker':         'baker-badge',
        'Bouncer':       'bouncer-badge',
        'Vehicle Rental':'vehicle-badge'
      }
      return map[category] || ''
    }

    function generateCategorySpecificHTML(category, data) {
      let html = `
        <div class="vendor-section">
          <h3 class="vendor-section-title">
            <i class="bi ${getCategoryIcon(category)}"></i>${category} Details
          </h3>
          <div class="category-details row g-4">`;
      
      // Render all fields from the specialty data in a modern grid
      Object.entries(data).forEach(([key, value]) => {
        if (key.toLowerCase() === 'vendor_id' || key.toLowerCase() === 'vendor_user_id') return; // Skip ID fields
        
        const icon = getFieldIcon(key, category);
        const displayName = formatFieldName(key);
        const displayValue = formatFieldValue(value, key);
        
        html += `
          <div class='col-md-6'>
            <div class='d-flex align-items-start mb-3'>
              <i class='bi ${icon} text-primary me-3 fs-4'></i>
              <div>
                <div class='fw-bold text-capitalize' style='font-size:1.08rem;'>${displayName}</div>
                <div class='text-muted' style='font-size:1.05rem;'>${displayValue}</div>
              </div>
            </div>
          </div>
        `;
      });
      
      html += '</div></div>';
      return html;
    }

    function getCategoryIcon(category) {
      const iconMap = {
        'DJ': 'bi-music-note-beamed',
        'Caterer': 'bi-basket',
        'Venue': 'bi-building',
        'Decorator': 'bi-palette',
        'Photographer': 'bi-camera',
        'Videographer': 'bi-camera-video',
        'Florist': 'bi-flower1',
        'Baker': 'bi-cake2',
        'Bouncer': 'bi-shield-check',
        'Vehicle Rental': 'bi-car-front'
      };
      return iconMap[category] || 'bi-info-circle';
    }

    function getFieldIcon(fieldName, category) {
      const field = fieldName.toLowerCase();
      
      // General field icons
      if (field.includes('capacity')) return 'bi-people-fill';
      if (field.includes('amenities')) return 'bi-list-check';
      if (field.includes('parking')) return 'bi-car-front-fill';
      if (field.includes('address')) return 'bi-geo-alt-fill';
      if (field.includes('sound')) return 'bi-music-note-beamed';
      if (field.includes('accessible')) return 'bi-universal-access';
      if (field.includes('backup')) return 'bi-lightning-fill';
      if (field.includes('outside_catering')) return 'bi-basket';
      if (field.includes('genres')) return 'bi-music-note-list';
      if (field.includes('equipment')) return 'bi-gear';
      if (field.includes('mc')) return 'bi-mic';
      if (field.includes('playtime')) return 'bi-clock';
      if (field.includes('cuisines')) return 'bi-egg-fried';
      if (field.includes('service_type')) return 'bi-truck';
      if (field.includes('tasting')) return 'bi-cup-hot';
      if (field.includes('dietary')) return 'bi-heart';
      if (field.includes('styles')) return 'bi-palette2';
      if (field.includes('second_shooter')) return 'bi-person-plus';
      if (field.includes('prewedding')) return 'bi-heart-fill';
      if (field.includes('delivery_time')) return 'bi-calendar-check';
      
      // Category-specific icons
      if (category === 'DJ' && field.includes('genres')) return 'bi-music-note-list';
      if (category === 'Caterer' && field.includes('cuisines')) return 'bi-egg-fried';
      if (category === 'Venue' && field.includes('capacity')) return 'bi-people-fill';
      if (category === 'Photographer' && field.includes('styles')) return 'bi-palette2';
      
      return 'bi-dot';
    }

    function formatFieldName(fieldName) {
      return fieldName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }

    function formatFieldValue(value, fieldName) {
      if (!value || value === 'null' || value === 'undefined') {
        return 'Not specified';
      }
      
      const field = fieldName.toLowerCase();
      
      // Handle boolean values
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      
      // Handle arrays (like genres, cuisines, etc.)
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Handle specific field formatting
      if (field.includes('capacity') && typeof value === 'string') {
        return value.includes('people') ? value : `${value} people`;
      }
      
      if (field.includes('playtime') && typeof value === 'string') {
        return value.includes('hours') ? value : `${value} hours`;
      }
      
      if (field.includes('delivery_time') && typeof value === 'string') {
        return value.includes('days') ? value : `${value} days`;
      }
      
      return value;
    }

    // ─── HERO AD CAROUSEL LOGIC ──────────────────────────────────────────────
    async function loadHeroAds() {
      // Check if we're on a vendor detail page
      const urlParams = new URLSearchParams(window.location.search);
      const vendorUserId = urlParams.get('user_id');
      
      // Don't show hero slider on vendor detail pages
      if (vendorUserId) {
        console.log('Hero slider skipped: On vendor detail page');
        return;
      }
      
      // Since we replaced the hero slider with a static hero section,
      // we'll just log that ads are available but not display them
      const now = new Date().toISOString();
      let { data: ads, error } = await supabase
        .from('vendor_ads')
        .select('*')
        .eq('is_active', true)
        .gt('end_date', now)
        .order('start_date', { ascending: false });
      if (error) {
        console.error('Error loading ads:', error);
        return;
      }
      if (!ads || !ads.length) return;
      
      console.log('Hero ads loaded:', ads.length, 'ads available');
      // Note: Ads are not displayed in the new hero section design
    }

    // 3. Add calendar JS logic at the end of the main script, only run if detailView is shown and vendorUserId is set
    function generateCalendar(vendorUserId) {
      // This function should return the calendar HTML based on vendorUserId
      // You can use a library like FullCalendar or a custom implementation
      // For this example, we'll use a simple calendar grid
      const calendarHtml = `
        <div class="calendar-grid" id="calendar-days"></div>
        <div class="legend mt-3">
          <span><span class="badge booked"></span> Booking</span>
          <span><span class="badge off"></span> Off-Day</span>
          <span><span class="badge today"></span> Today</span>
        </div>
      `;
      return calendarHtml;
    }

    async function renderVendorCalendar(vendorUserId) {
      let offDays = new Set(), bookingDates = [];
      let currentMonth = new Date().getMonth();
      let currentYear  = new Date().getFullYear();

      async function loadOffDays() {
        const { data } = await supabase
          .from('off_days')
          .select('off_date')
          .eq('vendor_id', vendorUserId);
        offDays = new Set((data||[]).map(r => r.off_date));
      }

      async function loadBookings() {
        const start = new Date(currentYear, currentMonth,1).toISOString().split('T')[0];
        const end   = new Date(currentYear, currentMonth+1,0).toISOString().split('T')[0];
        const { data } = await supabase
          .from('bookings')
          .select('event_date')
          .eq('vendor_id', vendorUserId)
          .gte('event_date', start)
          .lte('event_date', end);
        bookingDates = (data||[]).map(r => new Date(r.event_date).getDate());
      }

      async function refreshCalendar() {
        await loadOffDays();
        await loadBookings();
        console.debug('[Calendar] Off days:', Array.from(offDays));
        console.debug('[Calendar] Booked days:', bookingDates);
        renderCalendar();
      }

      function renderCalendar() {
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
        const firstDay    = new Date(currentYear, currentMonth,1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth+1,0).getDate();
        const prevDays    = new Date(currentYear, currentMonth,0).getDate();
        let html = '';
        ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
          html += `<div class=\"calendar-day-header\">${d}</div>`;
        });
        for(let i=firstDay-1; i>=0; i--){
          html += `<div class=\"calendar-day other-month\">${prevDays-i}</div>`;
        }
        const today = new Date();
        for(let d=1; d<=daysInMonth; d++){
          const iso = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isToday = d===today.getDate() && currentMonth===today.getMonth() && currentYear===today.getFullYear();
          const isOff   = offDays.has(iso);
          const isBooked= bookingDates.includes(d);
          let cls = 'calendar-day';
          if (isToday) cls += ' today';
          if (isBooked) cls += ' booked';
          if (isOff)    cls += ' off-day';
          html += `<div class=\"${cls}\" data-date=\"${iso}\">${d}</div>`;
        }
        const total = firstDay + daysInMonth;
        const rem   = total<=35 ? 35-total : 42-total;
        for(let i=1; i<=rem; i++){
          html += `<div class=\"calendar-day other-month\">${i}</div>`;
        }
        const grid = document.getElementById('calendar-days');
        grid.innerHTML = html;
        // Only allow editing if current user is the vendor
        supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
          const isVendor = currentUser && currentUser.id === vendorUserId;
          console.debug('[Calendar] Rendered for vendor:', vendorUserId, 'Current user:', currentUser?.id, 'Editing enabled:', isVendor);
          grid.querySelectorAll('.calendar-day:not(.other-month)').forEach(cell => {
            if (isVendor) {
              cell.onclick = async () => {
                const date = cell.dataset.date;
                if (cell.classList.contains('off-day')) {
                  await supabase
                    .from('off_days')
                    .delete()
                    .eq('vendor_id', vendorUserId)
                    .eq('off_date', date);
                  offDays.delete(date);
                } else {
                  await supabase
                    .from('off_days')
                    .insert({ vendor_id: vendorUserId, off_date: date });
                  offDays.add(date);
                }
                cell.classList.toggle('off-day');
              };
              cell.style.cursor = 'pointer';
            } else {
              cell.onclick = null;
              cell.style.cursor = 'default';
            }
          });
        });
      }

      document.getElementById('prev-month').onclick = () => {
        currentMonth--; if (currentMonth<0){ currentMonth=11; currentYear--; }
        refreshCalendar();
      };
      document.getElementById('next-month').onclick = () => {
        currentMonth++; if (currentMonth>11){ currentMonth=0; currentYear++; }
        refreshCalendar();
      };
      await refreshCalendar();
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        document.getElementById('loginNavItem').style.display = 'none';
        document.getElementById('logoutNavItem').style.display = '';
      } else {
        document.getElementById('loginNavItem').style.display = '';
        document.getElementById('logoutNavItem').style.display = 'none';
      }
    });
    document.getElementById('logoutBtn').onclick = async function(e) {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    };

    // 1. Add JS logic for save/unsave vendor functionality
    let savedVendors = new Set();

    async function fetchSavedVendors() {
      const userId = (await supabase.auth.getUser()).data.user.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('saved_vendors')
        .eq('id', userId)
        .single();
      if (error) {
        savedVendors = new Set();
        return;
      }
      const saved = (data.saved_vendors || '').split(',').map(s => s.trim()).filter(Boolean);
      savedVendors = new Set(saved);
    }

    function updateSaveButtons() {
      document.querySelectorAll('.save-vendor-btn').forEach(btn => {
        const vendorId = btn.getAttribute('data-vendor-id');
        if (savedVendors.has(vendorId)) {
          btn.classList.add('active');
          btn.querySelector('.bi').classList.remove('bi-bookmark');
          btn.querySelector('.bi').classList.add('bi-bookmark-fill');
          btn.querySelector('.save-label').textContent = 'Saved';
        } else {
          btn.classList.remove('active');
          btn.querySelector('.bi').classList.remove('bi-bookmark-fill');
          btn.querySelector('.bi').classList.add('bi-bookmark');
          btn.querySelector('.save-label').textContent = 'Save';
        }
      });
    }

    document.addEventListener('click', async function(e) {
      if (e.target.closest('.save-vendor-btn')) {
        const btn = e.target.closest('.save-vendor-btn');
        const vendorId = btn.getAttribute('data-vendor-id');
        const userId = (await supabase.auth.getUser()).data.user.id;

        // Fetch current saved_vendors string
        const { data, error } = await supabase
          .from('profiles')
          .select('saved_vendors')
          .eq('id', userId)
          .single();
        let saved = (data?.saved_vendors || '').split(',').map(s => s.trim()).filter(Boolean);

        if (saved.includes(vendorId)) {
          // Unsave
          saved = saved.filter(id => id !== vendorId);
        } else {
          // Save
          saved.push(vendorId);
        }

        // Update in DB
        await supabase
          .from('profiles')
          .update({ saved_vendors: saved.join(',') })
          .eq('id', userId);

        savedVendors = new Set(saved);
        updateSaveButtons();
      }
    });

    // On page load (after login and vendor cards are rendered):
    (async () => {
      await fetchSavedVendors();
      updateSaveButtons();
    })();

    // Navigation function to handle home button
    function goToHome() {
      // Check if we're on a vendor detail page
      const urlParams = new URLSearchParams(window.location.search);
      const vendorUserId = urlParams.get('user_id');
      
      if (vendorUserId) {
        // We're on a vendor detail page, go back to main listing
        window.location.href = 'index.html';
      } else {
        // We're already on the main page, do nothing or refresh
        window.location.reload();
      }
    }

    // Function to go back to vendor listing
    function goBackToListing() {
      // Hide detail view, show listing view
      detailView.classList.add('d-none');
      listingView.classList.remove('d-none');
      
      // Show hero section on main listing view
      const heroSection = document.getElementById('heroSection');
      if (heroSection) heroSection.style.display = '';
      
      // Show hero slider on main listing view
      const heroSlider = document.getElementById('hero-slider');
      if (heroSlider) heroSlider.style.display = '';
      
      // Update URL to remove vendor parameter
      const url = new URL(window.location);
      url.searchParams.delete('user_id');
      window.history.pushState({}, '', url);
    }

    // Uniform Navigation Functions
    function updateNavigationActiveState() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('#navbarNav .nav-link');
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }

    function setupUniformNavigation() {
      // Update active state
      updateNavigationActiveState();
      
      // Handle logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
          } catch (error) {
            console.error('Logout error:', error);
          }
        });
      }
      
      // Setup search functionality
      setupSearchFunctionality();
      
      // Update navigation based on auth state
      updateNavigationAuthState();
    }

    function setupSearchFunctionality() {
      const searchInput = document.getElementById('navbarSearchInput');
      const searchBtn = document.getElementById('navbarSearchBtn');
      const searchInputMobile = document.getElementById('navbarSearchInputMobile');
      const searchBtnMobile = document.getElementById('navbarSearchBtnMobile');
      
      // Setup desktop search
      if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', () => {
          performSearch(searchInput.value.trim());
        });
        
        // Search on Enter key
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
          }
        });
        
        // Real-time search with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            performSearch(e.target.value.trim());
          }, 500); // 500ms delay
        });
      }
      
      // Setup mobile search
      if (searchInputMobile && searchBtnMobile) {
        // Search on button click
        searchBtnMobile.addEventListener('click', () => {
          performSearch(searchInputMobile.value.trim());
        });
        
        // Search on Enter key
        searchInputMobile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            performSearch(searchInputMobile.value.trim());
          }
        });
        
        // Real-time search with debouncing
        let searchTimeoutMobile;
        searchInputMobile.addEventListener('input', (e) => {
          clearTimeout(searchTimeoutMobile);
          searchTimeoutMobile = setTimeout(() => {
            performSearch(e.target.value.trim());
          }, 500); // 500ms delay
        });
      }
      
      // Sync search inputs
      if (searchInput && searchInputMobile) {
        searchInput.addEventListener('input', () => {
          searchInputMobile.value = searchInput.value;
        });
        searchInputMobile.addEventListener('input', () => {
          searchInput.value = searchInputMobile.value;
        });
      }
    }

    function performSearch(searchTerm) {
      // Use the existing loadInitial function to maintain consistency with other filters
      loadInitial();
      
      // Scroll to results if on vendor listing page
      const vendorsContainer = document.getElementById('vendorsContainer');
      if (vendorsContainer) {
        vendorsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    async function updateNavigationAuthState() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const loginNavItem = document.getElementById('loginNavItem');
        const logoutNavItem = document.getElementById('logoutNavItem');
        const vendorDashboardNavItem = document.getElementById('vendorDashboardNavItem');
        const eventPlannerDashboardNavItem = document.getElementById('eventPlannerDashboardNavItem');
        
        if (session && session.user) {
          // User is logged in
          if (loginNavItem) loginNavItem.style.display = 'none';
          if (logoutNavItem) logoutNavItem.style.display = 'block';
          
          // Check if user is a vendor
          const { data: vendorData, error: vendorError } = await supabase
            .from('vendors')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();
          
          if (vendorData && vendorData.user_id) {
            // User is a vendor - show Vendor Dashboard
            if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'block';
            if (eventPlannerDashboardNavItem) eventPlannerDashboardNavItem.style.display = 'none';
          } else {
            // User is not a vendor - show Event Planner Dashboard
            if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'none';
            if (eventPlannerDashboardNavItem) eventPlannerDashboardNavItem.style.display = 'block';
          }
        } else {
          // User is not logged in
          if (loginNavItem) loginNavItem.style.display = 'block';
          if (logoutNavItem) logoutNavItem.style.display = 'none';
          if (vendorDashboardNavItem) vendorDashboardNavItem.style.display = 'none';
          if (eventPlannerDashboardNavItem) eventPlannerDashboardNavItem.style.display = 'none';
        }
      } catch (error) {
        console.error('Auth state check error:', error);
      }
    }

    // Add JS logic for the saved filter button:
    let showOnlySaved = false;
    const savedFilterBtn = document.getElementById('savedFilterBtn');
    savedFilterBtn.addEventListener('click', () => {
      showOnlySaved = !showOnlySaved;
      savedFilterBtn.classList.toggle('active', showOnlySaved);
      loadInitial();
    });

    // Enhance portfolio image click to show modal with large image
    // Add event delegation for dynamically loaded images

    document.addEventListener('DOMContentLoaded', function() {
      const portfolioGrid = document.getElementById('vendorPortfolio');
      if (portfolioGrid) {
        portfolioGrid.addEventListener('click', function(e) {
          const item = e.target.closest('.portfolio-item');
          if (item) {
            const img = item.querySelector('img');
            const imageUrl = img ? img.src : '';
            const caption = item.querySelector('.portfolio-caption')?.textContent || '';
            openPortfolioModal(imageUrl, caption);
          }
        });
      }
    });

    // Redirect to signup if certain error codes are present in the URL
    (function() {
      const url = window.location.href;
      if (
        url.includes('error=access_denied') ||
        url.includes('error_code=otp_expired') ||
        url.includes('error=not_a_vendor')
      ) {
        window.location.href = 'signup.html';
      }
    })();

    // Check user authentication on page load
    (async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          // Don't redirect immediately, just show login option in nav
          console.log('User not authenticated');
          return;
        }
        
        // User is authenticated, update nav
        document.getElementById('loginNavItem').style.display = 'none';
        document.getElementById('logoutNavItem').style.display = '';
        
        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.firstName && session.user.user_metadata?.lastName ? 
                `${session.user.user_metadata.firstName} ${session.user.user_metadata.lastName}` : 
                session.user.user_metadata?.full_name || 'User',
              user_type: 'event_planner'
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    })();

    // Check if we're on a vendor detail page and hide hero slider
    (function checkVendorDetailPage() {
      const urlParams = new URLSearchParams(window.location.search);
      const vendorUserId = urlParams.get('user_id');
      
      if (vendorUserId) {
        // We're on a vendor detail page, hide hero slider
        const heroSlider = document.getElementById('hero-slider');
        if (heroSlider) {
          heroSlider.style.display = 'none';
          console.log('Hero slider hidden: On vendor detail page');
        }
      }
    })();

    // Portfolio Upload Logic - Only for Vendor Owner
    document.addEventListener('DOMContentLoaded', async () => {
      console.log('🔍 Portfolio upload script starting...');
      
      const uploadInput = document.getElementById('portfolioUploadInput');
      const uploadPreview = document.getElementById('portfolioUploadPreview');
      const uploadBtn = document.getElementById('portfolioUploadBtn');
      const portfolioUploadSection = document.getElementById('portfolioUploadSection');
      
      console.log('📋 Portfolio elements found:', {
        uploadInput: !!uploadInput,
        uploadPreview: !!uploadPreview,
        uploadBtn: !!uploadBtn,
        portfolioUploadSection: !!portfolioUploadSection
      });
      
      let selectedFiles = [];

      // Check if current user is the vendor owner
      const urlParams = new URLSearchParams(window.location.search);
      const vendorUserId = urlParams.get('user_id');
      let currentUserId = null;
      
      console.log('🔍 Vendor user ID from URL:', vendorUserId);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        currentUserId = session && session.user && session.user.id;
        console.log('👤 Current user ID:', currentUserId);
      } catch (error) {
        console.error('❌ Auth check error:', error);
      }

      // Only show upload section if user is the vendor owner
      if (portfolioUploadSection) {
        if (currentUserId && currentUserId === vendorUserId) {
          portfolioUploadSection.style.display = 'block';
          console.log('✅ Portfolio upload enabled: User is vendor owner');
        } else {
          portfolioUploadSection.style.display = 'none';
          console.log('❌ Portfolio upload disabled: User is not vendor owner');
        }
      } else {
        console.log('❌ Portfolio upload section not found!');
      }

      if (uploadInput && uploadPreview && uploadBtn) {
        uploadInput.addEventListener('change', () => {
          uploadPreview.innerHTML = '';
          selectedFiles = Array.from(uploadInput.files);
          selectedFiles.forEach((file, idx) => {
            const url = URL.createObjectURL(file);
            const isVideo = file.type.startsWith('video');
            const wrapper = document.createElement('div');
            wrapper.className = 'd-flex align-items-start mb-2';
            wrapper.style.gap = '0.5rem';
            const thumbDiv = document.createElement('div');
            thumbDiv.style.position = 'relative';
            if (isVideo) {
              const vid = document.createElement('video');
              vid.src = url;
              vid.muted = true;
              vid.playsInline = true;
              vid.style.width = '80px';
              vid.style.height = '80px';
              vid.style.objectFit = 'cover';
              vid.style.borderRadius = '5px';
              thumbDiv.appendChild(vid);
            } else {
              const img = document.createElement('img');
              img.src = url;
              img.style.width = '80px';
              img.style.height = '80px';
              img.style.objectFit = 'cover';
              img.style.borderRadius = '5px';
              thumbDiv.appendChild(img);
            }
            const captionTextarea = document.createElement('textarea');
            captionTextarea.className = 'form-control form-control-sm';
            captionTextarea.placeholder = 'Caption for this file…';
            captionTextarea.rows = 2;
            captionTextarea.style.width = 'calc(100% - 92px)';
            captionTextarea.dataset.fileIndex = idx;
            wrapper.appendChild(thumbDiv);
            wrapper.appendChild(captionTextarea);
            uploadPreview.appendChild(wrapper);
          });
        });

        uploadBtn.addEventListener('click', async () => {
          console.log('🔘 Portfolio upload button clicked');
          
          // Double-check authentication before upload
          if (!currentUserId || currentUserId !== vendorUserId) {
            console.log('❌ Upload blocked: User not authorized');
            alert('You are not authorized to upload images to this vendor profile.');
            return;
          }
          
          console.log('✅ User authorized for upload');
          
          if (!selectedFiles.length) {
            console.log('❌ No files selected');
            alert('Please select at least one file.');
            return;
          }
          
          console.log('📁 Files selected:', selectedFiles.length);
          
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Uploading…';
          
          let errorOccurred = false;
          
          for (let idx = 0; idx < selectedFiles.length; idx++) {
            const file = selectedFiles[idx];
            console.log(`📤 Uploading file ${idx + 1}/${selectedFiles.length}:`, file.name);
            
            const captionEl = uploadPreview.querySelector(`textarea[data-file-index="${idx}"]`);
            const caption = captionEl ? captionEl.value.trim() : '';
            
            // Build a unique path
            const ext = file.name.split('.').pop();
            const filePath = `vendor-portfolios/${vendorUserId}/${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
            
            console.log('📁 File path:', filePath);
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadErr } = await supabase.storage.from('vendor-portfolios').upload(filePath, file, { upsert: false });
            
            if (uploadErr) {
              console.error('❌ Upload error:', uploadErr);
              alert('Error uploading file: ' + uploadErr.message);
              errorOccurred = true;
              break;
            }
            
            console.log('✅ File uploaded to storage');
            
            // Get public URL
            const { data: publicUrlData } = supabase.storage.from('vendor-portfolios').getPublicUrl(filePath);
            const fileUrl = publicUrlData.publicUrl;
            
            console.log('🔗 Public URL:', fileUrl);
            
            // Insert into vendor_portfolios table
            const { error: insertErr } = await supabase.from('vendor_portfolios').insert({
              vendor_id: vendorUserId,
              file_url: fileUrl,
              file_path: filePath,
              mime_type: file.type, // Add the MIME type
              caption: caption
            });
            
            if (insertErr) {
              console.error('❌ Database insert error:', insertErr);
              alert('Error saving portfolio record: ' + insertErr.message);
              errorOccurred = true;
              break;
            }
            
            console.log('✅ Portfolio record saved to database');
          }
          
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = 'Upload';
          
          if (!errorOccurred) {
            console.log('✅ All files uploaded successfully');
            uploadInput.value = '';
            uploadPreview.innerHTML = '';
            selectedFiles = [];
            // Refresh portfolio grid
            showVendorDetail(vendorUserId);
            alert('Portfolio uploaded successfully!');
          } else {
            console.log('❌ Upload failed');
          }
        });
      }
    });

    // Add click handlers for message buttons
    document.addEventListener('click', async function(e) {
      if (e.target.closest('a[href*="messages.html"]')) {
        e.preventDefault();
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          alert('Please sign in to message vendors.');
          window.location.href = 'login.html';
          return;
        }
        
        // Get the vendor ID from the href
        const href = e.target.closest('a[href*="messages.html"]').getAttribute('href');
        const urlParams = new URLSearchParams(href.split('?')[1]);
        const vendorId = urlParams.get('vendorId');
        
        if (vendorId) {
          window.location.href = `messages.html?vendorId=${vendorId}`;
        } else {
          window.location.href = 'messages.html';
        }
      }
    });

    // Add JS for clear filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        if (categorySelect) categorySelect.value = '';
        if (locationSelect) locationSelect.value = '';
        if (priceRangeSelect) priceRangeSelect.value = '';
        loadInitial();
      });
    }

    // JS: Shortlist heart toggle (for logged-in users)
    document.querySelectorAll('.shortlist-heart').forEach(heart => {
      heart.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        // Optionally, update shortlist in DB for logged-in users
      });
    });

    // After renderVendors, add click event listeners for vendor card links
    function addVendorCardClickHandlers() {
      document.querySelectorAll('.vendor-card-link').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const url = new URL(link.href, window.location.origin);
          const userId = url.searchParams.get('user_id');
          if (userId) showVendorDetail(userId);
        });
      });
    }

    // Hero slider functions removed - replaced with static hero section
    // Device type detection (kept for potential future use)
    function getDeviceType() {
      const width = window.innerWidth;
      if (width < 600) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }