import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, Download, Calendar } from 'lucide-react';
import { NoticeArtifact } from '@/types/dpdp';

interface NoticeHistoryViewerProps {
  onArtifactSelected?: (artifact: NoticeArtifact) => void;
}

const NoticeHistoryViewer: React.FC<NoticeHistoryViewerProps> = ({ onArtifactSelected }) => {
  const [artifacts, setArtifacts] = useState<NoticeArtifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<NoticeArtifact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  // Mock data for demonstration
  useEffect(() => {
    const loadArtifacts = async () => {
      setLoading(true);
      try {
        const mockArtifacts: NoticeArtifact[] = [
          {
            id: 'notice_artifact_1',
            consentArtifactId: 'consent_artifact_1',
            templateId: 'template_standard_consent',
            templateVersion: '1.0',
            renderedHtml: '<div class="consent-notice"><h1>Standard Consent Notice</h1><p>We would like to collect your data for account management purposes...</p></div>',
            renderedPlainText: 'STANDARD CONSENT NOTICE\n\nWe would like to collect your data for account management purposes...',
            languageUsed: 'en',
            purposeIds: ['P-001', 'P-002'],
            dataCategories: ['Personal Information', 'Contact Details'],
            userType: 'adult',
            createdOn: new Date('2024-01-15T10:30:00Z'),
            integrity: {
              hash: 'a1b2c3d4e5f6',
              algorithm: 'SHA-256',
              verificationStatus: 'verified'
            },
            metadata: {
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              sessionId: 'session_123456',
              screenResolution: '1920x1080'
            }
          }
        ];
        
        setArtifacts(mockArtifacts);
      } catch (error) {
        console.error('Error loading notice artifacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, []);

  const filteredArtifacts = artifacts.filter(artifact =>
    artifact.templateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.languageUsed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.purposeIds.some(id => id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewArtifact = (artifact: NoticeArtifact) => {
    setSelectedArtifact(artifact);
    setActiveTab('preview');
    onArtifactSelected?.(artifact);
  };

  const handleDownloadArtifact = (artifact: NoticeArtifact, format: 'html' | 'text') => {
    const content = format === 'html' ? artifact.renderedHtml : artifact.renderedPlainText;
    const mimeType = format === 'html' ? 'text/html' : 'text/plain';
    const extension = format === 'html' ? 'html' : 'txt';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notice_${artifact.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading notice history...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Notice History & Artifacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Artifact List</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by template, language, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtifacts.map((artifact) => (
                  <TableRow key={artifact.id}>
                    <TableCell className="font-medium">
                      {artifact.templateId.replace('template_', '').replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>v{artifact.templateVersion}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {artifact.languageUsed.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={artifact.userType === 'minor' ? 'secondary' : 'default'}>
                        {artifact.userType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {artifact.createdOn.toLocaleDateString()} {artifact.createdOn.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        artifact.integrity.verificationStatus === 'verified' ? 'default' : 'destructive'
                      }>
                        {artifact.integrity.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewArtifact(artifact)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadArtifact(artifact, 'html')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          HTML
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {selectedArtifact ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Artifact Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {selectedArtifact.id}</div>
                      <div><strong>Template:</strong> {selectedArtifact.templateId}</div>
                      <div><strong>Version:</strong> v{selectedArtifact.templateVersion}</div>
                      <div><strong>Language:</strong> {selectedArtifact.languageUsed}</div>
                      <div><strong>User Type:</strong> {selectedArtifact.userType}</div>
                      <div><strong>Created:</strong> {selectedArtifact.createdOn.toLocaleString()}</div>
                      <div><strong>Purposes:</strong> {selectedArtifact.purposeIds.join(', ')}</div>
                      <div><strong>Categories:</strong> {selectedArtifact.dataCategories.join(', ')}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>IP Address:</strong> {selectedArtifact.metadata.ipAddress}</div>
                      <div><strong>Session:</strong> {selectedArtifact.metadata.sessionId}</div>
                      <div><strong>Screen:</strong> {selectedArtifact.metadata.screenResolution}</div>
                      <div><strong>Hash:</strong> {selectedArtifact.integrity.hash}</div>
                      <div><strong>Algorithm:</strong> {selectedArtifact.integrity.algorithm}</div>
                      <div><strong>Verification:</strong> 
                        <Badge variant={
                          selectedArtifact.integrity.verificationStatus === 'verified' ? 'default' : 'destructive'
                        } className="ml-2">
                          {selectedArtifact.integrity.verificationStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rendered Notice (HTML)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: selectedArtifact.renderedHtml }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Plain Text Version</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
                      {selectedArtifact.renderedPlainText}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select an artifact from the list to preview it here
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NoticeHistoryViewer; 