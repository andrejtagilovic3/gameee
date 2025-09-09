// API Manager for backend communication
class APIManager {
    constructor() {
        this.baseURL = 'https://gammme-ckakeeeee.vercel.app/server/';
        this.isOnline = navigator.onLine;
        
        // Get Telegram user data
        this.tgUser = Telegram.WebApp.initDataUnsafe?.user;
        this.userId = this.tgUser?.id || Math.random().toString(36).substr(2, 9);
        this.authToken = null;
    }
    
    // Initialize connection and authenticate
    async init() {
        try {
            await this.authenticate();
            console.log('API initialized successfully');
        } catch (error) {
            console.error('API initialization failed:', error);
        }
    }
    
    // Authenticate user
    async authenticate() {
        try {
            const response = await this.makeRequest('POST', 'api/auth', {
                userId: this.userId,
                userData: this.tgUser,
                timestamp: Date.now()
            });
            
            this.authToken = response.token;
            return response;
        } catch (error) {
            console.error('Authentication failed:', error);
            throw error;
        }
    }
    
    // Generic request method
    async makeRequest(method, endpoint, data = null, retry = true) {
        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            if (this.authToken) {
                config.headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            if (!response.ok) {
                if (response.status === 401 && retry) {
                    // Token expired, re-authenticate
                    await this.authenticate();
                    return this.makeRequest(method, endpoint, data, false);
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // User-related API calls
    async getUserProfile() {
        return this.makeRequest('GET', `/users/${this.userId}`);
    }
    
    async updateUserProfile(profileData) {
        return this.makeRequest('PUT', `/users/${this.userId}`, profileData);
    }
    
    async getUserStats() {
        return this.makeRequest('GET', `/users/${this.userId}/stats`);
    }
    
    // Battle-related API calls
    async findOpponent(nftData) {
        return this.makeRequest('POST', '/battle/find', {
            userId: this.userId,
            nft: nftData
        });
    }
    
    async submitBattleResult(battleData) {
        return this.makeRequest('POST', '/battle/result', {
            userId: this.userId,
            ...battleData
        });
    }
    
    async getBattleHistory(limit = 20) {
        return this.makeRequest('GET', `/users/${this.userId}/battles?limit=${limit}`);
    }
    
    // NFT-related API calls
    async getUserCollection() {
        return this.makeRequest('GET', `/users/${this.userId}/collection`);
    }
    
    async buyNFT(nftId, price) {
        return this.makeRequest('POST', '/nft/buy', {
            userId: this.userId,
            nftId,
            price
        });
    }
    
    async sellNFT(nftId, price) {
        return this.makeRequest('POST', '/nft/sell', {
            userId: this.userId,
            nftId,
            price
        });
    }
    
    // Shop-related API calls
    async getShopItems() {
        return this.makeRequest('GET', '/shop/items');
    }
    
    async purchaseStars(amount, paymentData) {
        return this.makeRequest('POST', '/shop/stars', {
            userId: this.userId,
            amount,
            paymentData
        });
    }
    
    // Leaderboard API calls
    async getLeaderboard(type = 'stars', limit = 100) {
        return this.makeRequest('GET', `/leaderboard/${type}?limit=${limit}`);
    }
    
    // Social features
    async getFriends() {
        return this.makeRequest('GET', `/users/${this.userId}/friends`);
    }
    
    async inviteFriend(friendData) {
        return this.makeRequest('POST', '/social/invite', {
            userId: this.userId,
            friendData
        });
    }
    
    // Sync game data with server
    async syncGameData(localData) {
        return this.makeRequest('POST', '/sync', {
            userId: this.userId,
            data: localData,
            timestamp: Date.now()
        });
    }
    
    // Check server status
    async ping() {
        try {
            const response = await fetch(`${this.baseURL}/ping`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Offline Queue Manager for API calls
class OfflineAPIQueue {
    constructor() {
        this.queue = JSON.parse(localStorage.getItem('apiQueue') || '[]');
        
        // Listen for online event to process queue
        window.addEventListener('online', () => {
            this.processQueue();
        });
    }
    
    // Add API call to queue
    addToQueue(method, endpoint, data) {
        const queueItem = {
            id: Date.now(),
            method,
            endpoint,
            data,
            timestamp: Date.now()
        };
        
        this.queue.push(queueItem);
        localStorage.setItem('apiQueue', JSON.stringify(this.queue));
    }
    
    // Process queued API calls
    async processQueue() {
        if (this.queue.length === 0) return;
        
        console.log(`Processing ${this.queue.length} queued API calls...`);
        
        const processedItems = [];
        
        for (const item of this.queue) {
            try {
                await apiManager.makeRequest(item.method, item.endpoint, item.data);
                processedItems.push(item.id);
            } catch (error) {
                console.error('Failed to process queued item:', item, error);
                // Keep failed items in queue for retry
            }
        }
        
        // Remove successfully processed items
        this.queue = this.queue.filter(item => !processedItems.includes(item.id));
        localStorage.setItem('apiQueue', JSON.stringify(this.queue));
        
        if (processedItems.length > 0) {
            console.log(`Successfully processed ${processedItems.length} queued API calls`);
        }
    }
    
    // Clear queue (use with caution)
    clearQueue() {
        this.queue = [];
        localStorage.removeItem('apiQueue');
    }
}

// Initialize API manager
const apiManager = new APIManager();
const offlineQueue = new OfflineAPIQueue();

// Helper function to make API calls with offline support
async function safeAPICall(method, endpoint, data) {
    try {
        if (navigator.onLine) {
            return await apiManager.makeRequest(method, endpoint, data);
        } else {
            // Add to offline queue
            offlineQueue.addToQueue(method, endpoint, data);
            throw new Error('Offline - queued for later');
        }
    } catch (error) {
        if (!navigator.onLine) {
            offlineQueue.addToQueue(method, endpoint, data);
        }
        throw error;
    }
}
