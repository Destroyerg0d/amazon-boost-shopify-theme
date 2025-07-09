import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, UserCheck, UserX, MessageSquare, Search, Filter } from "lucide-react";

interface CommunityReader {
  id: string;
  email: string;
  full_name: string;
  age: number | null;
  location: string | null;
  occupation: string | null;
  reading_experience: string | null;
  favorite_genres: string[] | null;
  reading_frequency: string | null;
  recent_book_purchases: string | null;
  preferred_book_formats: string[] | null;
  social_media_handles: any;
  why_join_community: string | null;
  monthly_book_budget: string | null;
  review_writing_experience: string | null;
  status: string;
  admin_notes: string | null;
  reviews_given: number;
  created_at: string;
  updated_at: string;
}

export const AdminReaders = () => {
  const [readers, setReaders] = useState<CommunityReader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReader, setSelectedReader] = useState<CommunityReader | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      const { data, error } = await supabase
        .from('community_readers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReaders(data || []);
    } catch (error) {
      console.error('Error fetching readers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch community readers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReaderStatus = async (readerId: string, status: string, notes?: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('community_readers')
        .update({ 
          status,
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', readerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Reader status updated to ${status}`,
      });

      fetchReaders();
    } catch (error) {
      console.error('Error updating reader:', error);
      toast({
        title: "Error",
        description: "Failed to update reader status",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const filteredReaders = readers.filter(reader => {
    const matchesSearch = reader.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reader.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reader.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const formatGenres = (genres: string[] | null) => {
    if (!genres || genres.length === 0) return "None specified";
    return genres.slice(0, 3).join(", ") + (genres.length > 3 ? "..." : "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading community readers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Community Readers Management
          </CardTitle>
          <CardDescription>
            Manage community reader applications and approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{readers.length}</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {readers.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {readers.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {readers.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Readers Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reader</TableHead>
                  <TableHead>Reading Profile</TableHead>
                  <TableHead>Favorite Genres</TableHead>
                  <TableHead>Reviews Given</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReaders.map((reader) => (
                  <TableRow key={reader.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reader.full_name}</div>
                        <div className="text-sm text-muted-foreground">{reader.email}</div>
                        {reader.location && (
                          <div className="text-xs text-muted-foreground">{reader.location}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {reader.reading_experience && (
                          <div className="text-sm capitalize">{reader.reading_experience.replace('-', ' ')}</div>
                        )}
                        {reader.reading_frequency && (
                          <div className="text-xs text-muted-foreground">
                            Reads: {reader.reading_frequency.replace('-', ' ')}
                          </div>
                        )}
                        {reader.monthly_book_budget && (
                          <div className="text-xs text-muted-foreground">
                            Budget: {reader.monthly_book_budget.replace('-', ' ')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatGenres(reader.favorite_genres)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-medium">{reader.reviews_given}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reader.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(reader.created_at)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReader(reader);
                                setAdminNotes(reader.admin_notes || "");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Reader Application Details</DialogTitle>
                              <DialogDescription>
                                Review and manage {selectedReader?.full_name}'s application
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedReader && (
                              <div className="space-y-6">
                                {/* Personal Info */}
                                <div>
                                  <h4 className="font-semibold mb-2">Personal Information</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><strong>Name:</strong> {selectedReader.full_name}</div>
                                    <div><strong>Email:</strong> {selectedReader.email}</div>
                                    <div><strong>Age:</strong> {selectedReader.age || "Not specified"}</div>
                                    <div><strong>Location:</strong> {selectedReader.location || "Not specified"}</div>
                                    <div className="col-span-2"><strong>Occupation:</strong> {selectedReader.occupation || "Not specified"}</div>
                                  </div>
                                </div>

                                {/* Reading Profile */}
                                <div>
                                  <h4 className="font-semibold mb-2">Reading Profile</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Experience:</strong> {selectedReader.reading_experience || "Not specified"}</div>
                                    <div><strong>Frequency:</strong> {selectedReader.reading_frequency || "Not specified"}</div>
                                    <div><strong>Budget:</strong> {selectedReader.monthly_book_budget || "Not specified"}</div>
                                    <div><strong>Favorite Genres:</strong> {selectedReader.favorite_genres?.join(", ") || "None specified"}</div>
                                    <div><strong>Preferred Formats:</strong> {selectedReader.preferred_book_formats?.join(", ") || "None specified"}</div>
                                  </div>
                                </div>

                                {/* Social Media */}
                                {selectedReader.social_media_handles && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Social Media</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {Object.entries(selectedReader.social_media_handles).map(([platform, handle]) => (
                                        handle && (
                                          <div key={platform}>
                                            <strong className="capitalize">{platform}:</strong> {handle as string}
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Text Responses */}
                                {selectedReader.recent_book_purchases && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Recent Book Purchases</h4>
                                    <p className="text-sm bg-muted p-3 rounded">{selectedReader.recent_book_purchases}</p>
                                  </div>
                                )}

                                {selectedReader.review_writing_experience && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Review Writing Experience</h4>
                                    <p className="text-sm bg-muted p-3 rounded">{selectedReader.review_writing_experience}</p>
                                  </div>
                                )}

                                {selectedReader.why_join_community && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Why Join Community</h4>
                                    <p className="text-sm bg-muted p-3 rounded">{selectedReader.why_join_community}</p>
                                  </div>
                                )}

                                {/* Admin Notes */}
                                <div>
                                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this application..."
                                    rows={3}
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    onClick={() => updateReaderStatus(selectedReader.id, 'approved', adminNotes)}
                                    disabled={updating}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateReaderStatus(selectedReader.id, 'rejected', adminNotes)}
                                    disabled={updating}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => updateReaderStatus(selectedReader.id, 'pending', adminNotes)}
                                    disabled={updating}
                                  >
                                    Set Pending
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {reader.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateReaderStatus(reader.id, 'approved')}
                              disabled={updating}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateReaderStatus(reader.id, 'rejected')}
                              disabled={updating}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredReaders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No community readers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};