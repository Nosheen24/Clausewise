import {
  Contract,
  ExtractedField,
  Clause,
  Obligation,
  ContractVersion,
  User,
  Playbook,
  PlaybookRule,
  Approval,
  ReviewItem,
  DashboardStats,
  ContractStatus,
  ConfidenceLevel,
  UserRole,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const ACCESS_TOKEN_KEY = 'clausewise_access_token';
const REFRESH_TOKEN_KEY = 'clausewise_refresh_token';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: Response,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string> | undefined,
    };

    // Add Authorization header if we have an access token and not skipping auth
    if (!skipAuth) {
      const accessToken = getAccessToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        if (retryResponse.ok) {
          if (retryResponse.status === 204 || !retryResponse.headers.get('content-length')) {
            return {} as T;
          }
          return retryResponse.json();
        }
      } else {
        // Refresh failed, clear tokens
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
      let errorMessage = 'Request failed';
      let errorDetails: any = {};

      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        errorDetails = errorData.error?.details || errorData.details || {};
      } catch (parseError) {
        try {
          errorMessage = await response.text();
        } catch (textError) {
          errorMessage = `HTTP ${response.status} ${response.statusText}`;
        }
      }

      const apiError = new ApiError(
        errorMessage,
        response.status,
        response,
        errorDetails
      );
      throw apiError;
    }

    // Handle empty responses
    if (response.status === 204 || !response.headers.get('content-length')) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch (parseError) {
      throw new ApiError(
        'Failed to parse response JSON',
        response.status,
        response
      );
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access && data.refresh) {
          setTokens(data.access, data.refresh);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: any,
    skipAuth = false
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {};

    if (!skipAuth) {
      const accessToken = getAccessToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = await response.text();
      }
      throw new ApiError(errorMessage, response.status, response);
    }

    return response.json();
  }
}

const apiClient = new ApiClient();

