// Storage Management
class StorageManager {
    constructor() {
        this.cloudStorage = Telegram.WebApp.CloudStorage;
        this.isOnline = navigator.onLine;
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }
    
    // Get item from storage
    async getItem(key) {
        try {
            // Try cloud storage first if online
            if (this.isOnline) {
                const cloudValue = await this.getCloudItem(key);
                if (cloudValue !== null && cloudValue !== undefined) {
                    return cloudValue;
                }
            }
            
            // Fallback to localStorage
            const localValue = localStorage.getItem(key);
            return localValue;
        } catch (error) {
            console.error('Error getting item:', key, error);
            // Fallback to localStorage
            return localStorage.getItem(key);
        }
    }
    
    // Set item to storage
    async setItem(key, value) {
        try {
            // Always save to localStorage first
            localStorage.setItem(key, value);
            
            // Try to save to cloud if online
            if (this.isOnline) {
                await this.setCloudItem(key, value);
            } else {
                // Mark for later sync
                this.markForSync(key, value);
            }
        } catch (error) {
            console.error('Error setting item:', key, error);
            // At least save locally
            localStorage.setItem(key, value);
        }
    }
    
    // Cloud storage helpers
    getCloudItem(key) {
        return new Promise((resolve, reject) => {
            this.cloudStorage.getItem(key, (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
        });
    }
    
    setCloudItem(key, value) {
        return new Promise((resolve, reject) => {
            this.cloudStorage.setItem(key, value, (error, success) => {
                if (error || !success) reject(error);
                else resolve();
            });
        });
    }
    
    // Mark data for sync when back online
    markForSync(key, value) {
        const syncData = JSON.parse(localStorage.getItem('_syncQueue') || '{}');
        syncData[key] = value;
        localStorage.setItem('_syncQueue', JSON.stringify(syncData));
    }
    
    // Sync offline data when back online
    async syncOfflineData() {
        try {
            const syncQueue = JSON.parse(localStorage.getItem('_syncQueue') || '{}');
            
            for (const [key, value] of Object.entries(syncQueue)) {
                await this.setCloudItem(key, value);
            }
            
            // Clear sync queue after successful sync
            localStorage.removeItem('_syncQueue');
            console.log('Offline data synced successfully');
        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    }
}

// Game Data Manager
class GameDataManager {
    constructor() {
        this.storage = new StorageManager();
        this.data = {
            stars: CONFIG.INITIAL_STARS,
            collection: [],
            activeBattleNft: null,
            totalStarsEarned: 0,
            battleHistory: [],
            userProfile: {
                name: 'Игрок',
                avatar: '👤',
                level: 1,
                joinDate: new Date().toISOString()
            }
        };
    }
    
    // Initialize and load data
    async init() {
        try {
            await this.loadAllData();
            console.log('Game data loaded successfully');
        } catch (error) {
            console.error('Error loading game data:', error);
            // Initialize with default values if loading fails
            await this.saveAllData();
        }
    }
    
    // Load all game data
    async loadAllData() {
        const [stars, collection, activeNft, totalEarned, history, profile] = await Promise.all([
            this.storage.getItem('stars'),
            this.storage.getItem('collection'),
            this.storage.getItem('activeBattleNft'),
            this.storage.getItem('totalStarsEarned'),
            this.storage.getItem('battleHistory'),
            this.storage.getItem('userProfile')
        ]);
        
        this.data.stars = parseInt(stars) || CONFIG.INITIAL_STARS;
        this.data.collection = JSON.parse(collection || '[]');
        this.data.activeBattleNft = JSON.parse(activeNft || 'null');
        this.data.totalStarsEarned = parseInt(totalEarned) || 0;
        this.data.battleHistory = JSON.parse(history || '[]');
        this.data.userProfile = JSON.parse(profile || JSON.stringify(this.data.userProfile));
    }
    
    // Save all game data
    async saveAllData() {
        await Promise.all([
            this.storage.setItem('stars', this.data.stars.toString()),
            this.storage.setItem('collection', JSON.stringify(this.data.collection)),
            this.storage.setItem('activeBattleNft', JSON.stringify(this.data.activeBattleNft)),
            this.storage.setItem('totalStarsEarned', this.data.totalStarsEarned.toString()),
            this.storage.setItem('battleHistory', JSON.stringify(this.data.battleHistory)),
            this.storage.setItem('userProfile', JSON.stringify(this.data.userProfile))
        ]);
    }
    
    // Individual data getters
    getStars() { return this.data.stars; }
    getCollection() { return this.data.collection; }
    getActiveBattleNft() { return this.data.activeBattleNft; }
    getTotalStarsEarned() { return this.data.totalStarsEarned; }
    getBattleHistory() { return this.data.battleHistory; }
    getUserProfile() { return this.data.userProfile; }
    
    // Individual data setters
    async setStars(amount) {
        this.data.stars = amount;
        await this.storage.setItem('stars', amount.toString());
    }
    
    async addStars(amount) {
        this.data.stars += amount;
        this.data.totalStarsEarned += amount;
        await Promise.all([
            this.storage.setItem('stars', this.data.stars.toString()),
            this.storage.setItem('totalStarsEarned', this.data.totalStarsEarned.toString())
        ]);
    }
    
    async spendStars(amount) {
        if (this.data.stars >= amount) {
            this.data.stars -= amount;
            await this.storage.setItem('stars', this.data.stars.toString());
            return true;
        }
        return false;
    }
    
    async addToCollection(nft) {
        this.data.collection.push(nft);
        await this.storage.setItem('collection', JSON.stringify(this.data.collection));
    }
    
    async removeFromCollection(index) {
        const removedNft = this.data.collection.splice(index, 1)[0];
        await this.storage.setItem('collection', JSON.stringify(this.data.collection));
        return removedNft;
    }
    
    async setActiveBattleNft(nft) {
        this.data.activeBattleNft = nft;
        await this.storage.setItem('activeBattleNft', JSON.stringify(nft));
    }
    
    async addBattleRecord(battleResult) {
        this.data.battleHistory.push(battleResult);
        await this.storage.setItem('battleHistory', JSON.stringify(this.data.battleHistory));
    }
    
    async updateUserProfile(profile) {
        this.data.userProfile = { ...this.data.userProfile, ...profile };
        await this.storage.setItem('userProfile', JSON.stringify(this.data.userProfile));
    }
    
    // Export/Import for backup
    exportData() {
        return JSON.stringify(this.data);
    }
    
    async importData(jsonData) {
        try {
            this.data = JSON.parse(jsonData);
            await this.saveAllData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Initialize global storage manager
const gameData = new GameDataManager();