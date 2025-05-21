// IndexedDB工具类，用于存储和检索音频文件
export class AudioStorage {
  private dbName: string = 'voiceGenDB';
  private storeName: string = 'audioFiles';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  // 初始化数据库
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('无法打开IndexedDB');
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储，使用id作为键
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  // 从URL获取音频文件并存储到IndexedDB
  async storeAudioFromUrl(audioUrl: string, metadata: any = {}): Promise<string> {
    try {
      // 获取音频文件
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('获取音频文件失败');
      }
      
      // 将音频文件转换为Blob
      const audioBlob = await response.blob();
      
      // 生成唯一ID
      const audioId = `audio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // 存储音频文件
      await this.storeAudio(audioId, audioBlob, metadata);
      
      return audioId;
    } catch (error) {
      console.error('存储音频文件失败:', error);
      throw error;
    }
  }
  
  // 直接存储Blob到IndexedDB的公共方法
  async storeAudioBlob(audioBlob: Blob, metadata: any = {}): Promise<string> {
    try {
      // 生成唯一ID
      const audioId = `audio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // 存储音频文件
      await this.storeAudio(audioId, audioBlob, metadata);
      
      return audioId;
    } catch (error) {
      console.error('存储音频文件失败:', error);
      throw error;
    }
  }

  // 存储音频文件到IndexedDB
  private async storeAudio(id: string, audioBlob: Blob, metadata: any = {}): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const audioData = {
        id,
        blob: audioBlob,
        createdAt: new Date(),
        ...metadata
      };
      
      const request = store.put(audioData);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('存储音频失败:', event);
        reject('存储音频失败');
      };
    });
  }

  // 从IndexedDB获取音频文件
  async getAudio(id: string): Promise<{ blob: Blob, metadata: any } | null> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          const { blob, ...metadata } = data;
          resolve({ blob, metadata });
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('获取音频失败:', event);
        reject('获取音频失败');
      };
    });
  }

  // 创建音频URL
  createAudioUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // 列出所有存储的音频
  async listAllAudio(): Promise<Array<{ id: string, metadata: any }>> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const audioFiles = request.result.map(item => {
          const { blob, ...metadata } = item;
          return { id: item.id, metadata };
        });
        
        resolve(audioFiles);
      };
      
      request.onerror = (event) => {
        console.error('获取音频列表失败:', event);
        reject('获取音频列表失败');
      };
    });
  }

  // 删除音频
  async deleteAudio(id: string): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('删除音频失败:', event);
        reject('删除音频失败');
      };
    });
  }
}

// 创建单例实例
let audioStorageInstance: AudioStorage | null = null;

export function getAudioStorage(): AudioStorage {
  if (typeof window === 'undefined') {
    // 服务器端返回一个空对象
    return {} as AudioStorage;
  }
  
  if (!audioStorageInstance) {
    audioStorageInstance = new AudioStorage();
  }
  
  return audioStorageInstance;
}
