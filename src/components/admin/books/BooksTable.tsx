import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  BookOpen,
  Check,
  Download,
  Eye
} from 'lucide-react';
import { Book } from './types';
import BookDetailsModal from './BookDetailsModal';

interface BooksTableProps {
  books: Book[];
  getStatusBadge: (status: string | null) => JSX.Element;
  onReview: (book: Book) => void;
}

const BooksTable = ({ books, getStatusBadge, onReview }: BooksTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Author (User)</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {book.front_cover_url ? (
                    <img
                      src={book.front_cover_url}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{book.title}</div>
                    {book.explicit_content && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Explicit Content
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{book.author || 'Not specified'}</div>
                  <div className="text-sm text-muted-foreground">
                    {book.profiles?.full_name} ({book.profiles?.email})
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{book.genre || 'Not specified'}</Badge>
              </TableCell>
              <TableCell>{book.language || 'English'}</TableCell>
              <TableCell>{getStatusBadge(book.approval_status)}</TableCell>
              <TableCell>
                {new Date(book.uploaded_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <BookDetailsModal 
                    book={book} 
                    onReview={onReview}
                    getStatusBadge={getStatusBadge}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReview(book)}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Review
                  </Button>
                  {book.manuscript_url && (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <a href={book.manuscript_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={book.manuscript_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BooksTable;