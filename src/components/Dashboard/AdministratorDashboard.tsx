import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  FileText, 
  Tag, 
  Mail, 
  Database, 
  Activity, 
  Settings, 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { UserRoleManager } from '@/components/Admin/UserRoleManager';
import { ConsentTemplateManager } from '@/components/Admin/ConsentTemplateManager';
import { CategoryPurposeManager } from '@/components/Admin/CategoryPurposeManager';
import { SMTPNotificationSettings } from '@/components/Admin/SMTPNotificationSettings';
import { DataRetentionPolicies } from '@/components/Admin/DataRetentionPolicies';
import AuditLogViewer from '@/components/Admin/AuditLogViewer';
import { IntegrationAPISettings } from '@/components/Admin/IntegrationAPISettings';
import NoticeHistoryViewer from '@/components/Admin/NoticeHistoryViewer';

interface SystemHealthStatus {
  cmsConnection: 'healthy' | 'warning' | 'error';
  smtpService: 'healthy' | 'warning' | 'error';
  apiIntegrations: 'healthy' | 'warning' | 'error';
  auditLogging: 'healthy' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  module: string;
  status: 'success' | 'warning' | 'error';
}

interface PendingTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  module: string;
  dueDate?: Date;
}

const AdministratorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>({
    cmsConnection: 'healthy',
    smtpService: 'warning',
    apiIntegrations: 'healthy',
    auditLogging: 'healthy'
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Created new consent template',
      user: 'admin@company.com',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      module: 'Template Management',
      status: 'success'
    },
    {
      id: '2',
      action: 'Updated SMTP configuration',
      user: 'admin@company.com',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      module: 'Notification Settings',
      status: 'success'
    },
    {
      id: '3',
      action: 'Failed API integration test',
      user: 'system',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      module: 'API Settings',
      status: 'error'
    }
  ]);

  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([
    {
      id: '1',
      title: 'Review pending consent templates',
      priority: 'high',
      module: 'Template Management',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Configure SMTP SSL settings',
      priority: 'medium',
      module: 'Notification Settings'
    }
  ]);

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
          <p className="text-gray-600 mt-1">CMS Administration - Prototype by Comply Ark</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Shield className="h-3 w-3 mr-1" />
            Administrator Access
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-none lg:flex lg:flex-wrap">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="notices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notice History
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            SMTP/Notifications
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Retention
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getHealthIcon(systemHealth.cmsConnection)}
                  CMS Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getHealthColor(systemHealth.cmsConnection)}>
                  {systemHealth.cmsConnection.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getHealthIcon(systemHealth.smtpService)}
                  SMTP Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getHealthColor(systemHealth.smtpService)}>
                  {systemHealth.smtpService.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getHealthIcon(systemHealth.apiIntegrations)}
                  API Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getHealthColor(systemHealth.apiIntegrations)}>
                  {systemHealth.apiIntegrations.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getHealthIcon(systemHealth.auditLogging)}
                  Audit Logging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getHealthColor(systemHealth.auditLogging)}>
                  {systemHealth.auditLogging.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Configuration Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Configuration Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending tasks</p>
                ) : (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.module}</p>
                        {task.dueDate && (
                          <p className="text-xs text-orange-600">Due: {task.dueDate.toLocaleDateString()}</p>
                        )}
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Administrative Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {activity.status === 'success' ? 
                        <CheckCircle className="h-3 w-3 text-green-600" /> :
                        activity.status === 'warning' ?
                        <AlertTriangle className="h-3 w-3 text-yellow-600" /> :
                        <XCircle className="h-3 w-3 text-red-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.module} • {activity.user}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveTab('users')}>
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveTab('templates')}>
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Edit Templates</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveTab('notifications')}>
                  <Mail className="h-6 w-6" />
                  <span className="text-sm">SMTP Config</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveTab('audit')}>
                  <Activity className="h-6 w-6" />
                  <span className="text-sm">View Audit Logs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Role Management Tab */}
        <TabsContent value="users">
          <UserRoleManager />
        </TabsContent>

        {/* Consent Template Management Tab */}
        <TabsContent value="templates">
          <ConsentTemplateManager />
        </TabsContent>

        {/* Category & Purpose Management Tab */}
        <TabsContent value="categories">
          <CategoryPurposeManager />
        </TabsContent>

        {/* NEW: Notice History Tab */}
        <TabsContent value="notices">
          <NoticeHistoryViewer />
        </TabsContent>

        {/* SMTP/Notification Settings Tab */}
        <TabsContent value="notifications">
          <SMTPNotificationSettings />
        </TabsContent>

        {/* Data Retention Policies Tab */}
        <TabsContent value="retention">
          <DataRetentionPolicies />
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <AuditLogViewer userRole="system_admin" userId="admin_001" />
        </TabsContent>

        {/* Integration & API Settings Tab */}
        <TabsContent value="integrations">
          <IntegrationAPISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministratorDashboard; 