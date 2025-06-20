import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface ProcessingPurpose {
  id: string;
  name: string;
  description: string;
  category: 'essential' | 'marketing' | 'analytics' | 'personalization' | 'security' | 'legal' | 'research' | 'other';
  legalBasis: string;
  dataCategories: string[];
  retentionPeriod: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  translations: Record<string, { name: string; description: string }>;
}

interface DataCategory {
  id: string;
  name: string;
  description: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  examples: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PURPOSE_CATEGORIES = [
  { value: 'essential', label: 'Essential Services', color: 'bg-green-100 text-green-800', description: 'Required for core service delivery' },
  { value: 'marketing', label: 'Marketing', color: 'bg-blue-100 text-blue-800', description: 'Promotional communications and campaigns' },
  { value: 'analytics', label: 'Analytics', color: 'bg-purple-100 text-purple-800', description: 'Usage analysis and insights' },
  { value: 'personalization', label: 'Personalization', color: 'bg-orange-100 text-orange-800', description: 'Customized user experience' },
  { value: 'security', label: 'Security', color: 'bg-red-100 text-red-800', description: 'Security and fraud prevention' },
  { value: 'legal', label: 'Legal Compliance', color: 'bg-gray-100 text-gray-800', description: 'Legal and regulatory requirements' },
  { value: 'research', label: 'Research', color: 'bg-yellow-100 text-yellow-800', description: 'Research and development' },
  { value: 'other', label: 'Other', color: 'bg-indigo-100 text-indigo-800', description: 'Other specified purposes' }
];

const SENSITIVITY_LEVELS = [
  { value: 'public', label: 'Public', color: 'bg-green-100 text-green-800', description: 'Publicly available information' },
  { value: 'internal', label: 'Internal', color: 'bg-blue-100 text-blue-800', description: 'Internal use only' },
  { value: 'confidential', label: 'Confidential', color: 'bg-orange-100 text-orange-800', description: 'Confidential data requiring protection' },
  { value: 'restricted', label: 'Restricted', color: 'bg-red-100 text-red-800', description: 'Highly sensitive data with strict access controls' }
];

export const CategoryPurposeManager: React.FC = () => {
  const [purposes, setPurposes] = useState<ProcessingPurpose[]>([
    {
      id: 'P-001',
      name: 'Account Management',
      description: 'Creating and managing user accounts, authentication, and profile management',
      category: 'essential',
      legalBasis: 'Performance of contract',
      dataCategories: ['personal_identifiers', 'contact_information'],
      retentionPeriod: '5 years after account closure',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      usageCount: 1247,
      translations: {
        'hi': {
          name: 'खाता प्रबंधन',
          description: 'उपयोगकर्ता खाते बनाना और प्रबंधित करना, प्रमाणीकरण, और प्रोफ़ाइल प्रबंधन'
        }
      }
    },
    {
      id: 'P-002',
      name: 'Marketing Communications',
      description: 'Sending promotional emails, newsletters, and marketing campaigns',
      category: 'marketing',
      legalBasis: 'Consent',
      dataCategories: ['contact_information', 'behavioral_data'],
      retentionPeriod: '2 years after consent withdrawal',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      usageCount: 856,
      translations: {
        'hi': {
          name: 'विपणन संचार',
          description: 'प्रचारक ईमेल, न्यूज़लेटर, और विपणन अभियान भेजना'
        }
      }
    }
  ]);

  const [categories, setCategories] = useState<DataCategory[]>([
    {
      id: 'personal_identifiers',
      name: 'Personal Identifiers',
      description: 'Information that directly identifies an individual',
      sensitivity: 'confidential',
      examples: ['Name', 'Email', 'Phone Number', 'Aadhaar Number'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'contact_information',
      name: 'Contact Information',
      description: 'Communication details for reaching individuals',
      sensitivity: 'internal',
      examples: ['Address', 'Phone', 'Email', 'Emergency Contact'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [selectedPurpose, setSelectedPurpose] = useState<ProcessingPurpose | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | null>(null);
  const [isCreatePurposeOpen, setIsCreatePurposeOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [newPurpose, setNewPurpose] = useState({
    name: '',
    description: '',
    category: 'essential' as const,
    legalBasis: '',
    dataCategories: [] as string[],
    retentionPeriod: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    sensitivity: 'internal' as const,
    examples: [] as string[],
    exampleInput: ''
  });

  const handleCreatePurpose = () => {
    if (!newPurpose.name.trim()) return;

    const purpose: ProcessingPurpose = {
      id: `P-${String(purposes.length + 1).padStart(3, '0')}`,
      name: newPurpose.name,
      description: newPurpose.description,
      category: newPurpose.category,
      legalBasis: newPurpose.legalBasis,
      dataCategories: newPurpose.dataCategories,
      retentionPeriod: newPurpose.retentionPeriod,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      translations: {}
    };

    setPurposes([...purposes, purpose]);
    setNewPurpose({
      name: '',
      description: '',
      category: 'essential',
      legalBasis: '',
      dataCategories: [],
      retentionPeriod: ''
    });
    setIsCreatePurposeOpen(false);
  };

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: DataCategory = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, '_'),
      name: newCategory.name,
      description: newCategory.description,
      sensitivity: newCategory.sensitivity,
      examples: newCategory.examples,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCategories([...categories, category]);
    setNewCategory({
      name: '',
      description: '',
      sensitivity: 'internal',
      examples: [],
      exampleInput: ''
    });
    setIsCreateCategoryOpen(false);
  };

  const handleAddExample = () => {
    if (newCategory.exampleInput.trim()) {
      setNewCategory({
        ...newCategory,
        examples: [...newCategory.examples, newCategory.exampleInput.trim()],
        exampleInput: ''
      });
    }
  };

  const handleRemoveExample = (index: number) => {
    setNewCategory({
      ...newCategory,
      examples: newCategory.examples.filter((_, i) => i !== index)
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = PURPOSE_CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getSensitivityColor = (sensitivity: string) => {
    const sens = SENSITIVITY_LEVELS.find(s => s.value === sensitivity);
    return sens ? sens.color : 'bg-gray-100 text-gray-800';
  };

  const filteredPurposes = purposes.filter(purpose => {
    const matchesSearch = purpose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purpose.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || purpose.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category & Purpose Management</h2>
          <p className="text-gray-600">Manage processing purposes and data categories for DPDP compliance</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Data Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Describe this data category"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="categorySensitivity">Sensitivity Level</Label>
                  <Select 
                    value={newCategory.sensitivity} 
                    onValueChange={(value: any) => setNewCategory({ ...newCategory, sensitivity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SENSITIVITY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Examples</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newCategory.exampleInput}
                      onChange={(e) => setNewCategory({ ...newCategory, exampleInput: e.target.value })}
                      placeholder="Add an example"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddExample()}
                    />
                    <Button type="button" onClick={handleAddExample}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newCategory.examples.map((example, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleRemoveExample(index)}>
                        {example} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreatePurposeOpen} onOpenChange={setIsCreatePurposeOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Purpose
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Processing Purpose</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purposeName">Purpose Name</Label>
                    <Input
                      id="purposeName"
                      value={newPurpose.name}
                      onChange={(e) => setNewPurpose({ ...newPurpose, name: e.target.value })}
                      placeholder="Enter purpose name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purposeCategory">Category</Label>
                    <Select 
                      value={newPurpose.category} 
                      onValueChange={(value: any) => setNewPurpose({ ...newPurpose, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PURPOSE_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div>
                              <div className="font-medium">{cat.label}</div>
                              <div className="text-xs text-gray-500">{cat.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="purposeDescription">Description</Label>
                  <Textarea
                    id="purposeDescription"
                    value={newPurpose.description}
                    onChange={(e) => setNewPurpose({ ...newPurpose, description: e.target.value })}
                    placeholder="Describe the processing purpose"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="legalBasis">Legal Basis</Label>
                  <Input
                    id="legalBasis"
                    value={newPurpose.legalBasis}
                    onChange={(e) => setNewPurpose({ ...newPurpose, legalBasis: e.target.value })}
                    placeholder="e.g., Consent, Contract, Legal obligation"
                  />
                </div>
                <div>
                  <Label htmlFor="retentionPeriod">Retention Period</Label>
                  <Input
                    id="retentionPeriod"
                    value={newPurpose.retentionPeriod}
                    onChange={(e) => setNewPurpose({ ...newPurpose, retentionPeriod: e.target.value })}
                    placeholder="e.g., 2 years after service termination"
                  />
                </div>
                <div>
                  <Label>Data Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map(category => (
                      <Badge
                        key={category.id}
                        variant={newPurpose.dataCategories.includes(category.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const isSelected = newPurpose.dataCategories.includes(category.id);
                          setNewPurpose({
                            ...newPurpose,
                            dataCategories: isSelected
                              ? newPurpose.dataCategories.filter(id => id !== category.id)
                              : [...newPurpose.dataCategories, category.id]
                          });
                        }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatePurposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePurpose}>
                  Create Purpose
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="purposes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="purposes">Processing Purposes</TabsTrigger>
          <TabsTrigger value="categories">Data Categories</TabsTrigger>
          <TabsTrigger value="mapping">Purpose-Category Mapping</TabsTrigger>
        </TabsList>

        {/* Processing Purposes Tab */}
        <TabsContent value="purposes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Processing Purposes
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search purposes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PURPOSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Legal Basis</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurposes.map((purpose) => (
                    <TableRow key={purpose.id}>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{purpose.id}</code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{purpose.name}</p>
                          <p className="text-sm text-gray-500">{purpose.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(purpose.category)}>
                          {PURPOSE_CATEGORIES.find(c => c.value === purpose.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{purpose.legalBasis}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{purpose.usageCount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        {purpose.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
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

        {/* Data Categories Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex gap-1">
                      <Badge className={getSensitivityColor(category.sensitivity)}>
                        {SENSITIVITY_LEVELS.find(s => s.value === category.sensitivity)?.label}
                      </Badge>
                      {category.isActive ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.map((example, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Purpose-Category Mapping Tab */}
        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Purpose-Category Mapping</CardTitle>
              <p className="text-sm text-gray-600">
                View how processing purposes are mapped to data categories
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purposes.map((purpose) => (
                  <div key={purpose.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{purpose.id}</code>
                        <div>
                          <h4 className="font-medium">{purpose.name}</h4>
                          <p className="text-sm text-gray-500">{purpose.description}</p>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(purpose.category)}>
                        {PURPOSE_CATEGORIES.find(c => c.value === purpose.category)?.label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Associated Data Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {purpose.dataCategories.map(categoryId => {
                          const category = categories.find(c => c.id === categoryId);
                          return category ? (
                            <Badge key={categoryId} variant="outline" className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Legal Basis:</strong> {purpose.legalBasis}</p>
                      <p><strong>Retention:</strong> {purpose.retentionPeriod}</p>
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