export class AuthAPI {
  static async login(email: string, password: string) {
    try {
      return await apiClient.post<{ user: User; tokens: { refresh: string; access: string } }>(
        '/auth/login/',
        { email, password }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed. Please try again.');
    }
  }

  static async register(
    email: string,
    name: string,
    password: string,
    passwordConfirm: string,
    role?: string,
    organizationId?: string
  ) {
    try {
      return await apiClient.post<{ user: User; tokens: { refresh: string; access: string } }>(
        '/auth/register/',
        {
          email,
          name,
          password,
          password_confirm: passwordConfirm,
          ...(role && { role }),
          ...(organizationId && { organization_id: organizationId }),
        }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed. Please try again.');
    }
  }

  static async logout(refreshToken: string) {
    try {
      return await apiClient.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      // Log out locally even if the API call fails
      console.warn('Logout API call failed:', error);
      return { message: 'Logged out locally' };
    }
  }

  static async getProfile() {
    try {
      return await apiClient.get<User>('/auth/profile/');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  }

  static async updateProfile(data: Partial<User>) {
    try {
      return await apiClient.patch<User>('/auth/profile/update/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update profile.');
    }
  }

  static async refreshToken(refreshToken: string) {
    try {
      return await apiClient.post<{ access: string; refresh: string }>(
        '/auth/refresh/',
        { refresh: refreshToken }
      );
    } catch (error) {
      throw new ApiError('Failed to refresh token.');
    }
  }
}

export class ContractsAPI {
  static async getContracts(params?: {
    organization_id?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.organization_id) searchParams.append('organization_id', params.organization_id);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/contracts/${queryString ? '?' + queryString : ''}`;
    return apiClient.get<{ results: Contract[]; count: number }>(endpoint);
  }

  static async getContract(id: string) {
    try {
      return await apiClient.get<Contract>(`/contracts/${id}/`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createContract(data: Partial<Contract>) {
    return apiClient.post<Contract>('/contracts/', data);
  }

  static async updateContract(id: string, data: Partial<Contract>) {
    return apiClient.patch<Contract>(`/contracts/${id}/`, data);
  }

  static async deleteContract(id: string) {
    return apiClient.delete<{ message: string }>(`/contracts/${id}/`);
  }

  static async uploadContractDocument(contractId: string, file: File) {
    return apiClient.upload<{ id: string; fileName: string; fileType: string }>(
      `/contracts/${contractId}/upload/`, file
    );
  }

  static async getContractExtraction(contractId: string) {
    return apiClient.get<ExtractedField[]>(`/contracts/${contractId}/extraction/`);
  }

  static async getContractVersions(contractId: string) {
    return apiClient.get<ContractVersion[]>(`/contracts/${contractId}/versions/`);
  }

  static async getContractClauses(contractId: string) {
    return apiClient.get<Clause[]>(`/contracts/${contractId}/clauses/`);
  }

  static async getContractObligations(contractId: string) {
    return apiClient.get<Obligation[]>(`/contracts/${contractId}/obligations/`);
  }

  static async getContractFieldValues(contractId: string) {
    return apiClient.get<ExtractedField[]>(`/contracts/${contractId}/field-values/`);
  }
}

export class ReviewAPI {
  static async getReviewItems(params?: { contract_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.contract_id) searchParams.append('contract_id', params.contract_id);
    const queryString = searchParams.toString();
    const endpoint = `/review-items/${queryString ? '?' + queryString : ''}`;

    return apiClient.get<{ results: ReviewItem[]; count: number }>(endpoint);
  }

  static async getReviewItem(id: string) {
    return apiClient.get<ReviewItem>(`/review-items/${id}/`);
  }

  static async createReviewItem(data: Partial<ReviewItem>) {
    return apiClient.post<ReviewItem>('/review-items/', data);
  }

  static async updateReviewItem(id: string, data: Partial<ReviewItem>) {
    return apiClient.patch<ReviewItem>(`/review-items/${id}/`, data);
  }

  static async resolveReviewItem(id: string, data: Partial<ReviewItem>) {
    return apiClient.patch<ReviewItem>(`/review-items/${id}/resolve/`, data);
  }

  static async skipReviewItem(id: string) {
    return apiClient.patch<{ message: string }>(`/review-items/${id}/skip/`, {});
  }

  static async getReviewQueue() {
    return apiClient.get<{
      low_confidence: ReviewItem[];
      medium_confidence: ReviewItem[];
    }>('/review-items/queue/');
  }
}

export class ApprovalsAPI {
  static async getApprovals(params?: { contract_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.contract_id) searchParams.append('contract_id', params.contract_id);
    const queryString = searchParams.toString();
    const endpoint = `/approvals/${queryString ? '?' + queryString : ''}`;

    return apiClient.get<{ results: Approval[]; count: number }>(endpoint);
  }

  static async getApproval(id: string) {
    return apiClient.get<Approval>(`/approvals/${id}/`);
  }

  static async createApproval(data: Partial<Approval>) {
    return apiClient.post<Approval>('/approvals/', data);
 }

  static async approveContract(id: string) {
    return apiClient.post<Approval>(`/approvals/${id}/approve/`, {});
  }

  static async rejectContract(id: string, comment?: string) {
    return apiClient.post<Approval>(
      `/approvals/${id}/reject/`,
      comment ? { comment } : {}
    );
  }

  static async getApprovalQueue() {
    return apiClient.get<Approval[]>('/approvals/queue/');
  }
}

export class ExtractionAPI {
  static async getExtractedFields(contractId: string) {
    const endpoint = `/contracts/${contractId}/fields/`;
    return apiClient.get<{ results: ExtractedField[]; count: number }>(endpoint);
  }

  static async getExtractedField(id: string, contractId: string) {
    const endpoint = `/contracts/${contractId}/fields/${id}/`;
    return apiClient.get<ExtractedField>(endpoint);
  }

  static async reviewExtractedField(
    id: string,
    contractId: string,
    data: Partial<ExtractedField>
  ) {
    const endpoint = `/contracts/${contractId}/fields/${id}/review/`;
    return apiClient.patch<ExtractedField>(endpoint, data);
  }
}

export class PlaybookAPI {
  static async getPlaybooks() {
    return apiClient.get<{ results: Playbook[]; count: number }>('/playbooks/');
  }

  static async getPlaybook(id: string) {
    return apiClient.get<Playbook>(`/playbooks/${id}/`);
  }

  static async createPlaybook(data: Partial<Playbook>) {
    return apiClient.post<Playbook>('/playbooks/', data);
}

  static async updatePlaybook(id: string, data: Partial<Playbook>) {
    return apiClient.patch<Playbook>(`/playbooks/${id}/`, data);
  }

  static async deletePlaybook(id: string) {
    return apiClient.delete<{ message: string }>(`/playbooks/${id}/`);
  }

  static async getPlaybookRules(playbookId: string) {
    return apiClient.get<PlaybookRule[]>(`/playbooks/${playbookId}/rules/`);
  }

  static async addRuleToPlaybook(playbookId: string, data: Partial<PlaybookRule>) {
    return apiClient.post<PlaybookRule>(`/playbooks/${playbookId}/rules/`, data);
  }
}

export class ObligationAPI {
  static async getObligations(params?: { contract_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.contract_id) searchParams.append('contract_id', params.contract_id);
    const queryString = searchParams.toString();
    const endpoint = `/obligations/${queryString ? '?' + queryString : ''}`;

    return apiClient.get<{ results: Obligation[]; count: number }>(endpoint);
  }

  static async getObligation(id: string) {
    return apiClient.get<Obligation>(`/obligations/${id}/`);
  }

  static async createObligation(data: Partial<Obligation>) {
    return apiClient.post<Obligation>('/obligations/', data);
}

  static async updateObligation(id: string, data: Partial<Obligation>) {
    return apiClient.patch<Obligation>(`/obligations/${id}/`, data);
  }

  static async completeObligation(id: string) {
    return apiClient.patch<{ message: string }>(`/obligations/${id}/complete/`, {});
  }

  static async reopenObligation(id: string) {
    return apiClient.patch<{ message: string }>(`/obligations/${id}/reopen/`, {});
  }

  static async getUpcomingObligations(days?: number) {
    const endpoint = `/obligations/upcoming/${days ? `?days=${days}` : ''}`;
    return apiClient.get<Obligation[]>(endpoint);
  }

  static async getObligationsByContract(contractId: string) {
    return apiClient.get<{ results: Obligation[]; count: number }>(`/obligations/by-contract/?contract_id=${contractId}`);
  }
}

export class UserAPI {
  static async getUserProfiles() {
    return apiClient.get<{ results: any[]; count: number }>('/user-profiles/');
  }

  static async createUserProfile(data: any) {
    return apiClient.post<any>('/user-profiles/', data);
}

  static async getOrganizations() {
    return apiClient.get<{ results: any[]; count: number }>('/organizations/');
  }

  static async createOrganization(data: any) {
    return apiClient.post<any>('/organizations/', data);
}

  static async getSystemUsers() {
    return apiClient.get<{ results: User[]; count: number }>('/users/');
  }

  static async updateUser(id: string, data: Partial<User>) {
    return apiClient.patch<User>(`/users/${id}/`, data);
  }
}

export class SettingsAPI {
  static async getOrganizationSettings(params?: { organization_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.organization_id) searchParams.append('organization_id', params.organization_id);
    const queryString = searchParams.toString();
    const endpoint = `/settings/${queryString ? '?' + queryString : ''}`;

    return apiClient.get<{ results: any[]; count: number }>(endpoint);
  }

  static async createOrganizationSettings(data: any) {
    return apiClient.post<any>('/settings/', data);
  }

  static async updateOrganizationSettings(id: string, data: any) {
    return apiClient.patch<any>(`/settings/${id}/`, data);
  }
}

export { ApiError, apiClient };

// Health check endpoint
export async function healthCheck() {
  return apiClient.get<{ status: string; timestamp: string }>('/health/');
}