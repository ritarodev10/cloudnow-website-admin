/**
 * Strapi Services API Integration Examples
 * 
 * This file contains example code for integrating the Services collection
 * with the CloudNow website frontend.
 */

// API Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// API Helper Functions
export class ServicesAPI {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${STRAPI_URL}/api`;
    this.headers = {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` })
    };
  }

  /**
   * Get all services with optional filters
   */
  async getServices(filters?: ServiceFilters): Promise<Service[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        queryParams.append('filters[category][$eq]', filters.category);
      }
      if (filters.status && filters.status !== 'all') {
        queryParams.append('filters[status][$eq]', filters.status);
      }
      if (filters.featured !== 'all') {
        queryParams.append('filters[featured][$eq]', filters.featured.toString());
      }
      if (filters.search) {
        queryParams.append('filters[$or][0][title][$containsi]', filters.search);
        queryParams.append('filters[$or][1][description][$containsi]', filters.search);
      }
    }

    // Always populate pageContent and seo
    queryParams.append('populate', '*');
    
    const response = await fetch(`${this.baseUrl}/services?${queryParams}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map(this.transformService);
  }

  /**
   * Get a single service by ID
   */
  async getService(id: string): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/services/${id}?populate=*`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformService(data.data);
  }

  /**
   * Get a service by slug
   */
  async getServiceBySlug(slug: string): Promise<Service> {
    const response = await fetch(
      `${this.baseUrl}/services?filters[slug][$eq]=${slug}&populate=*`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch service by slug: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.data.length === 0) {
      throw new Error(`Service not found: ${slug}`);
    }

    return this.transformService(data.data[0]);
  }

  /**
   * Create a new service
   */
  async createService(serviceData: CreateServiceData): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/services`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        data: {
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          status: serviceData.status || 'draft',
          featured: serviceData.featured || false,
          pageContent: serviceData.pageContent || {
            blocks: [],
            metadata: { version: 1 }
          },
          seo: serviceData.seo
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create service: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformService(data.data);
  }

  /**
   * Update an existing service
   */
  async updateService(id: string, serviceData: UpdateServiceData): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/services/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        data: serviceData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update service: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformService(data.data);
  }

  /**
   * Update only the pageContent of a service
   */
  async updateServicePageContent(id: string, pageContent: PageContent): Promise<Service> {
    return this.updateService(id, { pageContent });
  }

  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/services/${id}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to delete service: ${response.statusText}`);
    }
  }

  /**
   * Publish a service
   */
  async publishService(id: string): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/services/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        data: {
          status: 'active',
          publishedAt: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to publish service: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformService(data.data);
  }

  /**
   * Transform Strapi response to frontend Service format
   */
  private transformService(strapiService: any): Service {
    return {
      id: strapiService.id.toString(),
      title: strapiService.attributes.title,
      slug: strapiService.attributes.slug,
      description: strapiService.attributes.description,
      category: strapiService.attributes.category,
      status: strapiService.attributes.status,
      featured: strapiService.attributes.featured,
      pageContent: strapiService.attributes.pageContent,
      seo: strapiService.attributes.seo,
      createdAt: new Date(strapiService.attributes.createdAt),
      updatedAt: new Date(strapiService.attributes.updatedAt),
      publishedAt: strapiService.attributes.publishedAt 
        ? new Date(strapiService.attributes.publishedAt) 
        : undefined
    };
  }
}

// React Hook for Services API
export function useServicesAPI() {
  const api = new ServicesAPI();

  return {
    getServices: api.getServices.bind(api),
    getService: api.getService.bind(api),
    getServiceBySlug: api.getServiceBySlug.bind(api),
    createService: api.createService.bind(api),
    updateService: api.updateService.bind(api),
    updateServicePageContent: api.updateServicePageContent.bind(api),
    deleteService: api.deleteService.bind(api),
    publishService: api.publishService.bind(api)
  };
}

// Type Definitions
interface ServiceFilters {
  category?: string;
  status?: string;
  featured?: boolean | 'all';
  search?: string;
}

interface CreateServiceData {
  title: string;
  description: string;
  category: string;
  status?: string;
  featured?: boolean;
  pageContent?: PageContent;
  seo?: any;
}

interface UpdateServiceData {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  pageContent?: PageContent;
  seo?: any;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  pageContent?: PageContent;
  seo?: any;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface PageContent {
  blocks: any[];
  metadata: {
    lastEditedAt: string;
    version: number;
  };
}

// Example Usage in React Components
export const ExampleUsage = {
  // Get all active services
  async getAllActiveServices() {
    const api = new ServicesAPI();
    return await api.getServices({ status: 'active' });
  },

  // Get featured services
  async getFeaturedServices() {
    const api = new ServicesAPI();
    return await api.getServices({ featured: true, status: 'active' });
  },

  // Search services
  async searchServices(query: string) {
    const api = new ServicesAPI();
    return await api.getServices({ search: query });
  },

  // Create service with template
  async createServiceFromTemplate(template: any) {
    const api = new ServicesAPI();
    return await api.createService({
      title: template.title,
      description: template.description,
      category: template.category,
      pageContent: template.pageContent
    });
  }
};

// Error Handling Utilities
export class ServiceAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ServiceAPIError';
  }
}

// Validation Utilities
export const ServiceValidation = {
  validatePageContent(pageContent: any): boolean {
    if (!pageContent || typeof pageContent !== 'object') return false;
    if (!Array.isArray(pageContent.blocks)) return false;
    
    return pageContent.blocks.every(block => 
      block.id && block.type && typeof block.props === 'object'
    );
  },

  validateServiceData(data: any): boolean {
    return !!(
      data.title && 
      data.description && 
      data.category &&
      data.title.length >= 3 &&
      data.description.length >= 10
    );
  }
};
