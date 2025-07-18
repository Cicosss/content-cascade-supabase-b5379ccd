// Servizio di fallback con OpenStreetMap per quando Google Maps fallisce
import { devLog } from '@/utils/devLogger';

interface FallbackMapConfig {
  center: { lat: number; lng: number };
  zoom: number;
}

interface OpenStreetMapResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: string;
}

export class FallbackMapService {
  private static instance: FallbackMapService;
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 300000; // 5 minuti

  static getInstance(): FallbackMapService {
    if (!FallbackMapService.instance) {
      FallbackMapService.instance = new FallbackMapService();
    }
    return FallbackMapService.instance;
  }

  private getCacheKey(query: string): string {
    return `osm_${query.toLowerCase().replace(/\s+/g, '_')}`;
  }

  private isValidCache(cacheEntry: any): boolean {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < this.CACHE_DURATION;
  }

  async geocodeWithOpenStreetMap(address: string): Promise<any> {
    const cacheKey = this.getCacheKey(address);
    const cached = this.cache.get(cacheKey);
    
    if (this.isValidCache(cached)) {
      devLog.info('🗺️ Using cached OpenStreetMap result');
      return cached.data;
    }

    try {
      devLog.info('🗺️ Falling back to OpenStreetMap for geocoding');
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MiaRomagna/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`OpenStreetMap request failed: ${response.status}`);
      }

      const data: OpenStreetMapResult[] = await response.json();
      
      if (data.length === 0) {
        throw new Error('No results found');
      }

      const result = {
        results: data.map(item => ({
          formatted_address: item.display_name,
          geometry: {
            location: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }
          },
          place_id: item.place_id
        })),
        status: 'OK'
      };

      // Cache del risultato
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      devLog.error('❌ OpenStreetMap fallback failed:', error);
      throw error;
    }
  }

  createSimpleMap(container: HTMLElement, config: FallbackMapConfig): any {
    devLog.info('🗺️ Creating simple map fallback');
    
    // Crea una mappa semplice con HTML/CSS quando le API esterne falliscono
    container.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        "></div>
        <div style="
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 300px;
          z-index: 1;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
            font-size: 24px;
          ">📍</div>
          <h3 style="
            margin: 0 0 8px;
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
          ">Mappa non disponibile</h3>
          <p style="
            margin: 0 0 16px;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
          ">Le mappe sono temporaneamente non disponibili. Stiamo lavorando per ripristinare il servizio.</p>
          <button onclick="window.location.reload()" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
          " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Riprova
          </button>
        </div>
      </div>
    `;

    return {
      setCenter: (center: { lat: number; lng: number }) => {
        devLog.info('📍 Fallback map setCenter called:', center);
      },
      setZoom: (zoom: number) => {
        devLog.info('🔍 Fallback map setZoom called:', zoom);
      },
      addMarker: (position: { lat: number; lng: number }, title?: string) => {
        devLog.info('📌 Fallback map addMarker called:', { position, title });
      }
    };
  }

  clearCache(): void {
    this.cache.clear();
    devLog.info('🗑️ Fallback map cache cleared');
  }
}

export const fallbackMapService = FallbackMapService.getInstance();