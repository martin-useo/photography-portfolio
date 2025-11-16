(function() {
  'use strict';
  
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }
  
  const SW_PATH = '/service-worker.js';
  const SW_SCOPE = '/';
  
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register(SW_PATH, {
        scope: SW_SCOPE
      });
      
      console.log('✅ Service Worker registered');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Service Worker update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('✨ New Service Worker available');
            showUpdateNotification(registration);
          }
        });
      });
      
      setInterval(() => {
        registration.update();
      }, 3600000); // Check every hour
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
  
  function showUpdateNotification(registration) {
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 350px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="margin-bottom: 10px; font-weight: 600;">
          ✨ Nouvelle version disponible
        </div>
        <div style="margin-bottom: 15px; font-size: 14px; opacity: 0.9;">
          Une mise à jour est disponible. Rafraîchir ?
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.swUpdateHandler.update()" style="
            flex: 1;
            background: white;
            color: black;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
          ">
            Rafraîchir
          </button>
          <button onclick="window.swUpdateHandler.dismiss()" style="
            flex: 1;
            background: transparent;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
          ">
            Plus tard
          </button>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    window.swUpdateHandler = {
      update: () => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      },
      dismiss: () => {
        notification.remove();
      }
    };
  }
  
  function setupOnlineOfflineHandlers() {
    window.addEventListener('online', () => {
      console.log('🌐 Back online');
      showNetworkStatus('Connexion rétablie', true);
    });
    
    window.addEventListener('offline', () => {
      console.log('📡 Offline');
      showNetworkStatus('Mode hors ligne', false);
    });
  }
  
  function showNetworkStatus(message, isOnline) {
    const existingStatus = document.getElementById('network-status');
    if (existingStatus) {
      existingStatus.remove();
    }
    
    const status = document.createElement('div');
    status.id = 'network-status';
    status.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isOnline ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        animation: slideInTop 0.3s ease-out;
      ">
        ${isOnline ? '🌐' : '📡'} ${message}
      </div>
      <style>
        @keyframes slideInTop {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
    `;
    
    document.body.appendChild(status);
    
    setTimeout(() => {
      status.style.animation = 'slideInTop 0.3s ease-out reverse';
      setTimeout(() => status.remove(), 300);
    }, 3000);
  }
  
  window.swCache = {
    clear: async () => {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            console.log('✅ Cache cleared');
            resolve(true);
          }
        };
        
        registration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
    },
    
    getSize: async () => {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          const sizeMB = (event.data.size / 1024 / 1024).toFixed(2);
          console.log(`💾 Cache size: ${sizeMB} MB`);
          resolve(event.data.size);
        };
        
        registration.active.postMessage(
          { type: 'GET_CACHE_SIZE' },
          [messageChannel.port2]
        );
      });
    },
    
    checkForUpdates: async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.update();
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
  } else {
    registerServiceWorker();
  }
  
  setupOnlineOfflineHandlers();
  
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker controller changed');
  });
  
})();
