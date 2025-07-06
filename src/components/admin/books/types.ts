export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  genre: string | null;
  description: string | null;
  language: string | null;
  asin: string | null;
  manuscript_url: string | null;
  front_cover_url: string | null;
  explicit_content: boolean | null;
  upload_status: string | null;
  approval_status: string | null;
  admin_feedback: string | null;
  author_note: string | null;
  uploaded_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export interface BookReviewFormProps {
  book: Book;
  onUpdate: (bookId: string, status: string, feedback?: string) => void;
  onCancel: () => void;
}