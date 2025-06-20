import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  UserX,
  Clock
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'read' | 'write' | 'delete' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'predefined' | 'custom';
  permissions: string[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  mfaEnabled: boolean;
}

interface RoleChangeAudit {
  id: string;
  userId: string;
  userName: string;
  action: 'assigned' | 'revoked' | 'modified' | 'created' | 'deleted';
  oldRole?: string;
  newRole?: string;
  performedBy: string;
  timestamp: Date;
  ipAddress: string;
  reason?: string;
}

const PREDEFINED_PERMISSIONS: Permission[] = [
  // Read Permissions
  { id: 'read_users', name: 'View Users', description: 'View user accounts and basic information', category: 'read' },
  { id: 'read_consent', name: 'View Consent Records', description: 'View consent records and history', category: 'read' },
  { id: 'read_audit', name: 'View Audit Logs', description: 'Access audit logs and system activity', category: 'read' },
  { id: 'read_templates', name: 'View Templates', description: 'View consent notice templates', category: 'read' },
  { id: 'read_reports', name: 'View Reports', description: 'Access compliance and analytics reports', category: 'read' },
  
  // Write Permissions
  { id: 'write_consent', name: 'Manage Consent', description: 'Create, update consent records', category: 'write' },
  { id: 'write_templates', name: 'Manage Templates', description: 'Create and edit consent templates', category: 'write' },
  { id: 'write_notifications', name: 'Manage Notifications', description: 'Configure notification settings', category: 'write' },
  { id: 'write_categories', name: 'Manage Categories', description: 'Create and manage purpose categories', category: 'write' },
  { id: 'write_retention', name: 'Manage Retention', description: 'Configure data retention policies', category: 'write' },
  
  // Delete Permissions
  { id: 'delete_consent', name: 'Delete Consent Records', description: 'Permanently delete consent records', category: 'delete' },
  { id: 'delete_templates', name: 'Delete Templates', description: 'Remove consent templates', category: 'delete' },
  { id: 'delete_users', name: 'Delete Users', description: 'Remove user accounts', category: 'delete' },
  
  // Admin Permissions
  { id: 'admin_users', name: 'User Administration', description: 'Full user management capabilities', category: 'admin' },
  { id: 'admin_roles', name: 'Role Administration', description: 'Create and manage user roles', category: 'admin' },
  { id: 'admin_system', name: 'System Administration', description: 'System configuration and settings', category: 'admin' },
  { id: 'admin_api', name: 'API Administration', description: 'Manage API integrations and keys', category: 'admin' },
  { id: 'admin_audit', name: 'Audit Administration', description: 'Configure audit settings and export logs', category: 'admin' }
];

const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all administrative privileges',
    type: 'predefined',
    permissions: PREDEFINED_PERMISSIONS.map(p => p.id),
    userCount: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    isActive: true
  },
  {
    id: 'dpo',
    name: 'Data Protection Officer',
    description: 'Data protection oversight and compliance management',
    type: 'predefined',
    permissions: ['read_users', 'read_consent', 'read_audit', 'read_templates', 'read_reports', 'write_consent', 'write_templates', 'admin_audit'],
    userCount: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    isActive: true
  },
  {
    id: 'auditor',
    name: 'Auditor',
    description: 'Read-only access for compliance auditing',
    type: 'predefined',
    permissions: ['read_users', 'read_consent', 'read_audit', 'read_templates', 'read_reports'],
    userCount: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    isActive: true
  },
  {
    id: 'operator',
    name: 'Operator',
    description: 'Day-to-day consent management operations',
    type: 'predefined',
    permissions: ['read_consent', 'write_consent', 'read_templates', 'write_notifications'],
    userCount: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    isActive: true
  }
];

