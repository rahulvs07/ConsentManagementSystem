import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Settings,
  Key,
  Globe,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Activity,
  Server,
  Database,
  Webhook,
  Code,
  Lock,
  Unlock,
  TestTube,
  Download,
  Upload
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: 'production' | 'staging' | 'development';
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  isActive: boolean;
  usage: {
    totalRequests: number;
    dailyLimit: number;
    remainingRequests: number;
  };
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastDelivery?: Date;
  successRate: number;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
  };
}

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'CMS' | 'CRM' | 'ANALYTICS' | 'MARKETING' | 'CUSTOM';
  status: 'connected' | 'disconnected' | 'error';
  endpoint: string;
  authentication: {
    type: 'API_KEY' | 'OAUTH' | 'BASIC_AUTH' | 'BEARER_TOKEN';
    credentials: Record<string, string>;
  };
  configuration: Record<string, any>;
  lastSync?: Date;
  syncStatus: 'success' | 'failed' | 'pending';
}

interface RateLimitConfig {
  endpoint: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

export function IntegrationAPISettings() {
  console.log('IntegrationAPISettings component rendered'); // Debug log
  
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimitConfig[]>([]);
  
  const [selectedTab, setSelectedTab] = useState('api-keys');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string>('');
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [editingItem, setEditingItem] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [recentlyUpdated, setRecentlyUpdated] = useState<Record<string, boolean>>({});
  
  // API Key form
  const [keyForm, setKeyForm] = useState({
    name: '',
    environment: 'development' as 'production' | 'staging' | 'development',
    permissions: [] as string[],
    expiresAt: ''
  });
  
  // Webhook form
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });
  
  // Integration form
  const [integrationForm, setIntegrationForm] = useState({
    name: '',
    type: 'CUSTOM' as const,
    endpoint: '',
    authType: 'API_KEY' as const,
    credentials: {} as Record<string, string>
  });

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = () => {
    // Mock data - in real implementation, load from API
    const mockApiKeys: APIKey[] = [
      {
        id: 'key_1',
        name: 'Production API Key',
        key: 'pk_live_1234567890abcdef',
        environment: 'production',
        permissions: ['consent.read', 'consent.write', 'user.read'],
        createdAt: new Date('2024-01-01'),
        lastUsed: new Date('2024-01-15'),
        expiresAt: new Date('2024-12-31'),
        isActive: true,
        usage: {
          totalRequests: 15420,
          dailyLimit: 10000,
          remainingRequests: 8750
        }
      },
      {
        id: 'key_2',
        name: 'Development API Key',
        key: 'pk_test_abcdef1234567890',
        environment: 'development',
        permissions: ['consent.read', 'consent.write', 'user.read', 'admin.read'],
        createdAt: new Date('2024-01-10'),
        lastUsed: new Date('2024-01-14'),
        isActive: true,
        usage: {
          totalRequests: 2340,
          dailyLimit: 1000,
          remainingRequests: 890
        }
      }
    ];

    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: 'webhook_1',
        name: 'Consent Updates',
        url: 'https://api.example.com/webhooks/consent',
        events: ['consent.granted', 'consent.withdrawn', 'consent.expired'],
        isActive: true,
        secret: 'whsec_1234567890abcdef',
        lastDelivery: new Date('2024-01-15'),
        successRate: 98.5,
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000
        }
      },
      {
        id: 'webhook_2',
        name: 'User Events',
        url: 'https://api.example.com/webhooks/users',
        events: ['user.created', 'user.updated', 'grievance.submitted'],
        isActive: false,
        secret: 'whsec_abcdef1234567890',
        lastDelivery: new Date('2024-01-10'),
        successRate: 95.2,
        retryPolicy: {
          maxRetries: 5,
          retryDelay: 10000
        }
      }
    ];

    const mockIntegrations: IntegrationConfig[] = [
      {
        id: 'int_1',
        name: 'WordPress CMS',
        type: 'CMS',
        status: 'connected',
        endpoint: 'https://cms.example.com/wp-json/wp/v2',
        authentication: {
          type: 'API_KEY',
          credentials: {
            apiKey: 'wp_key_1234567890'
          }
        },
        configuration: {
          syncInterval: 3600,
          autoPublish: true
        },
        lastSync: new Date('2024-01-15'),
        syncStatus: 'success'
      },
      {
        id: 'int_2',
        name: 'Salesforce CRM',
        type: 'CRM',
        status: 'error',
        endpoint: 'https://api.salesforce.com/services/data/v58.0',
        authentication: {
          type: 'OAUTH',
          credentials: {
            clientId: 'sf_client_123',
            clientSecret: 'sf_secret_456'
          }
        },
        configuration: {
          syncInterval: 1800,
          fieldMapping: {}
        },
        lastSync: new Date('2024-01-14'),
        syncStatus: 'failed'
      }
    ];

    const mockRateLimits: RateLimitConfig[] = [
      {
        endpoint: '/api/consent/validate',
        requestsPerMinute: 100,
        requestsPerHour: 5000,
        requestsPerDay: 100000,
        burstLimit: 200
      },
      {
        endpoint: '/api/user/profile',
        requestsPerMinute: 50,
        requestsPerHour: 2000,
        requestsPerDay: 20000,
        burstLimit: 100
      }
    ];

    setApiKeys(mockApiKeys);
    setWebhooks(mockWebhooks);
    setIntegrations(mockIntegrations);
    setRateLimits(mockRateLimits);
  };

  const handleCreateApiKey = async () => {
    setLoadingStates(prev => ({ ...prev, createKey: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: keyForm.name,
      key: `pk_${keyForm.environment === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substr(2, 16)}`,
      environment: keyForm.environment,
      permissions: keyForm.permissions,
      createdAt: new Date(),
      expiresAt: keyForm.expiresAt ? new Date(keyForm.expiresAt) : undefined,
      isActive: true,
      usage: {
        totalRequests: 0,
        dailyLimit: keyForm.environment === 'production' ? 10000 : 1000,
        remainingRequests: keyForm.environment === 'production' ? 10000 : 1000
      }
    };

    setApiKeys([...apiKeys, newKey]);
    setIsCreatingKey(false);
    setLoadingStates(prev => ({ ...prev, createKey: false }));
    setSuccessMessage(`API Key "${newKey.name}" created successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    setKeyForm({
      name: '',
      environment: 'development',
      permissions: [],
      expiresAt: ''
    });
  };

  const handleCreateWebhook = async () => {
    setLoadingStates(prev => ({ ...prev, createWebhook: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const newWebhook: WebhookEndpoint = {
      id: `webhook_${Date.now()}`,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      isActive: true,
      secret: webhookForm.secret || `whsec_${Math.random().toString(36).substr(2, 16)}`,
      successRate: 100,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 5000
      }
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsCreatingWebhook(false);
    setLoadingStates(prev => ({ ...prev, createWebhook: false }));
    setWebhookForm({
      name: '',
      url: '',
      events: [],
      secret: ''
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Enhanced action handlers with loading states
  const handleEditApiKey = async (keyId: string) => {
    setEditingItem(keyId);
    setLoadingStates(prev => ({ ...prev, [`edit_${keyId}`]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingStates(prev => ({ ...prev, [`edit_${keyId}`]: false }));
    setEditingItem('');
    // Here you would open edit dialog or navigate to edit page
  };

  const handleRegenerateApiKey = async (keyId: string) => {
    setIsRegenerating(keyId);
    setLoadingStates(prev => ({ ...prev, [`regenerate_${keyId}`]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate new key
    const newKeyValue = `pk_${Math.random() > 0.5 ? 'live' : 'test'}_${Math.random().toString(36).substr(2, 16)}`;
    
    setApiKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, key: newKeyValue, lastUsed: new Date() }
        : key
    ));
    
    setLoadingStates(prev => ({ ...prev, [`regenerate_${keyId}`]: false }));
    setIsRegenerating('');
    setSuccessMessage('API Key regenerated successfully!');
    setRecentlyUpdated(prev => ({ ...prev, [`apikey_${keyId}`]: true }));
    setTimeout(() => {
      setSuccessMessage('');
      setRecentlyUpdated(prev => ({ ...prev, [`apikey_${keyId}`]: false }));
    }, 3000);
  };

  const handleDeleteApiKey = async (keyId: string) => {
    setIsDeleting(keyId);
    setLoadingStates(prev => ({ ...prev, [`delete_${keyId}`]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    setLoadingStates(prev => ({ ...prev, [`delete_${keyId}`]: false }));
    setIsDeleting('');
  };

  const handleConfigureIntegration = async (integrationId: string) => {
    setIsConfiguring(integrationId);
    setLoadingStates(prev => ({ ...prev, [`configure_${integrationId}`]: true }));
    
    // Simulate configuration process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoadingStates(prev => ({ ...prev, [`configure_${integrationId}`]: false }));
    setIsConfiguring('');
  };

  const handleSyncIntegration = async (integrationId: string) => {
    setIsSyncing(integrationId);
    setLoadingStates(prev => ({ ...prev, [`sync_${integrationId}`]: true }));
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update integration status
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, lastSync: new Date(), syncStatus: 'success' as const }
        : integration
    ));
    
    setLoadingStates(prev => ({ ...prev, [`sync_${integrationId}`]: false }));
    setIsSyncing('');
  };

  const handleTestWebhook = async (webhookId: string) => {
    setLoadingStates(prev => ({ ...prev, [`test_${webhookId}`]: true }));
    
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update webhook last delivery
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, lastDelivery: new Date(), successRate: Math.min(100, webhook.successRate + 0.1) }
        : webhook
    ));
    
    setLoadingStates(prev => ({ ...prev, [`test_${webhookId}`]: false }));
  };

  const handleCardClick = (itemType: string, itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [`${itemType}_${itemId}`]: !prev[`${itemType}_${itemId}`]
    }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setSelectedTab('api-keys');
            break;
          case 'w':
            event.preventDefault();
            setSelectedTab('webhooks');
            break;
          case 'i':
            event.preventDefault();
            setSelectedTab('integrations');
            break;
          case 'r':
            event.preventDefault();
            setSelectedTab('rate-limits');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const testConnection = async (integrationId: string) => {
    setIsTestingConnection(integrationId);
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection('');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEnvironmentBadge = (environment: string) => {
    const colors = {
      production: 'bg-red-100 text-red-800',
      staging: 'bg-yellow-100 text-yellow-800',
      development: 'bg-blue-100 text-blue-800'
    };
    return colors[environment as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatKey = (key: string, show: boolean) => {
    if (show) return key;
    const prefix = key.split('_')[0] + '_' + key.split('_')[1];
    return prefix + '_' + '•'.repeat(16);
  };

  // Custom Loading Button Component with animated progress bar
  const LoadingButton = ({ 
    isLoading, 
    onClick, 
    children, 
    variant = "default", 
    size = "default", 
    className = "",
    disabled = false,
    ...props 
  }: {
    isLoading: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    disabled?: boolean;
  }) => {
    const [progress, setProgress] = useState(0);

    React.useEffect(() => {
      if (isLoading) {
        setProgress(0);
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
        return () => clearInterval(interval);
      } else {
        setProgress(0);
      }
    }, [isLoading]);

    return (
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden transition-all duration-200 ${className} ${
          isLoading ? 'cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <>
            <div 
              className="absolute inset-0 bg-green-500 origin-left transition-all duration-100 ease-out"
              style={{ 
                width: `${progress}%`,
                opacity: 0.4
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          </>
        )}
        <span className={`relative z-10 flex items-center ${isLoading ? 'text-white font-medium' : ''}`}>
          {isLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
          {children}
        </span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Prominent Header with Background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8" />
              Integration & API Settings
            </h2>
            <p className="text-blue-100 mt-2 text-lg">
              Manage API keys, webhooks, and third-party integrations
            </p>
            <p className="text-blue-200 text-sm mt-1">
              🎯 Interactive cards and buttons with loading animations
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge className="bg-white text-blue-600 font-semibold">
              ✨ Enhanced UI
            </Badge>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setSelectedTab('api-keys')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Key className="h-4 w-4 mr-2" />
                Quick API Key
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setSelectedTab('webhooks')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Webhook className="h-4 w-4 mr-2" />
                Quick Webhook
              </Button>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys" className="flex items-center gap-2" title="Ctrl+K">
            <Key className="h-4 w-4" />
            API Keys
            <kbd className="hidden sm:inline-block ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">⌘K</kbd>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2" title="Ctrl+W">
            <Webhook className="h-4 w-4" />
            Webhooks
            <kbd className="hidden sm:inline-block ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">⌘W</kbd>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2" title="Ctrl+I">
            <Globe className="h-4 w-4" />
            Integrations
            <kbd className="hidden sm:inline-block ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">⌘I</kbd>
          </TabsTrigger>
          <TabsTrigger value="rate-limits" className="flex items-center gap-2" title="Ctrl+R">
            <Shield className="h-4 w-4" />
            Rate Limits
            <kbd className="hidden sm:inline-block ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">⌘R</kbd>
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">API Keys</h3>
            <Dialog open={isCreatingKey} onOpenChange={setIsCreatingKey}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for accessing the DPDP compliance API
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="key-name">Name</Label>
                    <Input
                      id="key-name"
                      value={keyForm.name}
                      onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })}
                      placeholder="My API Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select value={keyForm.environment} onValueChange={(value: any) => setKeyForm({ ...keyForm, environment: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['consent.read', 'consent.write', 'user.read', 'user.write', 'admin.read', 'admin.write'].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={permission}
                            checked={keyForm.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setKeyForm({ ...keyForm, permissions: [...keyForm.permissions, permission] });
                              } else {
                                setKeyForm({ ...keyForm, permissions: keyForm.permissions.filter(p => p !== permission) });
                              }
                            }}
                          />
                          <Label htmlFor={permission} className="text-sm">{permission}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expires-at">Expires At (Optional)</Label>
                    <Input
                      id="expires-at"
                      type="date"
                      value={keyForm.expiresAt}
                      onChange={(e) => setKeyForm({ ...keyForm, expiresAt: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreatingKey(false)}>
                      Cancel
                    </Button>
                    <LoadingButton 
                      onClick={handleCreateApiKey} 
                      disabled={!keyForm.name}
                      isLoading={loadingStates.createKey || false}
                    >
                      {loadingStates.createKey ? 'Creating...' : 'Create Key'}
                    </LoadingButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <Card 
                key={apiKey.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedItems[`apikey_${apiKey.id}`] ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${
                  recentlyUpdated[`apikey_${apiKey.id}`] ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => handleCardClick('apikey', apiKey.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-base">{apiKey.name}</CardTitle>
                        <CardDescription>
                          Created {apiKey.createdAt.toLocaleDateString()}
                          {apiKey.lastUsed && ` • Last used ${apiKey.lastUsed.toLocaleDateString()}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEnvironmentBadge(apiKey.environment)}>
                        {apiKey.environment}
                      </Badge>
                      {apiKey.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                        {formatKey(apiKey.key, showSecrets[apiKey.id])}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showSecrets[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Usage Today</Label>
                      <div className="mt-1">
                        <div className="text-2xl font-bold">
                          {(apiKey.usage.dailyLimit - apiKey.usage.remainingRequests).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          of {apiKey.usage.dailyLimit.toLocaleString()} requests
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${((apiKey.usage.dailyLimit - apiKey.usage.remainingRequests) / apiKey.usage.dailyLimit) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Total Requests</Label>
                      <div className="text-2xl font-bold mt-1">
                        {apiKey.usage.totalRequests.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {apiKey.expiresAt && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This API key expires on {apiKey.expiresAt.toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <LoadingButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditApiKey(apiKey.id)}
                      isLoading={loadingStates[`edit_${apiKey.id}`] || false}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {loadingStates[`edit_${apiKey.id}`] ? 'Editing...' : 'Edit'}
                    </LoadingButton>
                    <LoadingButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRegenerateApiKey(apiKey.id)}
                      isLoading={loadingStates[`regenerate_${apiKey.id}`] || false}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {loadingStates[`regenerate_${apiKey.id}`] ? 'Regenerating...' : 'Regenerate'}
                    </LoadingButton>
                    <LoadingButton 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      isLoading={loadingStates[`delete_${apiKey.id}`] || false}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {loadingStates[`delete_${apiKey.id}`] ? 'Deleting...' : 'Delete'}
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Webhook Endpoints</h3>
            <Dialog open={isCreatingWebhook} onOpenChange={setIsCreatingWebhook}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Webhook Endpoint</DialogTitle>
                  <DialogDescription>
                    Configure a webhook to receive real-time event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-name">Name</Label>
                    <Input
                      id="webhook-name"
                      value={webhookForm.name}
                      onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                      placeholder="My Webhook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="webhook-url">Endpoint URL</Label>
                    <Input
                      id="webhook-url"
                      value={webhookForm.url}
                      onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                      placeholder="https://api.example.com/webhooks"
                    />
                  </div>
                  <div>
                    <Label>Events to Subscribe</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'consent.granted',
                        'consent.withdrawn',
                        'consent.expired',
                        'user.created',
                        'user.updated',
                        'grievance.submitted',
                        'grievance.resolved',
                        'data.deleted'
                      ].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={event}
                            checked={webhookForm.events.includes(event)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWebhookForm({ ...webhookForm, events: [...webhookForm.events, event] });
                              } else {
                                setWebhookForm({ ...webhookForm, events: webhookForm.events.filter(ev => ev !== event) });
                              }
                            }}
                          />
                          <Label htmlFor={event} className="text-sm">{event}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
                    <Input
                      id="webhook-secret"
                      value={webhookForm.secret}
                      onChange={(e) => setWebhookForm({ ...webhookForm, secret: e.target.value })}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreatingWebhook(false)}>
                      Cancel
                    </Button>
                    <LoadingButton 
                      onClick={handleCreateWebhook} 
                      disabled={!webhookForm.name || !webhookForm.url}
                      isLoading={loadingStates.createWebhook || false}
                    >
                      {loadingStates.createWebhook ? 'Creating...' : 'Create Webhook'}
                    </LoadingButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card 
                key={webhook.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedItems[`webhook_${webhook.id}`] ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleCardClick('webhook', webhook.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Webhook className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-base">{webhook.name}</CardTitle>
                        <CardDescription>{webhook.url}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {webhook.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                      <Badge variant="secondary">
                        {webhook.successRate.toFixed(1)}% success
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Events</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Delivery</Label>
                      <div className="text-sm mt-1">
                        {webhook.lastDelivery ? webhook.lastDelivery.toLocaleString() : 'Never'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Webhook Secret</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                        {showSecrets[webhook.id] ? webhook.secret : '•'.repeat(20)}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyVisibility(webhook.id)}
                      >
                        {showSecrets[webhook.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(webhook.secret)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <LoadingButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id)}
                      isLoading={loadingStates[`test_${webhook.id}`] || false}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {loadingStates[`test_${webhook.id}`] ? 'Testing...' : 'Test'}
                    </LoadingButton>
                    <LoadingButton variant="outline" size="sm" isLoading={false}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </LoadingButton>
                    <LoadingButton variant="destructive" size="sm" isLoading={false}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Third-Party Integrations</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card 
                key={integration.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedItems[`integration_${integration.id}`] ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleCardClick('integration', integration.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription>{integration.endpoint}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{integration.type}</Badge>
                      <Badge
                        className={
                          integration.status === 'connected'
                            ? 'bg-green-100 text-green-800'
                            : integration.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Authentication</Label>
                      <div className="text-sm mt-1">{integration.authentication.type}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Sync</Label>
                      <div className="text-sm mt-1">
                        {integration.lastSync ? integration.lastSync.toLocaleString() : 'Never'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Sync Status</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(integration.syncStatus)}
                        <span className="text-sm capitalize">{integration.syncStatus}</span>
                      </div>
                    </div>
                  </div>

                  {integration.status === 'error' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Connection failed. Please check your configuration and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(integration.id)}
                      isLoading={isTestingConnection === integration.id}
                    >
                      {isTestingConnection === integration.id ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      {isTestingConnection === integration.id ? 'Testing...' : 'Test Connection'}
                    </LoadingButton>
                    <LoadingButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncIntegration(integration.id)}
                      isLoading={loadingStates[`sync_${integration.id}`] || false}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {loadingStates[`sync_${integration.id}`] ? 'Syncing...' : 'Sync Now'}
                    </LoadingButton>
                    <LoadingButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration.id)}
                      isLoading={loadingStates[`configure_${integration.id}`] || false}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {loadingStates[`configure_${integration.id}`] ? 'Configuring...' : 'Configure'}
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rate Limits Tab */}
        <TabsContent value="rate-limits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">API Rate Limits</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rate Limit
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limit Configuration</CardTitle>
              <CardDescription>
                Configure rate limits for different API endpoints to prevent abuse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Per Minute</TableHead>
                    <TableHead>Per Hour</TableHead>
                    <TableHead>Per Day</TableHead>
                    <TableHead>Burst Limit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimits.map((limit, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{limit.endpoint}</TableCell>
                      <TableCell>{limit.requestsPerMinute}</TableCell>
                      <TableCell>{limit.requestsPerHour.toLocaleString()}</TableCell>
                      <TableCell>{limit.requestsPerDay.toLocaleString()}</TableCell>
                      <TableCell>{limit.burstLimit}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply rate limits to all API endpoints
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Block on Limit Exceeded</Label>
                  <p className="text-sm text-muted-foreground">
                    Block requests when rate limit is exceeded
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Send Rate Limit Headers</Label>
                  <p className="text-sm text-muted-foreground">
                    Include rate limit information in response headers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntegrationAPISettings; 