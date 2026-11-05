export type Book = {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  category?: string;
  shortDescription?: string;
  totalCopies?: number;
  copies?: number;
  addedBy?: string;
  addedByEmail?: string;
};