export const UserRoleManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(PREDEFINED_ROLES);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'System Administrator',
      email: 'admin@company.com',
      roleId: 'admin',
      roleName: 'Administrator',
      status: 'active',
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date('2024-01-01'),
      mfaEnabled: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      roleId: 'dpo',
      roleName: 'Data Protection Officer',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date('2024-01-15'),
      mfaEnabled: true
    }
  ]);
  
  const [auditLog, setAuditLog] = useState<RoleChangeAudit[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Jane Smith',
      action: 'assigned',
      newRole: 'Data Protection Officer',
      performedBy: 'admin@company.com',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      reason: 'New DPO appointment'
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const getPermissionsByCategory = (category: string) => {
    return PREDEFINED_PERMISSIONS.filter(p => p.category === category);
  };

  const getPermissionColor = (category: string) => {
    switch (category) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'write': return 'bg-green-100 text-green-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return;

    const role: Role = {
      id: `custom_${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      type: 'custom',
      permissions: newRole.permissions,
      userCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin@company.com',
      isActive: true
    };

    setRoles([...roles, role]);
    
    // Add audit log entry
    const auditEntry: RoleChangeAudit = {
      id: `audit_${Date.now()}`,
      userId: '',
      userName: '',
      action: 'created',
      newRole: role.name,
      performedBy: 'admin@company.com',
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      reason: 'Custom role creation'
    };
    setAuditLog([auditEntry, ...auditLog]);

    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreateRoleOpen(false);
  };

  const handleRevokeUserRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: 'suspended' as const }
        : u
    ));

    // Add audit log entry
    const auditEntry: RoleChangeAudit = {
      id: `audit_${Date.now()}`,
      userId: userId,
      userName: user.name,
      action: 'revoked',
      oldRole: user.roleName,
      performedBy: 'admin@company.com',
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      reason: 'Security revocation'
    };
    setAuditLog([auditEntry, ...auditLog]);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Role Management</h2>
          <p className="text-gray-600">Manage user roles, permissions, and access control</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
          <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Input
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Enter role description"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-4 mt-2">
                    {['read', 'write', 'delete', 'admin'].map(category => (
                      <div key={category} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2 capitalize flex items-center gap-2">
                          <Badge className={getPermissionColor(category)}>
                            {category}
                          </Badge>
                          Permissions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getPermissionsByCategory(category).map(permission => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={newRole.permissions.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewRole({
                                      ...newRole,
                                      permissions: [...newRole.permissions, permission.id]
                                    });
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      permissions: newRole.permissions.filter(p => p !== permission.id)
                                    });
                                  }
                                }}
                              />
                              <div>
                                <Label htmlFor={permission.id} className="text-sm font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {role.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Badge variant={role.type === 'predefined' ? 'default' : 'secondary'}>
                        {role.type}
                      </Badge>
                      {role.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Users assigned:</span>
                    <span className="font-medium">{role.userCount}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions ({role.permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(permId => {
                        const perm = PREDEFINED_PERMISSIONS.find(p => p.id === permId);
                        return perm ? (
                          <Badge key={permId} variant="outline" className="text-xs">
                            {perm.name}
                          </Badge>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {role.type === 'custom' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.roleName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <span className="text-sm text-gray-600">
                            {user.lastLogin.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.mfaEnabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRevokeUserRole(user.id)}
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Role Change Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          entry.action === 'assigned' ? 'bg-green-100 text-green-800' :
                          entry.action === 'revoked' ? 'bg-red-100 text-red-800' :
                          entry.action === 'created' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {entry.action}
                        </Badge>
                        <span className="font-medium">
                          {entry.userName || 'System'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {entry.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Action:</strong> {entry.action} 
                        {entry.oldRole && ` from ${entry.oldRole}`}
                        {entry.newRole && ` to ${entry.newRole}`}
                      </p>
                      <p><strong>Performed by:</strong> {entry.performedBy}</p>
                      <p><strong>IP Address:</strong> {entry.ipAddress}</p>
                      {entry.reason && <p><strong>Reason:</strong> {entry.reason}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};